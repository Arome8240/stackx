/**
 * StackX Transaction Simulator (Mongoose edition)
 *
 * Generates 500 Stacks accounts, stores them in MongoDB via Mongoose, simulates
 * realistic social-platform interactions, and tracks every transaction.
 *
 * Usage:
 *   MONGODB_URI=mongodb://localhost:27017/stackx-sim node scripts/simulate-transactions.mjs
 *
 * Options (env vars):
 *   MONGODB_URI      — MongoDB connection string (default: mongodb://localhost:27017/stackx-sim)
 *   ACCOUNT_COUNT    — number of accounts to generate (default: 500)
 *   CONTRACT_ADDRESS — deployed contract ID (optional)
 *   STACKS_NETWORK   — mainnet | testnet (default: testnet)
 *   FETCH_BALANCES   — set to "true" to hit the Stacks API for real balances
 *   STACKS_API_URL   — Stacks API base URL
 */

import txPkg from '@stacks/transactions';
import mongoose from 'mongoose';
import * as crypto from 'crypto';

const { makeRandomPrivKey, privateKeyToPublic, privateKeyToHex, publicKeyToHex, privateKeyToAddress } = txPkg;

// ── config ────────────────────────────────────────────────────────────────────
const MONGODB_URI      = process.env.MONGODB_URI      ?? 'mongodb://localhost:27017/stackx-sim';
const ACCOUNT_COUNT    = parseInt(process.env.ACCOUNT_COUNT ?? '500', 10);
const NETWORK          = (process.env.STACKS_NETWORK  ?? 'testnet').toLowerCase();
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS ?? 'STPLACEHOLDER.social-platform-v2';
const FETCH_BALANCES   = process.env.FETCH_BALANCES   === 'true';
const STACKS_API_URL   = process.env.STACKS_API_URL   ?? (NETWORK === 'mainnet' ? 'https://api.mainnet.hiro.so' : 'https://api.testnet.hiro.so');

// ── logging ───────────────────────────────────────────────────────────────────
const t    = () => new Date().toISOString().slice(11, 19);
const log  = (msg) => console.log(`[${t()}] ${msg}`);
const step = (msg) => console.log(`\n[${t()}] -- ${msg}`);
const ok   = (msg) => console.log(`[${t()}] ok  ${msg}`);

// ── helpers ───────────────────────────────────────────────────────────────────
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick    = (arr)      => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr)      => [...arr].sort(() => Math.random() - 0.5);
const fakeTxId = (seed)    => '0x' + crypto.createHash('sha256').update(seed + Math.random()).digest('hex');

// ── word lists ─────────────────────────────────────────────────────────────────
const ADJECTIVES = ['cosmic','digital','stellar','neon','silent','vivid','swift','bold','quiet','bright','atomic','lunar'];
const NOUNS      = ['wolf','phoenix','comet','pulse','wave','storm','spark','lens','drift','node','orbit','glyph'];
const BIOS = [
  'Building on Bitcoin. One block at a time.',
  'Clarity developer | STX maxi | open-source everything',
  'Decentralized social enthusiast.',
  'Engineer. Tinkering with Stacks.',
  'Content creator on StackX | NFT collector',
  'Community builder in the Stacks ecosystem',
];
const CAST_TEMPLATES = [
  'Just deployed my first Clarity contract!',
  'Bitcoin L2s are the future of decentralized social.',
  'Who else is building on StackX today?',
  'The on-chain social graph is finally here.',
  'Gm from the Stacks ecosystem!',
  'Clarity makes smart contracts readable by humans.',
  'Just minted my first cast NFT.',
  'STX tipping changed how I think about content.',
  'On-chain governance is the only real governance.',
  'Polls on-chain: vote with your wallet.',
  'Your social graph should be yours. StackX delivers.',
  'The feed is fully decentralized now.',
];

// ── Mongoose schemas ──────────────────────────────────────────────────────────
const AccountSchema = new mongoose.Schema({
  index:              { type: Number, required: true, unique: true },
  address:            { type: String, required: true, unique: true },
  privateKey:         { type: String, required: true },
  publicKey:          { type: String, required: true },
  username:           { type: String, required: true, unique: true },
  displayName:        { type: String, required: true },
  bio:                { type: String, default: '' },
  registered:         { type: Boolean, default: false },
  balance:            { type: Number, default: 0 },      // microSTX (on-chain)
  nonce:              { type: Number, default: 0 },      // on-chain nonce
  simNonce:           { type: Number, default: 0 },      // local simulation nonce
  followersCount:     { type: Number, default: 0 },
  followingCount:     { type: Number, default: 0 },
  castCount:          { type: Number, default: 0 },
  likeCount:          { type: Number, default: 0 },
  tipsSentMicro:      { type: Number, default: 0 },
  tipsReceivedMicro:  { type: Number, default: 0 },
  lastFetched:        { type: Date, default: null },
}, { timestamps: true });

const TransactionSchema = new mongoose.Schema({
  txId:             { type: String, required: true, unique: true },
  type:             {
    type: String,
    required: true,
    enum: [
      'register-user','update-profile',
      'create-cast','delete-cast','pin-cast',
      'like-cast','unlike-cast','recast','unrecast',
      'bookmark-cast','unbookmark-cast',
      'follow-user','unfollow-user',
      'tip-cast',
      'create-channel','join-channel','leave-channel',
      'mint-cast-nft','list-nft','buy-nft',
      'create-poll','vote-on-poll',
      'report-cast','flag-content',
    ],
  },
  fromAddress:      { type: String, required: true, index: true },
  toAddress:        { type: String, default: null },
  amount:           { type: Number, default: 0 },         // microSTX
  contractAddress:  { type: String, default: CONTRACT_ADDRESS },
  args:             { type: mongoose.Schema.Types.Mixed, default: {} },
  status:           { type: String, enum: ['simulated','pending','confirmed','failed'], default: 'simulated' },
  blockHeight:      { type: Number, default: null },
  isReply:          { type: Boolean, default: false },
}, { timestamps: true });

// Index frequently queried fields
TransactionSchema.index({ type: 1 });
TransactionSchema.index({ status: 1 });
TransactionSchema.index({ createdAt: -1 });
TransactionSchema.index({ fromAddress: 1, type: 1 });

const Account     = mongoose.model('SimAccount',     AccountSchema);
const Transaction = mongoose.model('SimTransaction', TransactionSchema);

// ── DB connect ────────────────────────────────────────────────────────────────
async function connectDb() {
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  ok(`Connected to MongoDB: ${mongoose.connection.db.databaseName}`);
}

// ── Record a simulated transaction ────────────────────────────────────────────
async function recordTx({ type, from, to = null, amount = 0, args = {}, isReply = false }) {
  const txId = fakeTxId(`${type}:${from}:${to}:${amount}:${JSON.stringify(args)}`);
  try {
    await Transaction.create({ txId, type, fromAddress: from, toAddress: to, amount, args, isReply });
  } catch (e) {
    if (e.code !== 11000) throw e; // ignore duplicate key
  }
  await Account.updateOne({ address: from }, { $inc: { simNonce: 1 } });
  return txId;
}

// ── Phase 1: Generate accounts ────────────────────────────────────────────────
async function generateAccounts() {
  step('Phase 1 -- Generating accounts');

  const existing = await Account.countDocuments();
  if (existing >= ACCOUNT_COUNT) {
    ok(`${existing} accounts already exist, skipping`);
    return Account.find({}).lean();
  }

  const docs = [];
  const usernameSet = new Set();

  for (let i = existing; i < ACCOUNT_COUNT; i++) {
    const privKey = makeRandomPrivKey();
    const privHex = privateKeyToHex(privKey);
    const pubHex  = publicKeyToHex(privateKeyToPublic(privKey));
    const address = privateKeyToAddress(privHex, NETWORK);

    // Unique username
    let username;
    do {
      username = `${pick(ADJECTIVES)}${pick(NOUNS)}${i}`;
    } while (usernameSet.has(username));
    usernameSet.add(username);

    docs.push({
      index:       i,
      address,
      privateKey:  privHex,
      publicKey:   pubHex,
      username,
      displayName: username.charAt(0).toUpperCase() + username.replace(/[0-9]/g, '').slice(1),
      bio:         pick(BIOS),
    });

    if ((i + 1) % 100 === 0) log(`  generated ${i + 1} / ${ACCOUNT_COUNT}`);
  }

  await Account.insertMany(docs, { ordered: false });
  ok(`Inserted ${docs.length} accounts`);
  return Account.find({}).lean();
}

// ── Phase 2: Fetch on-chain balances ──────────────────────────────────────────
async function fetchOnChainBalances(accs) {
  if (!FETCH_BALANCES) { log('Skipping on-chain fetch (FETCH_BALANCES=true to enable)'); return; }
  step('Phase 2 -- Fetching on-chain balances');

  const BATCH = 10;
  let fetched = 0;
  for (let i = 0; i < accs.length; i += BATCH) {
    await Promise.all(accs.slice(i, i + BATCH).map(async (acc) => {
      try {
        const res  = await fetch(`${STACKS_API_URL}/v2/accounts/${acc.address}?proof=0`, { signal: AbortSignal.timeout(8000) });
        if (!res.ok) return;
        const data = await res.json();
        const balance = parseInt(data.balance ?? '0x0', 16);
        await Account.updateOne({ address: acc.address }, { $set: { balance, nonce: data.nonce ?? 0, lastFetched: new Date() } });
        fetched++;
      } catch { /* skip */ }
    }));
    if ((i + BATCH) % 100 === 0) log(`  fetched ${Math.min(i + BATCH, accs.length)} / ${accs.length}`);
  }
  ok(`Fetched on-chain data for ${fetched} accounts`);
}

// ── Phase 3: Register users ───────────────────────────────────────────────────
async function registerUsers(accs) {
  step('Phase 3 -- register-user');
  for (const acc of accs) {
    await recordTx({
      type: 'register-user',
      from: acc.address,
      args: { username: acc.username, displayName: acc.displayName, bio: acc.bio, avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${acc.address}` },
    });
    await Account.updateOne({ address: acc.address }, { $set: { registered: true } });
  }
  ok(`${accs.length} register-user transactions recorded`);
}

// ── Phase 4: Follow graph ─────────────────────────────────────────────────────
async function buildFollowGraph(accs) {
  step('Phase 4 -- follow-user');
  let count = 0;
  const addresses = accs.map((a) => a.address);

  for (const acc of accs) {
    const targets = shuffle(addresses.filter((a) => a !== acc.address)).slice(0, randInt(3, 30));
    for (const target of targets) {
      await recordTx({ type: 'follow-user', from: acc.address, to: target, args: { user: target } });
      await Account.updateOne({ address: acc.address }, { $inc: { followingCount: 1 } });
      await Account.updateOne({ address: target },      { $inc: { followersCount: 1 } });
      count++;
    }
  }
  ok(`${count} follow-user transactions recorded`);
}

// ── Phase 5: Create casts ─────────────────────────────────────────────────────
async function createCasts(accs) {
  step('Phase 5 -- create-cast');
  let castId = 1;
  const castIds = [];

  for (const acc of accs) {
    const numCasts = randInt(1, 8);
    for (let j = 0; j < numCasts; j++) {
      await recordTx({
        type: 'create-cast',
        from: acc.address,
        args: { castId, content: `${pick(CAST_TEMPLATES)} — ${acc.username} #${castId}`, mediaUrl: null, parentCastId: null, channelId: null },
      });
      castIds.push({ id: castId, author: acc.address });
      await Account.updateOne({ address: acc.address }, { $inc: { castCount: 1 } });
      castId++;
    }
  }
  ok(`${castIds.length} create-cast transactions recorded`);
  return { castIds, nextCastId: castId };
}

// ── Phase 6: Likes & recasts ──────────────────────────────────────────────────
async function likesAndRecasts(accs, castIds) {
  step('Phase 6 -- like-cast / recast');
  let likes = 0, recasts = 0;

  for (const acc of accs) {
    for (const cast of shuffle(castIds).slice(0, randInt(5, 40))) {
      if (cast.author === acc.address) continue;
      await recordTx({ type: 'like-cast', from: acc.address, to: cast.author, args: { castId: cast.id } });
      await Account.updateOne({ address: acc.address }, { $inc: { likeCount: 1 } });
      likes++;
    }
    if (Math.random() < 0.3) {
      for (const cast of shuffle(castIds).slice(0, randInt(1, 5))) {
        if (cast.author === acc.address) continue;
        await recordTx({ type: 'recast', from: acc.address, to: cast.author, args: { castId: cast.id } });
        recasts++;
      }
    }
  }
  ok(`${likes} like-cast and ${recasts} recast transactions recorded`);
}

// ── Phase 7: STX tips ─────────────────────────────────────────────────────────
async function tipCasts(accs, castIds) {
  step('Phase 7 -- tip-cast');
  let count = 0;
  const tippers = shuffle(accs).slice(0, Math.floor(accs.length * 0.25));

  for (const tipper of tippers) {
    const targets = shuffle(castIds.filter((c) => c.author !== tipper.address)).slice(0, randInt(1, 5));
    for (const cast of targets) {
      const amount = randInt(1000, 100_000); // microSTX
      await recordTx({ type: 'tip-cast', from: tipper.address, to: cast.author, amount, args: { castId: cast.id, amount } });
      await Account.updateOne({ address: tipper.address }, { $inc: { tipsSentMicro:     amount } });
      await Account.updateOne({ address: cast.author },    { $inc: { tipsReceivedMicro: amount } });
      count++;
    }
  }
  ok(`${count} tip-cast transactions recorded`);
}

// ── Phase 8: Channels ─────────────────────────────────────────────────────────
async function createChannels(accs) {
  step('Phase 8 -- create-channel / join-channel');
  const NUM_CHANNELS = 10;
  let created = 0, joins = 0;
  const channelIds = [];

  const creators = shuffle(accs).slice(0, NUM_CHANNELS);
  for (let i = 0; i < creators.length; i++) {
    const channelId = i + 1;
    const isPaid    = i < 3;
    const entryFee  = isPaid ? randInt(1000, 10_000) : 0;
    await recordTx({ type: 'create-channel', from: creators[i].address, args: { channelId, name: `channel-${channelId}`, description: `Community channel ${channelId}`, isPaid, entryFee } });
    channelIds.push({ id: channelId, creator: creators[i].address, isPaid, entryFee });
    created++;
  }

  for (const acc of accs) {
    for (const ch of shuffle(channelIds).slice(0, randInt(0, 4))) {
      if (ch.creator === acc.address) continue;
      await recordTx({ type: 'join-channel', from: acc.address, amount: ch.isPaid ? ch.entryFee : 0, args: { channelId: ch.id } });
      joins++;
    }
  }
  ok(`${created} create-channel and ${joins} join-channel transactions recorded`);
}

// ── Phase 9: NFT minting ──────────────────────────────────────────────────────
async function mintNfts(accs, castIds) {
  step('Phase 9 -- mint-cast-nft');
  let count = 0, nftId = 1;
  const minters = shuffle(accs).slice(0, Math.floor(accs.length * 0.15));

  for (const minter of minters) {
    const myCasts = castIds.filter((c) => c.author === minter.address);
    if (!myCasts.length) continue;
    const cast = pick(myCasts);
    await recordTx({ type: 'mint-cast-nft', from: minter.address, args: { castId: cast.id, nftId, royaltyBps: randInt(100, 1000) } });
    nftId++;
    count++;
  }
  ok(`${count} mint-cast-nft transactions recorded`);
}

// ── Phase 10: Polls ───────────────────────────────────────────────────────────
async function createPolls(accs) {
  step('Phase 10 -- create-poll / vote-on-poll');
  const QUESTIONS = [
    { q: 'Which L2 has the best DX?',   opts: ['Stacks', 'Lightning', 'RSK', 'Liquid'] },
    { q: 'Best social media model?',     opts: ['Decentralized', 'Federated', 'Centralized'] },
    { q: 'Favorite Clarity feature?',   opts: ['Post-conditions', 'Types', 'On-chain ABI', 'Traits'] },
    { q: 'Gm or Gn?',                   opts: ['Gm', 'Gn'] },
    { q: 'Memes or Alpha?',             opts: ['Memes', 'Alpha', 'Both', 'Neither'] },
  ];
  let polls = 0, votes = 0;
  const pollIds = [];

  for (let i = 0; i < QUESTIONS.length; i++) {
    const pq = QUESTIONS[i];
    await recordTx({ type: 'create-poll', from: accs[randInt(0, accs.length - 1)].address, args: { pollId: i + 1, content: pq.q, options: pq.opts, durationBlocks: 144 } });
    pollIds.push({ id: i + 1, optionCount: pq.opts.length });
    polls++;
  }

  for (const acc of accs) {
    for (const poll of shuffle(pollIds).slice(0, randInt(0, pollIds.length))) {
      await recordTx({ type: 'vote-on-poll', from: acc.address, args: { pollId: poll.id, optionIndex: randInt(0, poll.optionCount - 1) } });
      votes++;
    }
  }
  ok(`${polls} create-poll and ${votes} vote-on-poll transactions recorded`);
}

// ── Phase 11: Replies ─────────────────────────────────────────────────────────
async function createReplies(accs, castIds, nextCastId) {
  step('Phase 11 -- reply casts');
  let count = 0;
  const repliers = shuffle(accs).slice(0, Math.floor(accs.length * 0.2));

  for (const replier of repliers) {
    const parent = pick(castIds);
    await recordTx({
      type:    'create-cast',
      from:    replier.address,
      isReply: true,
      args:    { castId: nextCastId, content: `Replying to #${parent.id}: great point! -- ${replier.username}`, parentCastId: parent.id, mediaUrl: null, channelId: null },
    });
    nextCastId++;
    count++;
  }
  ok(`${count} reply cast transactions recorded`);
}

// ── Summary ───────────────────────────────────────────────────────────────────
async function printSummary() {
  step('Summary');

  const totalAccounts = await Account.countDocuments();
  const totalTxs      = await Transaction.countDocuments();

  const byType = await Transaction.aggregate([
    { $group: { _id: '$type', count: { $sum: 1 } } },
    { $sort:  { count: -1 } },
  ]);

  const topTippers  = await Account.find({}).sort({ tipsSentMicro:  -1 }).limit(5).lean();
  const topAuthors  = await Account.find({}).sort({ castCount:      -1 }).limit(5).lean();
  const topFollowed = await Account.find({}).sort({ followersCount: -1 }).limit(5).lean();

  console.log('\n======================================================');
  console.log('  StackX Simulation Complete');
  console.log('======================================================');
  console.log(`  Accounts:     ${totalAccounts}`);
  console.log(`  Transactions: ${totalTxs}`);
  console.log('');
  console.log('  Transactions by type:');
  for (const { _id, count } of byType) {
    console.log(`    ${(_id ?? 'unknown').padEnd(22)} ${count}`);
  }
  console.log('');
  console.log('  Top tippers (STX sent):');
  for (const a of topTippers) {
    console.log(`    ${a.username.padEnd(28)} ${(a.tipsSentMicro / 1e6).toFixed(4)} STX`);
  }
  console.log('');
  console.log('  Most-followed:');
  for (const a of topFollowed) {
    console.log(`    ${a.username.padEnd(28)} ${a.followersCount} followers`);
  }
  console.log('');
  console.log('  Most prolific casters:');
  for (const a of topAuthors) {
    console.log(`    ${a.username.padEnd(28)} ${a.castCount} casts`);
  }
  console.log('======================================================');
  console.log('');
  console.log('  Example queries (mongosh):');
  console.log('    db.simtransactions.find({ type: "tip-cast" }).sort({ amount: -1 })');
  console.log('    db.simaccounts.find({ followersCount: { $gt: 20 } })');
  console.log('    db.simtransactions.find({ fromAddress: "<address>" })');
  console.log('======================================================\n');
}

// ── main ──────────────────────────────────────────────────────────────────────
async function main() {
  log(`StackX Transaction Simulator`);
  log(`Network: ${NETWORK} | Accounts: ${ACCOUNT_COUNT} | DB: ${MONGODB_URI}`);

  await connectDb();

  const accs = await generateAccounts();
  await fetchOnChainBalances(accs);
  await registerUsers(accs);
  await buildFollowGraph(accs);
  const { castIds, nextCastId } = await createCasts(accs);
  await likesAndRecasts(accs, castIds);
  await tipCasts(accs, castIds);
  await createChannels(accs);
  await mintNfts(accs, castIds);
  await createPolls(accs);
  await createReplies(accs, castIds, nextCastId);
  await printSummary();

  await mongoose.disconnect();
  log('Done.');
}

main().catch((err) => {
  console.error('[fatal]', err.message ?? err);
  process.exit(1);
});

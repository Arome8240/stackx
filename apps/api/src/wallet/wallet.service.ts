import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { randomSeedPhrase, generateWallet } from '@stacks/wallet-sdk';
import {
  getAddressFromPrivateKey,
  makeContractCall,
  broadcastTransaction,
  ClarityValue,
  PostCondition,
} from '@stacks/transactions';
import type { StacksNetworkName } from '@stacks/network';

export interface GeneratedWallet {
  stxAddress: string;
  encryptedPrivateKey: string;
}

export interface ContractCallRequest {
  functionName: string;
  functionArgs: ClarityValue[];
  postConditions?: PostCondition[];
  validateWithAbi?: boolean;
}

const AES_ALGORITHM = 'aes-256-gcm';

@Injectable()
export class WalletService {
  private readonly network: StacksNetworkName;
  private readonly contractAddress: string;
  private readonly contractName: string;
  private readonly encryptionKey: Buffer;

  constructor(private readonly config: ConfigService) {
    this.network = this.config.get<string>('app.stacksNetwork', 'testnet') as StacksNetworkName;
    this.contractAddress = this.config.get<string>('app.contractAddress', '');
    this.contractName = this.config.get<string>('app.contractName', 'social-platform-v2');

    const keyBase64 = this.config.get<string>('app.walletEncryptionKey', '');
    if (!keyBase64) {
      throw new InternalServerErrorException(
        'WALLET_ENCRYPTION_KEY is not set — cannot start wallet service safely.',
      );
    }
    const key = Buffer.from(keyBase64, 'base64');
    if (key.length !== 32) {
      throw new InternalServerErrorException(
        'WALLET_ENCRYPTION_KEY must decode to exactly 32 bytes (generate with: openssl rand -base64 32).',
      );
    }
    this.encryptionKey = key;
  }

  /** Generates a brand-new Stacks wallet. The raw private key is never returned — only its encrypted form. */
  async generateWallet(): Promise<GeneratedWallet> {
    const secretKey = randomSeedPhrase();
    const wallet = await generateWallet({ secretKey, password: '' });
    const privateKey = wallet.accounts[0].stxPrivateKey;
    const stxAddress = getAddressFromPrivateKey(privateKey, this.network);
    return {
      stxAddress,
      encryptedPrivateKey: this.encrypt(privateKey),
    };
  }

  private encrypt(plaintext: string): string {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(AES_ALGORITHM, this.encryptionKey, iv);
    const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return [iv.toString('base64'), authTag.toString('base64'), ciphertext.toString('base64')].join(':');
  }

  private decrypt(ciphertextPacked: string): string {
    const [ivB64, authTagB64, dataB64] = ciphertextPacked.split(':');
    const iv = Buffer.from(ivB64, 'base64');
    const authTag = Buffer.from(authTagB64, 'base64');
    const data = Buffer.from(dataB64, 'base64');
    const decipher = crypto.createDecipheriv(AES_ALGORITHM, this.encryptionKey, iv);
    decipher.setAuthTag(authTag);
    const plaintext = Buffer.concat([decipher.update(data), decipher.final()]);
    return plaintext.toString('utf8');
  }

  /**
   * Signs and broadcasts a contract call on behalf of a user, using their stored encrypted key.
   * The decrypted private key never leaves this function's scope — not logged, not returned.
   */
  async signAndBroadcastContractCall(
    encryptedPrivateKey: string,
    req: ContractCallRequest,
  ): Promise<{ txId: string }> {
    const senderKey = this.decrypt(encryptedPrivateKey);
    const transaction = await makeContractCall({
      contractAddress: this.contractAddress,
      contractName: this.contractName,
      functionName: req.functionName,
      functionArgs: req.functionArgs,
      postConditions: req.postConditions,
      validateWithAbi: req.validateWithAbi,
      senderKey,
      network: this.network,
    });
    const result = await broadcastTransaction({ transaction, network: this.network });
    if ('error' in result) {
      throw new InternalServerErrorException(`Broadcast failed: ${result.error} — ${result.reason ?? ''}`);
    }
    return { txId: result.txid };
  }
}

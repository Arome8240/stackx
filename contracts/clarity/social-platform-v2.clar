;; StackX Social Platform V2
;; Complete rewrite with: STX tipping, SIP-009 NFT minting, polls, paid channels,
;; bookmarks, content moderation, governance, and creator monetization.

;;  -- Traits ------------------------------------------------------------------

(define-trait sip009-nft-trait
  (
    (get-last-token-id () (response uint uint))
    (get-token-uri (uint) (response (optional (string-ascii 256)) uint))
    (get-owner (uint) (response (optional principal) uint))
    (transfer (uint principal principal) (response bool uint))
  )
)

;;  -- Constants --------------------------------------------------------------

(define-constant contract-owner tx-sender)

;; Error codes
(define-constant ERR-OWNER-ONLY          (err u100))
(define-constant ERR-NOT-FOUND           (err u101))
(define-constant ERR-UNAUTHORIZED        (err u102))
(define-constant ERR-ALREADY-EXISTS      (err u103))
(define-constant ERR-INVALID-INPUT       (err u104))
(define-constant ERR-INSUFFICIENT-FUNDS  (err u105))
(define-constant ERR-TRANSFER-FAILED     (err u106))
(define-constant ERR-NOT-MEMBER          (err u107))
(define-constant ERR-ALREADY-VOTED       (err u108))
(define-constant ERR-POLL-CLOSED         (err u109))
(define-constant ERR-SELF-ACTION         (err u110))
(define-constant ERR-SUSPENDED           (err u111))
(define-constant ERR-NFT-NOT-OWNED       (err u112))
(define-constant ERR-LISTING-NOT-FOUND   (err u113))
(define-constant ERR-USERNAME-RESERVED   (err u114))

;; Limits
(define-constant MAX-CONTENT-LEN  u560)
(define-constant MAX-IMAGES       u4)
(define-constant MAX-MENTIONS     u10)
(define-constant MAX-POLL-OPTIONS u4)
(define-constant MIN-TIP-AMOUNT   u1000)    ;; 0.001 STX in microSTX
(define-constant PLATFORM-FEE-BPS u250)     ;; 2.5% in basis points

;;  -- Data Variables ----------------------------------------------------------

(define-data-var platform-fee-bps       uint PLATFORM-FEE-BPS)
(define-data-var total-users            uint u0)
(define-data-var total-casts            uint u0)
(define-data-var total-channels         uint u0)
(define-data-var total-nfts             uint u0)
(define-data-var total-polls            uint u0)
(define-data-var platform-treasury      uint u0)
(define-data-var governance-proposal-id uint u0)

;;  -- NFT Token Definition ----------------------------------------------------

(define-non-fungible-token cast-nft uint)

;;  -- Data Maps --------------------------------------------------------------

;; -- Users --

(define-map users principal
  {
    username:        (string-ascii 50),
    display-name:    (string-utf8 100),
    bio:             (string-utf8 500),
    website:         (optional (string-ascii 100)),
    avatar-ipfs:     (string-ascii 100),
    banner-ipfs:     (optional (string-ascii 100)),
    location:        (optional (string-utf8 80)),
    verified:        bool,
    suspended:       bool,
    tier:            uint,           ;; 0=free 1=pro 2=creator
    followers-count: uint,
    following-count: uint,
    casts-count:     uint,
    tips-received:   uint,
    tips-given:      uint,
    nfts-minted:     uint,
    joined-at:       uint,
    last-active:     uint
  }
)

(define-map username-to-principal (string-ascii 50) principal)

;; -- Casts --

(define-map casts uint
  {
    author:          principal,
    content:         (string-utf8 560),
    images-ipfs:     (list 4 (string-ascii 100)),
    mentions:        (list 10 principal),
    parent-cast-id:  (optional uint),
    root-cast-id:    (optional uint),
    channel-id:      (optional uint),
    likes-count:     uint,
    recasts-count:   uint,
    replies-count:   uint,
    tips-count:      uint,
    tips-total:      uint,
    nft-id:          (optional uint),
    has-poll:        bool,
    poll-id:         (optional uint),
    deleted:         bool,
    pinned:          bool,
    timestamp:       uint
  }
)

;; -- Social Interactions --

(define-map cast-likes    { cast-id: uint, user: principal } bool)
(define-map cast-recasts  { cast-id: uint, user: principal } bool)
(define-map cast-bookmarks { cast-id: uint, user: principal } bool)
(define-map follows       { follower: principal, following: principal } bool)

;; -- Channels --

(define-map channels uint
  {
    name:            (string-ascii 50),
    description:     (string-utf8 500),
    image-ipfs:      (string-ascii 100),
    creator:         principal,
    is-paid:         bool,
    entry-fee:       uint,           ;; in microSTX; 0 = free
    members-count:   uint,
    casts-count:     uint,
    revenue-total:   uint,
    is-nsfw:         bool,
    is-private:      bool,
    created-at:      uint
  }
)

(define-map channel-members { channel-id: uint, user: principal } bool)
(define-map channel-name-to-id (string-ascii 50) uint)

;; -- NFT Marketplace --

(define-map nft-metadata uint
  {
    cast-id:     uint,
    creator:     principal,
    uri:         (string-ascii 256),
    edition:     uint,
    max-edition: uint,
    minted-at:   uint
  }
)

(define-map nft-listings uint
  {
    seller:    principal,
    price:     uint,          ;; microSTX
    listed-at: uint
  }
)

(define-map cast-nft-id uint uint)    ;; cast-id -> nft-id (first/canonical NFT)

;; -- Polls --

(define-map polls uint
  {
    cast-id:     uint,
    creator:     principal,
    question:    (string-utf8 200),
    option-a:    (string-utf8 100),
    option-b:    (string-utf8 100),
    option-c:    (optional (string-utf8 100)),
    option-d:    (optional (string-utf8 100)),
    votes-a:     uint,
    votes-b:     uint,
    votes-c:     uint,
    votes-d:     uint,
    total-votes: uint,
    ends-at:     uint,         ;; block height
    closed:      bool
  }
)

(define-map poll-votes { poll-id: uint, user: principal } uint)  ;; 1-4 = option voted

;; -- Notifications --

(define-map notifications { user: principal, notif-id: uint }
  {
    notif-type:  (string-ascii 20),
    from-user:   principal,
    cast-id:     (optional uint),
    amount:      (optional uint),
    timestamp:   uint,
    read:        bool
  }
)

(define-map user-notif-count principal uint)

;; -- Reports --

(define-map content-reports { cast-id: uint, reporter: principal }
  {
    reason:      (string-ascii 30),
    timestamp:   uint
  }
)

(define-map cast-report-count uint uint)

;; -- Governance --

(define-map governance-proposals uint
  {
    proposer:     principal,
    title:        (string-utf8 100),
    description:  (string-utf8 1000),
    yes-votes:    uint,
    no-votes:     uint,
    ends-at:      uint,
    executed:     bool,
    passed:       bool
  }
)

(define-map governance-votes { proposal-id: uint, voter: principal } bool)

;; -- User pins --

(define-map user-pinned-cast principal uint)

;;  -- Read-Only Functions ------------------------------------------------------

(define-read-only (get-user (user principal))
  (map-get? users user)
)

(define-read-only (get-username-owner (username (string-ascii 50)))
  (map-get? username-to-principal username)
)

(define-read-only (get-cast (cast-id uint))
  (map-get? casts cast-id)
)

(define-read-only (get-channel (channel-id uint))
  (map-get? channels channel-id)
)

(define-read-only (get-channel-by-name (name (string-ascii 50)))
  (match (map-get? channel-name-to-id name)
    id (map-get? channels id)
    none
  )
)

(define-read-only (get-poll (poll-id uint))
  (map-get? polls poll-id)
)

(define-read-only (get-nft-metadata (nft-id uint))
  (map-get? nft-metadata nft-id)
)

(define-read-only (get-nft-listing (nft-id uint))
  (map-get? nft-listings nft-id)
)

(define-read-only (is-following (follower principal) (following principal))
  (default-to false (map-get? follows { follower: follower, following: following }))
)

(define-read-only (has-liked-cast (cast-id uint) (user principal))
  (default-to false (map-get? cast-likes { cast-id: cast-id, user: user }))
)

(define-read-only (has-recasted (cast-id uint) (user principal))
  (default-to false (map-get? cast-recasts { cast-id: cast-id, user: user }))
)

(define-read-only (has-bookmarked (cast-id uint) (user principal))
  (default-to false (map-get? cast-bookmarks { cast-id: cast-id, user: user }))
)

(define-read-only (is-channel-member (channel-id uint) (user principal))
  (default-to false (map-get? channel-members { channel-id: channel-id, user: user }))
)

(define-read-only (get-poll-vote (poll-id uint) (user principal))
  (map-get? poll-votes { poll-id: poll-id, user: user })
)

(define-read-only (get-user-pinned-cast (user principal))
  (map-get? user-pinned-cast user)
)

(define-read-only (get-cast-report-count (cast-id uint))
  (default-to u0 (map-get? cast-report-count cast-id))
)

(define-read-only (get-platform-stats)
  (ok {
    total-users:     (var-get total-users),
    total-casts:     (var-get total-casts),
    total-channels:  (var-get total-channels),
    total-nfts:      (var-get total-nfts),
    total-polls:     (var-get total-polls),
    platform-treasury: (var-get platform-treasury),
    fee-bps:         (var-get platform-fee-bps)
  })
)

;; SIP-009 required reads

(define-read-only (get-last-token-id)
  (ok (var-get total-nfts))
)

(define-read-only (get-token-uri (nft-id uint))
  (match (map-get? nft-metadata nft-id)
    meta (ok (some (get uri meta)))
    (ok none)
  )
)

(define-read-only (get-owner (nft-id uint))
  (ok (nft-get-owner? cast-nft nft-id))
)

;;  -- Public Functions --------------------------------------------------------

;; -- User Management --

(define-public (register-user
  (username     (string-ascii 50))
  (display-name (string-utf8 100))
  (bio          (string-utf8 500))
  (avatar-ipfs  (string-ascii 100))
)
  (let ((caller tx-sender))
    (asserts! (is-none (map-get? users caller))                     ERR-ALREADY-EXISTS)
    (asserts! (is-none (map-get? username-to-principal username))   ERR-ALREADY-EXISTS)
    (asserts! (> (len username) u0)                                 ERR-INVALID-INPUT)

    (map-set users caller {
      username:        username,
      display-name:    display-name,
      bio:             bio,
      website:         none,
      avatar-ipfs:     avatar-ipfs,
      banner-ipfs:     none,
      location:        none,
      verified:        false,
      suspended:       false,
      tier:            u0,
      followers-count: u0,
      following-count: u0,
      casts-count:     u0,
      tips-received:   u0,
      tips-given:      u0,
      nfts-minted:     u0,
      joined-at:       block-height,
      last-active:     block-height
    })
    (map-set username-to-principal username caller)
    (var-set total-users (+ (var-get total-users) u1))
    (ok true)
  )
)

(define-public (update-profile
  (display-name (string-utf8 100))
  (bio          (string-utf8 500))
  (avatar-ipfs  (string-ascii 100))
  (banner-ipfs  (optional (string-ascii 100)))
  (website      (optional (string-ascii 100)))
  (location     (optional (string-utf8 80)))
)
  (let (
    (caller    tx-sender)
    (user-data (unwrap! (map-get? users caller) ERR-NOT-FOUND))
  )
    (asserts! (not (get suspended user-data)) ERR-SUSPENDED)
    (map-set users caller (merge user-data {
      display-name: display-name,
      bio:          bio,
      avatar-ipfs:  avatar-ipfs,
      banner-ipfs:  banner-ipfs,
      website:      website,
      location:     location,
      last-active:  block-height
    }))
    (ok true)
  )
)

;; -- Cast Management --

(define-public (create-cast
  (content        (string-utf8 560))
  (images-ipfs    (list 4 (string-ascii 100)))
  (mentions       (list 10 principal))
  (parent-cast-id (optional uint))
  (channel-id     (optional uint))
)
  (let (
    (caller    tx-sender)
    (cast-id   (+ (var-get total-casts) u1))
    (user-data (unwrap! (map-get? users caller) ERR-NOT-FOUND))
    (root-id   (match parent-cast-id
                  pid (match (map-get? casts pid)
                         parent (default-to (some pid) (get root-cast-id parent))
                         none)
                  none))
  )
    (asserts! (not (get suspended user-data)) ERR-SUSPENDED)
    (asserts! (> (len content) u0)            ERR-INVALID-INPUT)

    ;; Validate parent exists if replying
    (match parent-cast-id
      pid (asserts! (is-some (map-get? casts pid)) ERR-NOT-FOUND)
      true
    )

    ;; Validate channel membership if posting to channel
    (match channel-id
      cid (asserts! (is-channel-member cid caller) ERR-NOT-MEMBER)
      true
    )

    (map-set casts cast-id {
      author:         caller,
      content:        content,
      images-ipfs:    images-ipfs,
      mentions:       mentions,
      parent-cast-id: parent-cast-id,
      root-cast-id:   root-id,
      channel-id:     channel-id,
      likes-count:    u0,
      recasts-count:  u0,
      replies-count:  u0,
      tips-count:     u0,
      tips-total:     u0,
      nft-id:         none,
      has-poll:       false,
      poll-id:        none,
      deleted:        false,
      pinned:         false,
      timestamp:      block-height
    })

    (map-set users caller (merge user-data {
      casts-count: (+ (get casts-count user-data) u1),
      last-active: block-height
    }))
    (var-set total-casts cast-id)

    ;; Increment parent reply count
    (match parent-cast-id
      pid (let ((parent (unwrap-panic (map-get? casts pid))))
        (map-set casts pid (merge parent {
          replies-count: (+ (get replies-count parent) u1)
        }))
      )
      true
    )

    ;; Send reply notification
    (match parent-cast-id
      pid (let (
        (parent    (unwrap-panic (map-get? casts pid)))
        (notif-id  (+ (default-to u0 (map-get? user-notif-count (get author parent))) u1))
      )
        (if (not (is-eq (get author parent) caller))
          (begin
            (map-set notifications { user: (get author parent), notif-id: notif-id } {
              notif-type: "reply",
              from-user:  caller,
              cast-id:    (some cast-id),
              amount:     none,
              timestamp:  block-height,
              read:       false
            })
            (map-set user-notif-count (get author parent) notif-id)
          )
          true
        )
      )
      true
    )

    (ok cast-id)
  )
)

(define-public (delete-cast (cast-id uint))
  (let (
    (caller    tx-sender)
    (cast-data (unwrap! (map-get? casts cast-id) ERR-NOT-FOUND))
  )
    (asserts! (or (is-eq caller (get author cast-data)) (is-eq caller contract-owner)) ERR-UNAUTHORIZED)
    (map-set casts cast-id (merge cast-data { deleted: true }))
    (ok true)
  )
)

(define-public (pin-cast (cast-id uint))
  (let (
    (caller    tx-sender)
    (cast-data (unwrap! (map-get? casts cast-id) ERR-NOT-FOUND))
  )
    (asserts! (is-eq caller (get author cast-data)) ERR-UNAUTHORIZED)
    (map-set user-pinned-cast caller cast-id)
    (map-set casts cast-id (merge cast-data { pinned: true }))
    (ok true)
  )
)

;; -- Social Interactions --

(define-public (like-cast (cast-id uint))
  (let (
    (caller    tx-sender)
    (cast-data (unwrap! (map-get? casts cast-id) ERR-NOT-FOUND))
    (notif-id  (+ (default-to u0 (map-get? user-notif-count (get author cast-data))) u1))
  )
    (asserts! (not (has-liked-cast cast-id caller))            ERR-ALREADY-EXISTS)
    (asserts! (not (get deleted cast-data))                    ERR-NOT-FOUND)

    (map-set cast-likes { cast-id: cast-id, user: caller } true)
    (map-set casts cast-id (merge cast-data {
      likes-count: (+ (get likes-count cast-data) u1)
    }))

    ;; Notify author (not self)
    (if (not (is-eq caller (get author cast-data)))
      (begin
        (map-set notifications { user: (get author cast-data), notif-id: notif-id } {
          notif-type: "like",
          from-user:  caller,
          cast-id:    (some cast-id),
          amount:     none,
          timestamp:  block-height,
          read:       false
        })
        (map-set user-notif-count (get author cast-data) notif-id)
      )
      true
    )
    (ok true)
  )
)

(define-public (unlike-cast (cast-id uint))
  (let (
    (caller    tx-sender)
    (cast-data (unwrap! (map-get? casts cast-id) ERR-NOT-FOUND))
  )
    (asserts! (has-liked-cast cast-id caller) ERR-NOT-FOUND)
    (map-delete cast-likes { cast-id: cast-id, user: caller })
    (map-set casts cast-id (merge cast-data {
      likes-count: (- (get likes-count cast-data) u1)
    }))
    (ok true)
  )
)

(define-public (recast (cast-id uint))
  (let (
    (caller    tx-sender)
    (cast-data (unwrap! (map-get? casts cast-id) ERR-NOT-FOUND))
    (notif-id  (+ (default-to u0 (map-get? user-notif-count (get author cast-data))) u1))
  )
    (asserts! (not (has-recasted cast-id caller)) ERR-ALREADY-EXISTS)
    (asserts! (not (get deleted cast-data))       ERR-NOT-FOUND)

    (map-set cast-recasts { cast-id: cast-id, user: caller } true)
    (map-set casts cast-id (merge cast-data {
      recasts-count: (+ (get recasts-count cast-data) u1)
    }))

    (if (not (is-eq caller (get author cast-data)))
      (begin
        (map-set notifications { user: (get author cast-data), notif-id: notif-id } {
          notif-type: "recast",
          from-user:  caller,
          cast-id:    (some cast-id),
          amount:     none,
          timestamp:  block-height,
          read:       false
        })
        (map-set user-notif-count (get author cast-data) notif-id)
      )
      true
    )
    (ok true)
  )
)

(define-public (unrecast (cast-id uint))
  (let (
    (caller    tx-sender)
    (cast-data (unwrap! (map-get? casts cast-id) ERR-NOT-FOUND))
  )
    (asserts! (has-recasted cast-id caller) ERR-NOT-FOUND)
    (map-delete cast-recasts { cast-id: cast-id, user: caller })
    (map-set casts cast-id (merge cast-data {
      recasts-count: (- (get recasts-count cast-data) u1)
    }))
    (ok true)
  )
)

(define-public (bookmark-cast (cast-id uint))
  (let ((caller tx-sender))
    (asserts! (is-some (map-get? casts cast-id)) ERR-NOT-FOUND)
    (asserts! (not (has-bookmarked cast-id caller)) ERR-ALREADY-EXISTS)
    (map-set cast-bookmarks { cast-id: cast-id, user: caller } true)
    (ok true)
  )
)

(define-public (unbookmark-cast (cast-id uint))
  (let ((caller tx-sender))
    (asserts! (has-bookmarked cast-id caller) ERR-NOT-FOUND)
    (map-delete cast-bookmarks { cast-id: cast-id, user: caller })
    (ok true)
  )
)

;; -- Follows --

(define-public (follow-user (user-to-follow principal))
  (let (
    (caller        tx-sender)
    (follower-data (unwrap! (map-get? users caller)        ERR-NOT-FOUND))
    (following-data (unwrap! (map-get? users user-to-follow) ERR-NOT-FOUND))
    (notif-id      (+ (default-to u0 (map-get? user-notif-count user-to-follow)) u1))
  )
    (asserts! (not (is-eq caller user-to-follow))          ERR-SELF-ACTION)
    (asserts! (not (is-following caller user-to-follow))   ERR-ALREADY-EXISTS)

    (map-set follows { follower: caller, following: user-to-follow } true)
    (map-set users caller (merge follower-data {
      following-count: (+ (get following-count follower-data) u1)
    }))
    (map-set users user-to-follow (merge following-data {
      followers-count: (+ (get followers-count following-data) u1)
    }))

    ;; Notify followed user
    (map-set notifications { user: user-to-follow, notif-id: notif-id } {
      notif-type: "follow",
      from-user:  caller,
      cast-id:    none,
      amount:     none,
      timestamp:  block-height,
      read:       false
    })
    (map-set user-notif-count user-to-follow notif-id)
    (ok true)
  )
)

(define-public (unfollow-user (user-to-unfollow principal))
  (let (
    (caller         tx-sender)
    (follower-data  (unwrap! (map-get? users caller)           ERR-NOT-FOUND))
    (following-data (unwrap! (map-get? users user-to-unfollow) ERR-NOT-FOUND))
  )
    (asserts! (is-following caller user-to-unfollow) ERR-NOT-FOUND)
    (map-delete follows { follower: caller, following: user-to-unfollow })
    (map-set users caller (merge follower-data {
      following-count: (- (get following-count follower-data) u1)
    }))
    (map-set users user-to-unfollow (merge following-data {
      followers-count: (- (get followers-count following-data) u1)
    }))
    (ok true)
  )
)

;; -- STX Tipping --

(define-public (tip-cast (cast-id uint) (amount uint))
  (let (
    (caller     tx-sender)
    (cast-data  (unwrap! (map-get? casts cast-id) ERR-NOT-FOUND))
    (author     (get author cast-data))
    (fee        (/ (* amount (var-get platform-fee-bps)) u10000))
    (net-amount (- amount fee))
    (author-data (unwrap! (map-get? users author) ERR-NOT-FOUND))
    (tipper-data (unwrap! (map-get? users caller) ERR-NOT-FOUND))
    (notif-id   (+ (default-to u0 (map-get? user-notif-count author)) u1))
  )
    (asserts! (not (get deleted cast-data))          ERR-NOT-FOUND)
    (asserts! (not (is-eq caller author))            ERR-SELF-ACTION)
    (asserts! (>= amount MIN-TIP-AMOUNT)             ERR-INVALID-INPUT)

    ;; Transfer STX: caller -> author (net) + treasury (fee)
    (try! (stx-transfer? net-amount caller author))
    (try! (stx-transfer? fee caller (as-contract tx-sender)))
    (var-set platform-treasury (+ (var-get platform-treasury) fee))

    ;; Update cast tip stats
    (map-set casts cast-id (merge cast-data {
      tips-count: (+ (get tips-count cast-data) u1),
      tips-total: (+ (get tips-total cast-data) net-amount)
    }))

    ;; Update user tip stats
    (map-set users author (merge author-data {
      tips-received: (+ (get tips-received author-data) net-amount)
    }))
    (map-set users caller (merge tipper-data {
      tips-given: (+ (get tips-given tipper-data) amount)
    }))

    ;; Notify author
    (map-set notifications { user: author, notif-id: notif-id } {
      notif-type: "tip",
      from-user:  caller,
      cast-id:    (some cast-id),
      amount:     (some net-amount),
      timestamp:  block-height,
      read:       false
    })
    (map-set user-notif-count author notif-id)
    (ok net-amount)
  )
)

;; -- Channels --

(define-public (create-channel
  (name        (string-ascii 50))
  (description (string-utf8 500))
  (image-ipfs  (string-ascii 100))
  (entry-fee   uint)
  (is-nsfw     bool)
  (is-private  bool)
)
  (let (
    (caller     tx-sender)
    (channel-id (+ (var-get total-channels) u1))
  )
    (asserts! (is-some (map-get? users caller))               ERR-NOT-FOUND)
    (asserts! (is-none (map-get? channel-name-to-id name))    ERR-ALREADY-EXISTS)
    (asserts! (> (len name) u0)                               ERR-INVALID-INPUT)

    (map-set channels channel-id {
      name:          name,
      description:   description,
      image-ipfs:    image-ipfs,
      creator:       caller,
      is-paid:       (> entry-fee u0),
      entry-fee:     entry-fee,
      members-count: u1,
      casts-count:   u0,
      revenue-total: u0,
      is-nsfw:       is-nsfw,
      is-private:    is-private,
      created-at:    block-height
    })
    (map-set channel-name-to-id name channel-id)
    (map-set channel-members { channel-id: channel-id, user: caller } true)
    (var-set total-channels channel-id)
    (ok channel-id)
  )
)

(define-public (join-channel (channel-id uint))
  (let (
    (caller       tx-sender)
    (channel-data (unwrap! (map-get? channels channel-id) ERR-NOT-FOUND))
  )
    (asserts! (not (is-channel-member channel-id caller)) ERR-ALREADY-EXISTS)

    (if (get is-paid channel-data)
      ;; Paid channel: pay entry fee; split: 90% creator, 10% treasury
      (let (
        (fee     (get entry-fee channel-data))
        (creator (get creator channel-data))
        (creator-share (/ (* fee u9000) u10000))
        (treasury-cut  (- fee creator-share))
      )
        (try! (stx-transfer? creator-share caller creator))
        (try! (stx-transfer? treasury-cut caller (as-contract tx-sender)))
        (var-set platform-treasury (+ (var-get platform-treasury) treasury-cut))
        (map-set channels channel-id (merge channel-data {
          revenue-total: (+ (get revenue-total channel-data) fee)
        }))
      )
      true
    )

    (map-set channel-members { channel-id: channel-id, user: caller } true)
    (map-set channels channel-id (merge channel-data {
      members-count: (+ (get members-count channel-data) u1)
    }))
    (ok true)
  )
)

(define-public (leave-channel (channel-id uint))
  (let (
    (caller       tx-sender)
    (channel-data (unwrap! (map-get? channels channel-id) ERR-NOT-FOUND))
  )
    (asserts! (is-channel-member channel-id caller)                  ERR-NOT-FOUND)
    (asserts! (not (is-eq caller (get creator channel-data)))        ERR-UNAUTHORIZED)
    (map-delete channel-members { channel-id: channel-id, user: caller })
    (map-set channels channel-id (merge channel-data {
      members-count: (- (get members-count channel-data) u1)
    }))
    (ok true)
  )
)

;; -- NFT Minting (SIP-009) --

(define-public (mint-cast-nft
  (cast-id     uint)
  (uri         (string-ascii 256))
  (max-edition uint)
)
  (let (
    (caller    tx-sender)
    (cast-data (unwrap! (map-get? casts cast-id) ERR-NOT-FOUND))
    (nft-id    (+ (var-get total-nfts) u1))
    (user-data (unwrap! (map-get? users caller) ERR-NOT-FOUND))
  )
    (asserts! (is-eq caller (get author cast-data)) ERR-UNAUTHORIZED)
    (asserts! (not (get deleted cast-data))         ERR-NOT-FOUND)
    (asserts! (> max-edition u0)                    ERR-INVALID-INPUT)

    ;; Mint the NFT to the author
    (try! (nft-mint? cast-nft nft-id caller))

    (map-set nft-metadata nft-id {
      cast-id:     cast-id,
      creator:     caller,
      uri:         uri,
      edition:     u1,
      max-edition: max-edition,
      minted-at:   block-height
    })

    ;; Link first NFT to cast if not already linked
    (if (is-none (map-get? cast-nft-id cast-id))
      (map-set cast-nft-id cast-id nft-id)
      true
    )

    (map-set casts cast-id (merge cast-data { nft-id: (some nft-id) }))

    (map-set users caller (merge user-data {
      nfts-minted: (+ (get nfts-minted user-data) u1)
    }))

    (var-set total-nfts nft-id)
    (ok nft-id)
  )
)

(define-public (transfer (nft-id uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) ERR-UNAUTHORIZED)
    (try! (nft-transfer? cast-nft nft-id sender recipient))
    (ok true)
  )
)

(define-public (list-nft (nft-id uint) (price uint))
  (let ((caller tx-sender))
    (asserts! (is-eq (some caller) (nft-get-owner? cast-nft nft-id)) ERR-NFT-NOT-OWNED)
    (asserts! (> price u0) ERR-INVALID-INPUT)
    (map-set nft-listings nft-id {
      seller:    caller,
      price:     price,
      listed-at: block-height
    })
    (ok true)
  )
)

(define-public (delist-nft (nft-id uint))
  (let ((caller tx-sender))
    (asserts! (is-eq (some caller) (nft-get-owner? cast-nft nft-id)) ERR-NFT-NOT-OWNED)
    (map-delete nft-listings nft-id)
    (ok true)
  )
)

(define-public (buy-nft (nft-id uint))
  (let (
    (buyer   tx-sender)
    (listing (unwrap! (map-get? nft-listings nft-id) ERR-LISTING-NOT-FOUND))
    (seller  (get seller listing))
    (price   (get price listing))
    (meta    (unwrap! (map-get? nft-metadata nft-id) ERR-NOT-FOUND))
    (fee     (/ (* price (var-get platform-fee-bps)) u10000))
    (net     (- price fee))
    ;; Creator royalty: 5% of sale to original creator
    (royalty-bps u500)
    (royalty (/ (* price royalty-bps) u10000))
    (seller-net  (- net royalty))
  )
    (asserts! (not (is-eq buyer seller)) ERR-SELF-ACTION)

    (try! (stx-transfer? seller-net buyer seller))
    (try! (stx-transfer? fee buyer (as-contract tx-sender)))
    (try! (stx-transfer? royalty buyer (get creator meta)))
    (var-set platform-treasury (+ (var-get platform-treasury) fee))

    ;; Transfer NFT
    (try! (nft-transfer? cast-nft nft-id seller buyer))
    (map-delete nft-listings nft-id)
    (ok true)
  )
)

;; -- Polls --

(define-public (create-poll
  (cast-id    uint)
  (question   (string-utf8 200))
  (option-a   (string-utf8 100))
  (option-b   (string-utf8 100))
  (option-c   (optional (string-utf8 100)))
  (option-d   (optional (string-utf8 100)))
  (duration   uint)   ;; block duration (~10 min/block on Stacks)
)
  (let (
    (caller    tx-sender)
    (cast-data (unwrap! (map-get? casts cast-id) ERR-NOT-FOUND))
    (poll-id   (+ (var-get total-polls) u1))
  )
    (asserts! (is-eq caller (get author cast-data)) ERR-UNAUTHORIZED)
    (asserts! (not (get has-poll cast-data))        ERR-ALREADY-EXISTS)
    (asserts! (> duration u0)                       ERR-INVALID-INPUT)

    (map-set polls poll-id {
      cast-id:     cast-id,
      creator:     caller,
      question:    question,
      option-a:    option-a,
      option-b:    option-b,
      option-c:    option-c,
      option-d:    option-d,
      votes-a:     u0,
      votes-b:     u0,
      votes-c:     u0,
      votes-d:     u0,
      total-votes: u0,
      ends-at:     (+ block-height duration),
      closed:      false
    })

    (map-set casts cast-id (merge cast-data {
      has-poll: true,
      poll-id:  (some poll-id)
    }))

    (var-set total-polls poll-id)
    (ok poll-id)
  )
)

(define-public (vote-poll (poll-id uint) (option uint))
  (let (
    (caller    tx-sender)
    (poll-data (unwrap! (map-get? polls poll-id) ERR-NOT-FOUND))
  )
    (asserts! (is-none (map-get? poll-votes { poll-id: poll-id, user: caller })) ERR-ALREADY-VOTED)
    (asserts! (not (get closed poll-data))                                       ERR-POLL-CLOSED)
    (asserts! (<= block-height (get ends-at poll-data))                          ERR-POLL-CLOSED)
    (asserts! (and (>= option u1) (<= option u4))                                ERR-INVALID-INPUT)

    ;; Validate option exists
    (if (is-eq option u3)
      (asserts! (is-some (get option-c poll-data)) ERR-INVALID-INPUT)
      true
    )
    (if (is-eq option u4)
      (asserts! (is-some (get option-d poll-data)) ERR-INVALID-INPUT)
      true
    )

    (map-set poll-votes { poll-id: poll-id, user: caller } option)

    (map-set polls poll-id (merge poll-data {
      votes-a:     (if (is-eq option u1) (+ (get votes-a poll-data) u1) (get votes-a poll-data)),
      votes-b:     (if (is-eq option u2) (+ (get votes-b poll-data) u1) (get votes-b poll-data)),
      votes-c:     (if (is-eq option u3) (+ (get votes-c poll-data) u1) (get votes-c poll-data)),
      votes-d:     (if (is-eq option u4) (+ (get votes-d poll-data) u1) (get votes-d poll-data)),
      total-votes: (+ (get total-votes poll-data) u1)
    }))
    (ok true)
  )
)

;; -- Content Reporting --

(define-public (report-cast (cast-id uint) (reason (string-ascii 30)))
  (let ((caller tx-sender))
    (asserts! (is-some (map-get? casts cast-id)) ERR-NOT-FOUND)
    (asserts! (is-none (map-get? content-reports { cast-id: cast-id, reporter: caller })) ERR-ALREADY-EXISTS)
    (map-set content-reports { cast-id: cast-id, reporter: caller } {
      reason:    reason,
      timestamp: block-height
    })
    (map-set cast-report-count cast-id
      (+ (default-to u0 (map-get? cast-report-count cast-id)) u1))
    (ok true)
  )
)

;; -- Governance --

(define-public (create-proposal
  (title       (string-utf8 100))
  (description (string-utf8 1000))
  (duration    uint)
)
  (let (
    (caller      tx-sender)
    (proposal-id (+ (var-get governance-proposal-id) u1))
    (user-data   (unwrap! (map-get? users caller) ERR-NOT-FOUND))
  )
    ;; Only verified or pro-tier users can create proposals
    (asserts! (or (get verified user-data) (>= (get tier user-data) u1)) ERR-UNAUTHORIZED)
    (asserts! (> duration u0) ERR-INVALID-INPUT)

    (map-set governance-proposals proposal-id {
      proposer:    caller,
      title:       title,
      description: description,
      yes-votes:   u0,
      no-votes:    u0,
      ends-at:     (+ block-height duration),
      executed:    false,
      passed:      false
    })
    (var-set governance-proposal-id proposal-id)
    (ok proposal-id)
  )
)

(define-public (vote-proposal (proposal-id uint) (vote bool))
  (let (
    (caller   tx-sender)
    (proposal (unwrap! (map-get? governance-proposals proposal-id) ERR-NOT-FOUND))
  )
    (asserts! (is-none (map-get? governance-votes { proposal-id: proposal-id, voter: caller })) ERR-ALREADY-VOTED)
    (asserts! (<= block-height (get ends-at proposal)) ERR-POLL-CLOSED)

    (map-set governance-votes { proposal-id: proposal-id, voter: caller } vote)
    (map-set governance-proposals proposal-id (merge proposal {
      yes-votes: (if vote (+ (get yes-votes proposal) u1) (get yes-votes proposal)),
      no-votes:  (if (not vote) (+ (get no-votes proposal) u1) (get no-votes proposal))
    }))
    (ok true)
  )
)

;; -- Admin Functions --

(define-public (verify-user (user principal))
  (let ((user-data (unwrap! (map-get? users user) ERR-NOT-FOUND)))
    (asserts! (is-eq tx-sender contract-owner) ERR-OWNER-ONLY)
    (map-set users user (merge user-data { verified: true }))
    (ok true)
  )
)

(define-public (suspend-user (user principal))
  (let ((user-data (unwrap! (map-get? users user) ERR-NOT-FOUND)))
    (asserts! (is-eq tx-sender contract-owner) ERR-OWNER-ONLY)
    (map-set users user (merge user-data { suspended: true }))
    (ok true)
  )
)

(define-public (unsuspend-user (user principal))
  (let ((user-data (unwrap! (map-get? users user) ERR-NOT-FOUND)))
    (asserts! (is-eq tx-sender contract-owner) ERR-OWNER-ONLY)
    (map-set users user (merge user-data { suspended: false }))
    (ok true)
  )
)

(define-public (set-user-tier (user principal) (tier uint))
  (let ((user-data (unwrap! (map-get? users user) ERR-NOT-FOUND)))
    (asserts! (is-eq tx-sender contract-owner) ERR-OWNER-ONLY)
    (asserts! (<= tier u2) ERR-INVALID-INPUT)
    (map-set users user (merge user-data { tier: tier }))
    (ok true)
  )
)

(define-public (set-platform-fee (new-fee-bps uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) ERR-OWNER-ONLY)
    (asserts! (<= new-fee-bps u1000) ERR-INVALID-INPUT)  ;; max 10%
    (var-set platform-fee-bps new-fee-bps)
    (ok true)
  )
)

(define-public (withdraw-treasury (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) ERR-OWNER-ONLY)
    (asserts! (<= amount (var-get platform-treasury)) ERR-INSUFFICIENT-FUNDS)
    (try! (as-contract (stx-transfer? amount tx-sender recipient)))
    (var-set platform-treasury (- (var-get platform-treasury) amount))
    (ok true)
  )
)

(define-public (moderate-cast (cast-id uint))
  (let ((cast-data (unwrap! (map-get? casts cast-id) ERR-NOT-FOUND)))
    (asserts! (is-eq tx-sender contract-owner) ERR-OWNER-ONLY)
    (map-set casts cast-id (merge cast-data { deleted: true }))
    (ok true)
  )
)

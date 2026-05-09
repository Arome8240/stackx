;; StackX Social Platform - Main Contract
;; A decentralized social media platform on Stacks blockchain

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-unauthorized (err u102))
(define-constant err-already-exists (err u103))
(define-constant err-invalid-input (err u104))
(define-constant err-insufficient-balance (err u105))

;; Data Variables
(define-data-var platform-fee uint u1000000) ;; 1 STX in microSTX
(define-data-var total-users uint u0)
(define-data-var total-casts uint u0)
(define-data-var total-channels uint u0)

;; Data Maps

;; User Profiles
(define-map users
  principal
  {
    username: (string-ascii 50),
    display-name: (string-utf8 100),
    bio: (string-utf8 500),
    avatar-ipfs: (string-ascii 100),
    banner-ipfs: (optional (string-ascii 100)),
    verified: bool,
    followers-count: uint,
    following-count: uint,
    casts-count: uint,
    joined-at: uint
  }
)

;; Username to Principal mapping
(define-map username-to-principal
  (string-ascii 50)
  principal
)

;; Casts (Posts)
(define-map casts
  uint
  {
    author: principal,
    content: (string-utf8 280),
    images-ipfs: (list 4 (string-ascii 100)),
    mentions: (list 10 principal),
    parent-cast-id: (optional uint),
    channel-id: (optional uint),
    likes-count: uint,
    recasts-count: uint,
    replies-count: uint,
    timestamp: uint
  }
)

;; Cast Likes
(define-map cast-likes
  { cast-id: uint, user: principal }
  bool
)

;; Cast Recasts
(define-map cast-recasts
  { cast-id: uint, user: principal }
  bool
)

;; Follow Relationships
(define-map follows
  { follower: principal, following: principal }
  bool
)

;; Channels
(define-map channels
  uint
  {
    name: (string-ascii 50),
    description: (string-utf8 500),
    image-ipfs: (string-ascii 100),
    creator: principal,
    members-count: uint,
    casts-count: uint,
    created-at: uint
  }
)

;; Channel Memberships
(define-map channel-members
  { channel-id: uint, user: principal }
  bool
)

;; Notifications
(define-map notifications
  { user: principal, notification-id: uint }
  {
    notification-type: (string-ascii 20),
    from-user: principal,
    cast-id: (optional uint),
    timestamp: uint,
    read: bool
  }
)

(define-map user-notification-count principal uint)

;; Read-only functions

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

(define-read-only (is-following (follower principal) (following principal))
  (default-to false (map-get? follows { follower: follower, following: following }))
)

(define-read-only (has-liked-cast (cast-id uint) (user principal))
  (default-to false (map-get? cast-likes { cast-id: cast-id, user: user }))
)

(define-read-only (has-recasted (cast-id uint) (user principal))
  (default-to false (map-get? cast-recasts { cast-id: cast-id, user: user }))
)

(define-read-only (is-channel-member (channel-id uint) (user principal))
  (default-to false (map-get? channel-members { channel-id: channel-id, user: user }))
)

(define-read-only (get-platform-stats)
  (ok {
    total-users: (var-get total-users),
    total-casts: (var-get total-casts),
    total-channels: (var-get total-channels),
    platform-fee: (var-get platform-fee)
  })
)

;; Public functions

;; Register User
(define-public (register-user 
  (username (string-ascii 50))
  (display-name (string-utf8 100))
  (bio (string-utf8 500))
  (avatar-ipfs (string-ascii 100))
)
  (let
    (
      (caller tx-sender)
    )
    ;; Check if user already exists
    (asserts! (is-none (map-get? users caller)) err-already-exists)
    ;; Check if username is taken
    (asserts! (is-none (map-get? username-to-principal username)) err-already-exists)
    
    ;; Create user profile
    (map-set users caller {
      username: username,
      display-name: display-name,
      bio: bio,
      avatar-ipfs: avatar-ipfs,
      banner-ipfs: none,
      verified: false,
      followers-count: u0,
      following-count: u0,
      casts-count: u0,
      joined-at: block-height
    })
    
    ;; Map username to principal
    (map-set username-to-principal username caller)
    
    ;; Increment total users
    (var-set total-users (+ (var-get total-users) u1))
    
    (ok true)
  )
)

;; Update User Profile
(define-public (update-profile
  (display-name (string-utf8 100))
  (bio (string-utf8 500))
  (avatar-ipfs (string-ascii 100))
  (banner-ipfs (optional (string-ascii 100)))
)
  (let
    (
      (caller tx-sender)
      (user-data (unwrap! (map-get? users caller) err-not-found))
    )
    (map-set users caller (merge user-data {
      display-name: display-name,
      bio: bio,
      avatar-ipfs: avatar-ipfs,
      banner-ipfs: banner-ipfs
    }))
    (ok true)
  )
)

;; Create Cast
(define-public (create-cast
  (content (string-utf8 280))
  (images-ipfs (list 4 (string-ascii 100)))
  (mentions (list 10 principal))
  (parent-cast-id (optional uint))
  (channel-id (optional uint))
)
  (let
    (
      (caller tx-sender)
      (cast-id (+ (var-get total-casts) u1))
      (user-data (unwrap! (map-get? users caller) err-not-found))
    )
    ;; Verify user exists
    (asserts! (is-some (map-get? users caller)) err-unauthorized)
    
    ;; If replying, verify parent cast exists
    (if (is-some parent-cast-id)
      (asserts! (is-some (map-get? casts (unwrap-panic parent-cast-id))) err-not-found)
      true
    )
    
    ;; If posting to channel, verify membership
    (if (is-some channel-id)
      (asserts! (is-channel-member (unwrap-panic channel-id) caller) err-unauthorized)
      true
    )
    
    ;; Create cast
    (map-set casts cast-id {
      author: caller,
      content: content,
      images-ipfs: images-ipfs,
      mentions: mentions,
      parent-cast-id: parent-cast-id,
      channel-id: channel-id,
      likes-count: u0,
      recasts-count: u0,
      replies-count: u0,
      timestamp: block-height
    })
    
    ;; Update user cast count
    (map-set users caller (merge user-data {
      casts-count: (+ (get casts-count user-data) u1)
    }))
    
    ;; Increment total casts
    (var-set total-casts cast-id)
    
    ;; If reply, increment parent's reply count
    (if (is-some parent-cast-id)
      (let
        (
          (parent-id (unwrap-panic parent-cast-id))
          (parent-cast (unwrap-panic (map-get? casts parent-id)))
        )
        (map-set casts parent-id (merge parent-cast {
          replies-count: (+ (get replies-count parent-cast) u1)
        }))
      )
      true
    )
    
    (ok cast-id)
  )
)

;; Like Cast
(define-public (like-cast (cast-id uint))
  (let
    (
      (caller tx-sender)
      (cast-data (unwrap! (map-get? casts cast-id) err-not-found))
      (already-liked (has-liked-cast cast-id caller))
    )
    (asserts! (not already-liked) err-already-exists)
    
    ;; Add like
    (map-set cast-likes { cast-id: cast-id, user: caller } true)
    
    ;; Increment like count
    (map-set casts cast-id (merge cast-data {
      likes-count: (+ (get likes-count cast-data) u1)
    }))
    
    (ok true)
  )
)

;; Unlike Cast
(define-public (unlike-cast (cast-id uint))
  (let
    (
      (caller tx-sender)
      (cast-data (unwrap! (map-get? casts cast-id) err-not-found))
      (already-liked (has-liked-cast cast-id caller))
    )
    (asserts! already-liked err-not-found)
    
    ;; Remove like
    (map-delete cast-likes { cast-id: cast-id, user: caller })
    
    ;; Decrement like count
    (map-set casts cast-id (merge cast-data {
      likes-count: (- (get likes-count cast-data) u1)
    }))
    
    (ok true)
  )
)

;; Recast
(define-public (recast (cast-id uint))
  (let
    (
      (caller tx-sender)
      (cast-data (unwrap! (map-get? casts cast-id) err-not-found))
      (already-recasted (has-recasted cast-id caller))
    )
    (asserts! (not already-recasted) err-already-exists)
    
    ;; Add recast
    (map-set cast-recasts { cast-id: cast-id, user: caller } true)
    
    ;; Increment recast count
    (map-set casts cast-id (merge cast-data {
      recasts-count: (+ (get recasts-count cast-data) u1)
    }))
    
    (ok true)
  )
)

;; Unrecast
(define-public (unrecast (cast-id uint))
  (let
    (
      (caller tx-sender)
      (cast-data (unwrap! (map-get? casts cast-id) err-not-found))
      (already-recasted (has-recasted cast-id caller))
    )
    (asserts! already-recasted err-not-found)
    
    ;; Remove recast
    (map-delete cast-recasts { cast-id: cast-id, user: caller })
    
    ;; Decrement recast count
    (map-set casts cast-id (merge cast-data {
      recasts-count: (- (get recasts-count cast-data) u1)
    }))
    
    (ok true)
  )
)

;; Follow User
(define-public (follow-user (user-to-follow principal))
  (let
    (
      (caller tx-sender)
      (follower-data (unwrap! (map-get? users caller) err-not-found))
      (following-data (unwrap! (map-get? users user-to-follow) err-not-found))
      (already-following (is-following caller user-to-follow))
    )
    (asserts! (not (is-eq caller user-to-follow)) err-invalid-input)
    (asserts! (not already-following) err-already-exists)
    
    ;; Create follow relationship
    (map-set follows { follower: caller, following: user-to-follow } true)
    
    ;; Update follower's following count
    (map-set users caller (merge follower-data {
      following-count: (+ (get following-count follower-data) u1)
    }))
    
    ;; Update following's followers count
    (map-set users user-to-follow (merge following-data {
      followers-count: (+ (get followers-count following-data) u1)
    }))
    
    (ok true)
  )
)

;; Unfollow User
(define-public (unfollow-user (user-to-unfollow principal))
  (let
    (
      (caller tx-sender)
      (follower-data (unwrap! (map-get? users caller) err-not-found))
      (following-data (unwrap! (map-get? users user-to-unfollow) err-not-found))
      (already-following (is-following caller user-to-unfollow))
    )
    (asserts! already-following err-not-found)
    
    ;; Remove follow relationship
    (map-delete follows { follower: caller, following: user-to-unfollow })
    
    ;; Update follower's following count
    (map-set users caller (merge follower-data {
      following-count: (- (get following-count follower-data) u1)
    }))
    
    ;; Update following's followers count
    (map-set users user-to-unfollow (merge following-data {
      followers-count: (- (get followers-count following-data) u1)
    }))
    
    (ok true)
  )
)

;; Create Channel
(define-public (create-channel
  (name (string-ascii 50))
  (description (string-utf8 500))
  (image-ipfs (string-ascii 100))
)
  (let
    (
      (caller tx-sender)
      (channel-id (+ (var-get total-channels) u1))
    )
    ;; Verify user exists
    (asserts! (is-some (map-get? users caller)) err-unauthorized)
    
    ;; Create channel
    (map-set channels channel-id {
      name: name,
      description: description,
      image-ipfs: image-ipfs,
      creator: caller,
      members-count: u1,
      casts-count: u0,
      created-at: block-height
    })
    
    ;; Auto-join creator
    (map-set channel-members { channel-id: channel-id, user: caller } true)
    
    ;; Increment total channels
    (var-set total-channels channel-id)
    
    (ok channel-id)
  )
)

;; Join Channel
(define-public (join-channel (channel-id uint))
  (let
    (
      (caller tx-sender)
      (channel-data (unwrap! (map-get? channels channel-id) err-not-found))
      (already-member (is-channel-member channel-id caller))
    )
    (asserts! (not already-member) err-already-exists)
    
    ;; Add membership
    (map-set channel-members { channel-id: channel-id, user: caller } true)
    
    ;; Increment members count
    (map-set channels channel-id (merge channel-data {
      members-count: (+ (get members-count channel-data) u1)
    }))
    
    (ok true)
  )
)

;; Leave Channel
(define-public (leave-channel (channel-id uint))
  (let
    (
      (caller tx-sender)
      (channel-data (unwrap! (map-get? channels channel-id) err-not-found))
      (is-member (is-channel-member channel-id caller))
    )
    (asserts! is-member err-not-found)
    (asserts! (not (is-eq caller (get creator channel-data))) err-unauthorized)
    
    ;; Remove membership
    (map-delete channel-members { channel-id: channel-id, user: caller })
    
    ;; Decrement members count
    (map-set channels channel-id (merge channel-data {
      members-count: (- (get members-count channel-data) u1)
    }))
    
    (ok true)
  )
)

;; Admin functions

(define-public (verify-user (user principal))
  (let
    (
      (user-data (unwrap! (map-get? users user) err-not-found))
    )
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    
    (map-set users user (merge user-data { verified: true }))
    (ok true)
  )
)

(define-public (set-platform-fee (new-fee uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set platform-fee new-fee)
    (ok true)
  )
)

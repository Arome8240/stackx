;; patient-registry.clar
;; Stores patient identity and consent on-chain.
;; Only the patient (tx-sender) can register or update their own record.

(define-constant ERR-ALREADY-REGISTERED (err u100))
(define-constant ERR-NOT-FOUND          (err u101))

(define-map patients
  { patient: principal }
  {
    name-hash:  (buff 32),          ;; sha256 of full name - PII stays off-chain
    dob-hash:   (buff 32),          ;; sha256 of date-of-birth
    blood-type: (string-ascii 3),
    ipfs-cid:   (string-ascii 64),  ;; encrypted off-chain record pointer
    registered: uint,
    updated:    uint
  }
)

(define-read-only (get-patient (patient principal))
  (map-get? patients { patient: patient })
)

(define-read-only (is-registered (patient principal))
  (is-some (map-get? patients { patient: patient }))
)

(define-public (register
    (name-hash  (buff 32))
    (dob-hash   (buff 32))
    (blood-type (string-ascii 3))
    (ipfs-cid   (string-ascii 64)))
  (begin
    (asserts! (not (is-registered tx-sender)) ERR-ALREADY-REGISTERED)
    (map-set patients
      { patient: tx-sender }
      {
        name-hash:  name-hash,
        dob-hash:   dob-hash,
        blood-type: blood-type,
        ipfs-cid:   ipfs-cid,
        registered: stacks-block-height,
        updated:    stacks-block-height
      })
    (ok tx-sender)
  )
)

(define-public (update-ipfs-cid (ipfs-cid (string-ascii 64)))
  (let ((record (unwrap! (get-patient tx-sender) ERR-NOT-FOUND)))
    (map-set patients
      { patient: tx-sender }
      (merge record { ipfs-cid: ipfs-cid, updated: stacks-block-height }))
    (ok true)
  )
)

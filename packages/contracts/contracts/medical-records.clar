;; medical-records.clar
;; Doctors write encrypted record hashes; patients grant/revoke access.

(define-constant ERR-UNAUTHORIZED (err u200))
(define-constant ERR-LIST-FULL    (err u201))

;; record-id -> record metadata
(define-map records
  { record-id: uint }
  {
    patient:     principal,
    doctor:      principal,
    ipfs-cid:    (string-ascii 64),  ;; encrypted record on IPFS
    record-type: (string-ascii 32),  ;; "diagnosis" | "prescription" | "lab" | "imaging"
    created:     uint
  }
)

;; patient -> list of record-ids they own (max 500)
(define-map patient-records
  { patient: principal }
  { ids: (list 500 uint) }
)

;; access control: patient grants a principal read access
(define-map access-grants
  { patient: principal, grantee: principal }
  { granted: bool }
)

(define-data-var next-id uint u1)

(define-read-only (get-record (record-id uint))
  (map-get? records { record-id: record-id })
)

(define-read-only (get-patient-records (patient principal))
  (map-get? patient-records { patient: patient })
)

(define-read-only (has-access (patient principal) (grantee principal))
  (default-to false
    (get granted (map-get? access-grants { patient: patient, grantee: grantee })))
)

(define-public (add-record
    (patient     principal)
    (ipfs-cid    (string-ascii 64))
    (record-type (string-ascii 32)))
  (let (
    (id      (var-get next-id))
    (current (default-to { ids: (list) } (map-get? patient-records { patient: patient })))
    (new-ids (as-max-len? (append (get ids current) id) u500))
  )
    (asserts! (has-access patient tx-sender) ERR-UNAUTHORIZED)
    (asserts! (is-some new-ids) ERR-LIST-FULL)
    (map-set records
      { record-id: id }
      { patient: patient, doctor: tx-sender, ipfs-cid: ipfs-cid,
        record-type: record-type, created: stacks-block-height })
    (map-set patient-records
      { patient: patient }
      { ids: (unwrap! new-ids ERR-LIST-FULL) })
    (var-set next-id (+ id u1))
    (ok id)
  )
)

(define-public (grant-access (grantee principal))
  (begin
    (map-set access-grants { patient: tx-sender, grantee: grantee } { granted: true })
    (ok true)
  )
)

(define-public (revoke-access (grantee principal))
  (begin
    (map-set access-grants { patient: tx-sender, grantee: grantee } { granted: false })
    (ok true)
  )
)

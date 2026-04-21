;; Patient Records Contract
;; Manages patient medical records with access control and consent management

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-unauthorized (err u102))
(define-constant err-already-exists (err u103))
(define-constant err-invalid-input (err u104))
(define-constant err-no-access (err u105))

;; Data Variables
(define-data-var emergency-access-enabled bool false)

;; Data Maps
(define-map patients
  principal
  {
    registered: bool,
    registration-date: uint,
    emergency-contact: (optional principal)
  }
)

(define-map medical-records
  { patient: principal, record-id: uint }
  {
    ipfs-hash: (string-ascii 64),
    record-type: (string-ascii 50),
    created-at: uint,
    created-by: principal,
    encrypted: bool
  }
)

(define-map patient-record-count
  principal
  uint
)

;; Access control: which hospitals have access to which patient records
(define-map record-access
  { patient: principal, hospital: principal }
  {
    granted: bool,
    granted-at: uint,
    expires-at: (optional uint),
    access-level: (string-ascii 20) ;; "read", "write", "full"
  }
)

;; Access audit trail
(define-map access-logs
  { patient: principal, log-id: uint }
  {
    accessor: principal,
    record-id: uint,
    action: (string-ascii 20),
    timestamp: uint
  }
)

(define-map patient-log-count
  principal
  uint
)

;; Read-only functions

(define-read-only (get-patient (patient principal))
  (map-get? patients patient)
)

(define-read-only (get-medical-record (patient principal) (record-id uint))
  (map-get? medical-records { patient: patient, record-id: record-id })
)

(define-read-only (get-record-count (patient principal))
  (default-to u0 (map-get? patient-record-count patient))
)

(define-read-only (has-access (patient principal) (hospital principal))
  (match (map-get? record-access { patient: patient, hospital: hospital })
    access-info (get granted access-info)
    false
  )
)

(define-read-only (get-access-info (patient principal) (hospital principal))
  (map-get? record-access { patient: patient, hospital: hospital })
)

(define-read-only (is-patient-registered (patient principal))
  (match (map-get? patients patient)
    patient-info (get registered patient-info)
    false
  )
)

(define-read-only (get-log-count (patient principal))
  (default-to u0 (map-get? patient-log-count patient))
)

(define-read-only (get-access-log (patient principal) (log-id uint))
  (map-get? access-logs { patient: patient, log-id: log-id })
)

(define-read-only (is-emergency-access-enabled)
  (var-get emergency-access-enabled)
)

;; Public functions

;; Register a new patient
(define-public (register-patient (emergency-contact (optional principal)))
  (let
    (
      (caller tx-sender)
    )
    (asserts! (is-none (map-get? patients caller)) err-already-exists)
    (ok (map-set patients caller {
      registered: true,
      registration-date: block-height,
      emergency-contact: emergency-contact
    }))
  )
)

;; Update emergency contact
(define-public (update-emergency-contact (new-contact (optional principal)))
  (let
    (
      (caller tx-sender)
      (patient-data (unwrap! (map-get? patients caller) err-not-found))
    )
    (ok (map-set patients caller
      (merge patient-data { emergency-contact: new-contact })
    ))
  )
)

;; Add a medical record
(define-public (add-medical-record 
  (ipfs-hash (string-ascii 64))
  (record-type (string-ascii 50))
  (encrypted bool)
)
  (let
    (
      (caller tx-sender)
      (current-count (get-record-count caller))
      (new-record-id (+ current-count u1))
    )
    (asserts! (is-patient-registered caller) err-not-found)
    (asserts! (> (len ipfs-hash) u0) err-invalid-input)
    
    (map-set medical-records
      { patient: caller, record-id: new-record-id }
      {
        ipfs-hash: ipfs-hash,
        record-type: record-type,
        created-at: block-height,
        created-by: caller,
        encrypted: encrypted
      }
    )
    
    (map-set patient-record-count caller new-record-id)
    
    (log-access caller caller new-record-id "create")
    
    (ok new-record-id)
  )
)

;; Grant access to a hospital
(define-public (grant-access 
  (hospital principal)
  (access-level (string-ascii 20))
  (expires-at (optional uint))
)
  (let
    (
      (caller tx-sender)
    )
    (asserts! (is-patient-registered caller) err-not-found)
    
    (ok (map-set record-access
      { patient: caller, hospital: hospital }
      {
        granted: true,
        granted-at: block-height,
        expires-at: expires-at,
        access-level: access-level
      }
    ))
  )
)

;; Revoke access from a hospital
(define-public (revoke-access (hospital principal))
  (let
    (
      (caller tx-sender)
      (access-info (unwrap! (map-get? record-access { patient: caller, hospital: hospital }) err-not-found))
    )
    (ok (map-set record-access
      { patient: caller, hospital: hospital }
      (merge access-info { granted: false })
    ))
  )
)

;; Access a medical record (with permission check)
(define-public (access-record (patient principal) (record-id uint))
  (let
    (
      (caller tx-sender)
      (record (unwrap! (map-get? medical-records { patient: patient, record-id: record-id }) err-not-found))
    )
    ;; Check if caller is the patient or has access
    (asserts! 
      (or 
        (is-eq caller patient)
        (has-access patient caller)
        (var-get emergency-access-enabled)
      )
      err-no-access
    )
    
    (log-access patient caller record-id "read")
    
    (ok record)
  )
)

;; Private functions

(define-private (log-access (patient principal) (accessor principal) (record-id uint) (action (string-ascii 20)))
  (let
    (
      (current-log-count (get-log-count patient))
      (new-log-id (+ current-log-count u1))
    )
    (map-set access-logs
      { patient: patient, log-id: new-log-id }
      {
        accessor: accessor,
        record-id: record-id,
        action: action,
        timestamp: block-height
      }
    )
    (map-set patient-log-count patient new-log-id)
    true
  )
)

;; Admin functions

(define-public (toggle-emergency-access)
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok (var-set emergency-access-enabled (not (var-get emergency-access-enabled))))
  )
)

(define-public (enable-emergency-access)
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok (var-set emergency-access-enabled true))
  )
)

(define-public (disable-emergency-access)
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok (var-set emergency-access-enabled false))
  )
)

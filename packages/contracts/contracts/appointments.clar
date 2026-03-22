;; appointments.clar
;; Patients book appointments with doctors; doctors confirm or cancel.

(define-constant ERR-NOT-FOUND      (err u300))
(define-constant ERR-UNAUTHORIZED   (err u301))
(define-constant ERR-INVALID-STATUS (err u302))
(define-constant ERR-LIST-FULL      (err u303))

;; status: 0=pending 1=confirmed 2=cancelled 3=completed
(define-map appointments
  { appt-id: uint }
  {
    patient:   principal,
    doctor:    principal,
    slot:      uint,              ;; unix timestamp of appointment slot
    notes-cid: (string-ascii 64),
    status:    uint,
    created:   uint,
    updated:   uint
  }
)

(define-map doctor-appointments
  { doctor: principal }
  { ids: (list 200 uint) }
)

(define-map patient-appointments
  { patient: principal }
  { ids: (list 200 uint) }
)

(define-data-var next-appt-id uint u1)

(define-read-only (get-appointment (appt-id uint))
  (map-get? appointments { appt-id: appt-id })
)

(define-read-only (get-doctor-appointments (doctor principal))
  (map-get? doctor-appointments { doctor: doctor })
)

(define-read-only (get-patient-appointments (patient principal))
  (map-get? patient-appointments { patient: patient })
)

(define-public (book
    (doctor    principal)
    (slot      uint)
    (notes-cid (string-ascii 64)))
  (let (
    (id          (var-get next-appt-id))
    (doc-current (default-to { ids: (list) } (map-get? doctor-appointments { doctor: doctor })))
    (pat-current (default-to { ids: (list) } (map-get? patient-appointments { patient: tx-sender })))
    (new-doc-ids (as-max-len? (append (get ids doc-current) id) u200))
    (new-pat-ids (as-max-len? (append (get ids pat-current) id) u200))
  )
    (asserts! (is-some new-doc-ids) ERR-LIST-FULL)
    (asserts! (is-some new-pat-ids) ERR-LIST-FULL)
    (map-set appointments
      { appt-id: id }
      { patient: tx-sender, doctor: doctor, slot: slot, notes-cid: notes-cid,
        status: u0, created: block-height, updated: block-height })
    (map-set doctor-appointments { doctor: doctor }
      { ids: (unwrap! new-doc-ids ERR-LIST-FULL) })
    (map-set patient-appointments { patient: tx-sender }
      { ids: (unwrap! new-pat-ids ERR-LIST-FULL) })
    (var-set next-appt-id (+ id u1))
    (ok id)
  )
)

(define-public (confirm (appt-id uint))
  (let ((appt (unwrap! (get-appointment appt-id) ERR-NOT-FOUND)))
    (asserts! (is-eq tx-sender (get doctor appt)) ERR-UNAUTHORIZED)
    (asserts! (is-eq (get status appt) u0) ERR-INVALID-STATUS)
    (map-set appointments { appt-id: appt-id }
      (merge appt { status: u1, updated: block-height }))
    (ok true)
  )
)

(define-public (cancel (appt-id uint))
  (let ((appt (unwrap! (get-appointment appt-id) ERR-NOT-FOUND)))
    (asserts!
      (or (is-eq tx-sender (get patient appt)) (is-eq tx-sender (get doctor appt)))
      ERR-UNAUTHORIZED)
    (asserts! (< (get status appt) u2) ERR-INVALID-STATUS)
    (map-set appointments { appt-id: appt-id }
      (merge appt { status: u2, updated: block-height }))
    (ok true)
  )
)

(define-public (complete (appt-id uint))
  (let ((appt (unwrap! (get-appointment appt-id) ERR-NOT-FOUND)))
    (asserts! (is-eq tx-sender (get doctor appt)) ERR-UNAUTHORIZED)
    (asserts! (is-eq (get status appt) u1) ERR-INVALID-STATUS)
    (map-set appointments { appt-id: appt-id }
      (merge appt { status: u3, updated: block-height }))
    (ok true)
  )
)

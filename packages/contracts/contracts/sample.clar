;; Simple "Hello World" contract for the Staxial project.
;; This is a minimal example Clarity contract on the Stacks blockchain.

;; A read-only function that returns a greeting string.
(define-read-only (hello)
  "hello, Stacks!")


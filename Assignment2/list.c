#include <stdio.h>
#include <oqs/oqs.h>

int main() {
    // ========== KEM Algorithms ==========
    printf("=== KEM Algorithms ===\n");
    size_t kem_count = OQS_KEM_alg_count();

    for (size_t i = 0; i < kem_count; i++) {
        const char *alg_name = OQS_KEM_alg_identifier(i);

        if (OQS_KEM_alg_is_enabled(alg_name)) {
            OQS_KEM *kem = OQS_KEM_new(alg_name);
            if (kem != NULL) {
                printf("\nAlgorithm: %s\n", kem->method_name);
                printf("  Public key length:  %zu bytes\n", kem->length_public_key);
                printf("  Secret key length:  %zu bytes\n", kem->length_secret_key);
                printf("  Ciphertext length:  %zu bytes\n", kem->length_ciphertext);
                printf("  Shared secret length: %zu bytes\n", kem->length_shared_secret);
                OQS_KEM_free(kem);
            } else {
                printf("  [Error initializing %s]\n", alg_name);
            }
        } else {
            printf("\nAlgorithm: %s (disabled in build)\n", alg_name);
        }
    }

    // ========== Signature Algorithms ==========
    printf("\n\n=== Signature (SIG) Algorithms ===\n");
    size_t sig_count = OQS_SIG_alg_count();

    for (size_t i = 0; i < sig_count; i++) {
        const char *sig_name = OQS_SIG_alg_identifier(i);

        if (OQS_SIG_alg_is_enabled(sig_name)) {
            OQS_SIG *sig = OQS_SIG_new(sig_name);
            if (sig != NULL) {
                printf("\nAlgorithm: %s\n", sig->method_name);
                printf("  Public key length:  %zu bytes\n", sig->length_public_key);
                printf("  Secret key length:  %zu bytes\n", sig->length_secret_key);
                printf("  Signature length:   %zu bytes\n", sig->length_signature);
                OQS_SIG_free(sig);
            } else {
                printf("  [Error initializing %s]\n", sig_name);
            }
        } else {
            printf("\nAlgorithm: %s (disabled in build)\n", sig_name);
        }
    }

    return 0;
}

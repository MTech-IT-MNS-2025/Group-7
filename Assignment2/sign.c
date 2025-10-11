#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <oqs/oqs.h>
#include <time.h>

double time_ms(clock_t start, clock_t end) {
    return ((double)(end - start) / CLOCKS_PER_SEC) * 1000.0;
}

int main() {
    OQS_STATUS rc;
    const char *alg_name = "Dilithium2";  // PQC Signature
    OQS_SIG *sig = NULL;

    printf("Algorithm: %s\n", alg_name);

    // Initialize the signature object
    sig = OQS_SIG_new(alg_name);
    if (sig == NULL) {
        fprintf(stderr, "Error initializing signature algorithm.\n");
        return EXIT_FAILURE;
    }

    // Allocate memory for keys and signature
    uint8_t *public_key = malloc(sig->length_public_key);
    uint8_t *secret_key = malloc(sig->length_secret_key);
    uint8_t *signature = malloc(sig->length_signature);
    if (!public_key || !secret_key || !signature) {
        fprintf(stderr, "Memory allocation failed.\n");
        OQS_SIG_free(sig);
        return EXIT_FAILURE;
    }

    // Key generation with timing
    clock_t start = clock();
    rc = OQS_SIG_keypair(sig, public_key, secret_key);
    clock_t end = clock();
    if (rc != OQS_SUCCESS) {
        fprintf(stderr, "Keypair generation failed.\n");
        goto cleanup;
    }
    double keygen_time = time_ms(start, end);
    printf("Keypair generated successfully in %.3f ms.\n", keygen_time);

    // Message to sign
    const char *message = "Post-Quantum Cryptography is the future";
    size_t message_len = strlen(message);
    size_t sig_len;

    // Sign the message with timing
    start = clock();
    rc = OQS_SIG_sign(sig, signature, &sig_len, (const uint8_t *)message, message_len, secret_key);
    end = clock();
    if (rc != OQS_SUCCESS) {
        fprintf(stderr, "Signing failed.\n");
        goto cleanup;
    }
    double sign_time = time_ms(start, end);
    printf("Message signed successfully in %.3f ms.\n", sign_time);

    // Verify the signature with timing
    start = clock();
    rc = OQS_SIG_verify(sig, (const uint8_t *)message, message_len, signature, sig_len, public_key);
    end = clock();
    double verify_time = time_ms(start, end);

    if (rc == OQS_SUCCESS) {
        printf("✅ Signature verification SUCCESSFUL in %.3f ms.\n", verify_time);
    } else {
        printf("❌ Signature verification FAILED in %.3f ms.\n", verify_time);
    }

    // Print key and signature sizes
    printf("\n--- Key and Signature Sizes ---\n");
    printf("Public key size : %zu bytes\n", sig->length_public_key);
    printf("Secret key size : %zu bytes\n", sig->length_secret_key);
    printf("Signature size  : %zu bytes\n", sig->length_signature);

cleanup:
    free(public_key);
    free(secret_key);
    free(signature);
    OQS_SIG_free(sig);

    return EXIT_SUCCESS;
}
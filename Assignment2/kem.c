#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <oqs/oqs.h>

int main() {
    const char *alg = "Kyber512";

    // Initialize KEM
    OQS_KEM *kem = OQS_KEM_new(alg);
    if (kem == NULL) {
        printf("Failed to initialize KEM %s\n", alg);
        return 1;
    }

    // Allocate buffers
    uint8_t *alice_public_key = malloc(kem->length_public_key);
    uint8_t *alice_secret_key = malloc(kem->length_secret_key);
    uint8_t *ciphertext = malloc(kem->length_ciphertext);
    uint8_t *bob_shared_secret = malloc(kem->length_shared_secret);
    uint8_t *alice_shared_secret = malloc(kem->length_shared_secret);

    if (!alice_public_key || !alice_secret_key || !ciphertext || !bob_shared_secret || !alice_shared_secret) {
        printf("Memory allocation failed\n");
        OQS_KEM_free(kem);
        return 1;
    }

    // Measure key generation time
    clock_t start = clock();
    if (OQS_KEM_keypair(kem, alice_public_key, alice_secret_key) != OQS_SUCCESS) {
        printf("Keypair generation failed\n");
        goto cleanup;
    }
    clock_t end = clock();
    double keygen_time = (double)(end - start) / CLOCKS_PER_SEC;

    // Measure encapsulation time
    start = clock();
    if (OQS_KEM_encaps(kem, ciphertext, bob_shared_secret, alice_public_key) != OQS_SUCCESS) {
        printf("Encapsulation failed\n");
        goto cleanup;
    }
    end = clock();
    double encaps_time = (double)(end - start) / CLOCKS_PER_SEC;

    // Measure decapsulation time
    start = clock();
    if (OQS_KEM_decaps(kem, alice_shared_secret, ciphertext, alice_secret_key) != OQS_SUCCESS) {
        printf("Decapsulation failed\n");
        goto cleanup;
    }
    end = clock();
    double decaps_time = (double)(end - start) / CLOCKS_PER_SEC;

    // Print times
    printf("Key generation time: %f seconds\n", keygen_time);
    printf("Encapsulation time: %f seconds\n", encaps_time);
    printf("Decapsulation time: %f seconds\n", decaps_time);

    // Print shared secrets (hex)
    printf("Bob's shared secret:   ");
    for (size_t i = 0; i < kem->length_shared_secret; i++) {
        printf("%02X", bob_shared_secret[i]);
    }
    printf("\n");

    printf("Alice's shared secret: ");
    for (size_t i = 0; i < kem->length_shared_secret; i++) {
        printf("%02X", alice_shared_secret[i]);
    }
    printf("\n");

    // Check if shared secrets match
    if (memcmp(bob_shared_secret, alice_shared_secret, kem->length_shared_secret) == 0) {
        printf("Success: Shared secrets match!\n");
    } else {
        printf("Error: Shared secrets do NOT match.\n");
    }

cleanup:
    // Free memory
    free(alice_public_key);
    free(alice_secret_key);
    free(ciphertext);
    free(bob_shared_secret);
    free(alice_shared_secret);
    OQS_KEM_free(kem);

    return 0;
}
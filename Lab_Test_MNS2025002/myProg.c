// myProg.c
#include <stdint.h>
#include <emscripten/emscripten.h>

// Compute (base^exp) % mod using binary exponentiation.
// Uses 64-bit unsigned long long. Works for mod < 2^64.
EMSCRIPTEN_KEEPALIVE
unsigned long long powmod(unsigned long long base,
                          unsigned long long exp,
                          unsigned long long mod) {
    if (mod == 1) return 0;
    unsigned long long result = 1;
    base %= mod;
    while (exp > 0) {
        if (exp & 1ULL) {
            // multiply result * base mod mod, safe for 64-bit wrap if numbers small enough
            __uint128_t tmp = (__uint128_t)result * base;
            result = (unsigned long long)(tmp % mod);
        }
        __uint128_t tmp2 = (__uint128_t)base * base;
        base = (unsigned long long)(tmp2 % mod);
        exp >>= 1;
    }
    return result;
}

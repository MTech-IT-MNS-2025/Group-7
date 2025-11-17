#include <stdio.h>
#include <stdlib.h>
#include <string.h>

unsigned char S[256];
int i, j;

void rc4_init(unsigned char *key, int keylen)
{
    for (int k = 0; k < 256; k++)
        S[k] = k;
    j = 0;
    for (i = 0; i < 256; i++)
    {
        j = (j + S[i] + key[i % keylen]) & 255;
        unsigned char temp = S[i];
        S[i] = S[j];
        S[j] = temp;
    }
    i = j = 0;
}

void rc4_crypt(unsigned char *data, int datalen)
{
    for (int k = 0; k < datalen; k++)
    {
        i = (i + 1) & 255;
        j = (j + S[i]) & 255;
        unsigned char temp = S[i];
        S[i] = S[j];
        S[j] = temp;
        data[k] ^= S[(S[i] + S[j]) & 255];
    }
}

#ifdef __EMSCRIPTEN__
#include <emscripten/emscripten.h>
EMSCRIPTEN_KEEPALIVE void _rc4_init(unsigned char *key, int keylen) { rc4_init(key, keylen); }
EMSCRIPTEN_KEEPALIVE void _rc4_crypt(unsigned char *data, int datalen) { rc4_crypt(data, datalen); }
#endif

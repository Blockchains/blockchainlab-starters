pragma circom 2.1.6;

include "circomlib/circuits/poseidon.circom";

// Public: hash. Private: secret, salt. Proves Poseidon(secret, salt) == hash.
template Preimage() {
    signal input secret;
    signal input salt;
    signal input hash;

    component h = Poseidon(2);
    h.inputs[0] <== secret;
    h.inputs[1] <== salt;
    hash === h.out;
}

component main {public [hash]} = Preimage();

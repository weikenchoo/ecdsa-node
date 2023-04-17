const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { hexToBytes, toHex } = require("ethereum-cryptography/utils");

function hashMessage(message) {
    return keccak256(Uint8Array.from(message))
}

function pubKeyToAddress(pubKey) {
    const hash = keccak256(pubKey.slice(1));
    return toHex(hash.slice(-20));
}

const signatureToPubKey = (message, signature) => {
    const hash = hashMessage(message);
    const fullSignature = hexToBytes(signature)
    const recoveryBit = fullSignature[0];
    const signatureBytes = fullSignature.slice(1);
    return secp.recoverPublicKey(hash, signatureBytes, recoveryBit);
};


module.exports = {
    hashMessage,
    pubKeyToAddress,
    signatureToPubKey,
  };
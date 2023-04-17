import * as secp from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex } from "ethereum-cryptography/utils";

let addresses = [
    {
        "name":"Alice",
        "private_key":"1870fe35ed838d78a8cb856e790fa40154bf49db24ebb65083caf57e1f864a9b",
        "address":"eb082cc9f4661702cdfa2123ce7ccd4dd5011fb7"
    },
    {
        "name":"Bob",
        "private_key":"d859a8e5d13257cda97f9007a300851448def85c660d847aec8bed8a47a42979",
        "address":"aa1bd94b733fcba1fa0dba1a0da5ac7465fce2f8"
    },
    {
        "name":"Charlie",
        "private_key":"9a4dfdc3648923444060d767aff4c976f3e84c8984e0a0f255e68b9e676e2d25",
        "address":"632aa4637d66f8a798b3f2dabfaf1fc3d8b544da"
    }
]


function getAddress(user) {
    const userAccount = addresses.find(e=>e.name == user);
    if (userAccount) {
        return userAccount.address
    } else{
        return null
    }
}

function getPrivateKey(user) {
    const userAccount = addresses.find(e=>e.name == user);
    if (userAccount) {
        return userAccount.private_key
    } else{
        const local =JSON.parse(localStorage.getItem("local"))
        return local.find(e=>e.name == user).private_key
    }
    
}

function generateNewWallet(newName) {
    const privateKey = toHex(secp.utils.randomPrivateKey());
    const publicKey = secp.getPublicKey(privateKey);
    const pubKey = publicKey.slice(1);
    const hashedPubKey = keccak256(pubKey);
    const address = toHex(hashedPubKey.slice(-20));
    const walletName = newName || "0x"+ address;
    const account = {
        "name":walletName,
        "private_key":privateKey,
        "address":address
    }
    return account
}

function hashMessage(message) {
    return keccak256(Uint8Array.from(message))
}

async function signMessage(user,msg) {
    const PRIVATE_KEY = getPrivateKey(user)
    const messageHash = hashMessage(msg);
    const [signature, recoveryBit] = await secp.sign(messageHash, PRIVATE_KEY, {
        recovered: true,
      });
    const fullSignature = new Uint8Array([recoveryBit, ...signature]);
    return toHex(fullSignature);
}

async function recoverKey(message, signature,recoveryBit) {
    return secp.recoverPublicKey(hashMessage(message),signature,recoveryBit)
}

const wallet = {
    addresses,
    signMessage,
    getAddress,
    generateNewWallet,
    recoverKey,
  };
  export default wallet;
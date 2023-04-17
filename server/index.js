const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const utils = require("./utils")

app.use(cors());
app.use(express.json());

const balances = {
  "eb082cc9f4661702cdfa2123ce7ccd4dd5011fb7": 100,
  "aa1bd94b733fcba1fa0dba1a0da5ac7465fce2f8": 100,
  "632aa4637d66f8a798b3f2dabfaf1fc3d8b544da": 100,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  if (!(address in balances)) {
    balances[address] = 0;
  } 
  const balance = balances[address];
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { message, signature} = req.body;
  const { recipient, amount } = message;

  const publicKey = utils.signatureToPubKey(message,signature)
  const sender = utils.pubKeyToAddress(publicKey)

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

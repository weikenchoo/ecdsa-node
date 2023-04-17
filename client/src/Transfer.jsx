import { useState } from "react";
import server from "./server";
import wallet from "./LocalWallet";


function Transfer({ user, setBalance ,localAccounts, setLocalAccounts}) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const message = {
      amount : parseInt(sendAmount),
      recipient
    }
  
    const signature = await wallet.signMessage(user,message)
    const transaction = {
      message,
      signature
    }
  
    try {
      const {
        data: { balance },
      } = await server.post(`send`, transaction);
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <select onChange={setValue(setRecipient)} value={recipient}>
          <option value="">--- please choose a user wallet ---</option>
          {wallet.addresses.map((u, i) => (
            <option key={i} value={u.address}>
              {u.name}
            </option>
          ))}
          {localAccounts.map((u, i) => (
            <option key={i} value={u.address}>
              {u.name}
            </option>
          ))}
        </select>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;

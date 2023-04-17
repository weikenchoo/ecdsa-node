import server from "./server";
import wallet from "./LocalWallet";
import { useState} from "react";

function Wallet({ user, setUser, balance, setBalance ,localAccounts, setLocalAccounts}) {

  const [newName,setNewName] = useState("")
  const [error,setError] = useState("")

  function onChange(event) {
    setNewName(event.target.value);
  }

  async function onSelectUser(evt) {
    const user = evt.target.value;
    setUser(user);
    let address = wallet.getAddress(user)
    
    if (!address) {
      address = localAccounts.find(e=>e.name == user).address;
    } 

    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }
  
  function generateNewWallet(){
    // check if existing name already exists
    if (wallet.addresses.find(e=>e.name == newName)) {
      setError("This name has been taken. Please choose another name.")
    }
    else{
      const account = wallet.generateNewWallet(newName);
      let updatedAccounts = []
      console.log(localAccounts);
      if (localAccounts) {
        updatedAccounts = [...localAccounts,account]
        
      } else{
        updatedAccounts.push(account)
      }
      
      localStorage.setItem("local",JSON.stringify(updatedAccounts))
      setUser(account.name)
      setNewName("")
      setError("")
      setBalance(0)
      setLocalAccounts(updatedAccounts)
    }
    
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <select onChange={onSelectUser} value={user}>
          <option value="">--- please choose a user wallet ---</option>
          {wallet.addresses.map((u, i) => (
            <option key={i} value={u.name}>
              {u.name}
            </option>
          ))}
          {localAccounts.map((u, i) => (
            <option key={i} value={u.name}>
              {u.name}
            </option>
          ))}
        </select>
      </label>

      <div className="balance">Balance: {balance}</div>

      <label>
        New Wallet Name
        <input placeholder="Type a name for the new address" value={newName} onChange={onChange}></input>
      </label>
      {error && (
        <p className="error"> {error} </p>
      )}

      <button type="button" className="button" onClick={generateNewWallet}>Generate a new wallet</button>
    </div>
  );
}

export default Wallet;

import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState,useEffect } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [user, setUser] = useState("");
  const [localAccounts,setLocalAccounts] = useState([])

  useEffect(() => {
    localStorage.removeItem("local")
    // const data = localStorage.getItem("local");
    // if (data) {
    //   try {
    //     setLocalAccounts(JSON.parse(data));
    //   } catch (error) {
    //     console.error("Error parsing local storage data", error);
    //   }
    // } else {
    //   console.warn("No local storage data found");
    // }
    
  }, []);

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        user={user}
        setUser={setUser}
        localAccounts={localAccounts}
        setLocalAccounts={setLocalAccounts}
      />
      <Transfer 
        setBalance={setBalance} 
        user={user} 
        localAccounts={localAccounts}
        setLocalAccounts ={setLocalAccounts}
      />
    </div>
  );
}

export default App;

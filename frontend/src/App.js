import "./App.css";
import { useState } from "react";

// import { BrowserRouter as Router } from 'react-router-dom'

import Landing from "./Landing/Landing";
import Dashboard from "./Dashboard/Dashboard";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="App">
      {!isLoggedIn ? (
        <Landing
          onChange={(val1, val2) => {
            console.log("values", val1, val2);
            setIsLoggedIn(val1);
            localStorage.setItem("token", val2);
          }}
        />
      ) : (
        <Dashboard token={localStorage.getItem("token")} />
      )}
    </div>
  );
}

export default App;

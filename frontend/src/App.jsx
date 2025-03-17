import { useState, useEffect } from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login.jsx";
import Signup from "./Pages/Signup.jsx";
import Home from "./Pages/Home.jsx";
import Protected from "./components/Protected";
import Public from "./components/Public";
import useAuth from "./hooks/useAuth";
import axios from "axios";

function App() {
  const token = localStorage.getItem("token");
  const [isLogin, authToken] = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:4000/realms/myrealm/protocol/openid-connect/token", {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then(() => {
        setIsAuthenticated(true);
      })
      .catch((err) => {
        console.error("CORS/authentication error:", err);
      });
  }, [authToken]);

  return (
    <div className="App">
      {isLogin ? <Protected token={authToken} /> : <Public />}

      <Routes>
        <Route path="/" element={token ? <Navigate to="/home" /> : <Navigate to="/login" />} />
        <Route path="/login" element={token ? <Navigate to="/home" /> : <Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;

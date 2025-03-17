import { useState, useEffect, useRef } from "react";
import Keycloak from "keycloak-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const client = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT,
});

const useAuth = () => {
  const isRun = useRef(false);
  const [token, setToken] = useState(null);
  const [isLogin, setLogin] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // For redirecting after login

const handleLogin = async (email, password) => {
  try {
    const params = new URLSearchParams();
    params.append("grant_type", "password");
    params.append("client_id", import.meta.env.VITE_KEYCLOAK_CLIENT);
    params.append("username", email);
    params.append("password", password);

    const response = await axios.post(
      "http://localhost:4000/",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const authToken = response.data.access_token;
    setLogin(true);
    setToken(authToken);
    localStorage.setItem("token", authToken);

    console.log("Authenticated successfully:", authToken);
    window.location.href = "/home"; // Redirect to home
  } catch (err) {
    console.error("CORS/authentication error: ", err);
    setError("Invalid credentials or server error");
  }
};

  useEffect(() => {
    if (isRun.current) return;
    isRun.current = true;

    client.init({ onLoad: "login-required" }).then((authenticated) => {
      setLogin(authenticated);
      if (authenticated) {
        setToken(client.token);
        localStorage.setItem("token", client.token);
        navigate("/home");
      }
    });
  }, [navigate]);

  return [isLogin, token, handleLogin, error];
};

export default useAuth;

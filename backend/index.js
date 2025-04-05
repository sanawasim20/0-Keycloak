import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import AuthRouter from "./Routes/AuthRouter.js"; 
import session from "express-session";  // Required for Google OAuth
import passport from "passport";  // Required for Google OAuth
import "./Config/Passport.js";  // Import Google OAuth configuration
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from "path";

dotenv.config();
import "./Models/db.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(session({
  secret: process.env.SESSION_SECRET || "auth-123",
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/ping', (req, res)=> {
    res.send("PONG");
});

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );
app.use('/keycloak', createProxyMiddleware({
  target: 'http://localhost:4000',
  changeOrigin: true,
  pathRewrite: {
    '^/keycloak': ''
  }
}));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
//app.use(cors(corsOptions));
app.use('/auth', AuthRouter);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});


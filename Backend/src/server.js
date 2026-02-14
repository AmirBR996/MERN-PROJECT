import express from "express";
import "dotenv/config";
import http from "http";
import authRoutes from "./routes/auth_routes.js";
import {connectDb}from "./config/db.config.js";
import cors from "cors";
import userRoutes from "./routes/user_routes.js";
const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// middleware
app.use(express.json());

// connect database
connectDb();

// auth routes
app.use("/auth", authRoutes);

// user routes
app.use("/users", userRoutes);

const server = http.createServer(app);

server.listen(8080, () => {
  console.log("Server is running at http://localhost:8080");
});

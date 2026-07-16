import express from "express";
import "dotenv/config";
import http from "http";
import authRoutes from "./routes/auth_routes.js";
import { connectDb } from "./config/db.config.js";
import cors from "cors";
import userRoutes from "./routes/user_routes.js";
import productRoutes from "./routes/product_routes.js";
import orderRoutes from "./routes/order_routes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

connectDb();

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

const frontendPath = path.join(__dirname, "../../Front_end/krishik/dist");
app.use(express.static(frontendPath));

app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

const server = http.createServer(app);

server.listen(8080, () => {
  console.log("Server is running at http://localhost:8080");
});
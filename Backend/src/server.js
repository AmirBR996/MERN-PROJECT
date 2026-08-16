import express from "express";
import "dotenv/config";
import http from "http";
import authRoutes from "./routes/auth_routes.js";
import { connectDb } from "./config/db.config.js";
import cors from "cors";
import userRoutes from "./routes/user_routes.js";
import productRoutes from "./routes/product_routes.js";
import orderRoutes from "./routes/order_routes.js";
import vegetableRoutes from "./routes/vegetable_routes.js";
import { startVegetableSyncCron } from "./services/sync.service.js";


const app = express();

app.use(cors({
  origin: "https://krishik-bazar.vercel.app",
  credentials: true
}));

app.use(express.json());

connectDb();

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/", vegetableRoutes);

const server = http.createServer(app);

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  startVegetableSyncCron();
});
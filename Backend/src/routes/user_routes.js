import express from "express";
import {create , getByid , remove , getUsers ,update,} from "../controllers/user_controller.js"
const router = express.Router();

// CRUD users
router.get("/", getUsers);

// create
router.post("/", create);

// update
// put
router.put("/:userId", update);

// get user by id
router.get("/:id", getByid);

// delete user
router.delete("/:id", remove);

export default router;

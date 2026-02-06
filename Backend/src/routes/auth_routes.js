import express from "express";
import {register , login} from "../controller/auth_controller.js"
const router = express.Router();

const middleware = (req, res , next) =>{
    console.log("route level")
    next()
}
router.post("/register",register)
router.post("/login", middleware , middleware , middleware ,login)
export default router
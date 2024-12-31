import jwt from "jsonwebtoken"
import User from "../models/userModel.js";


export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({ message: "Not authorized, token is required" })
        }

        const decoded = jwt.verify(token, process.env.SECRET_PHASE)

        if (!decoded) {
            return res.status(401).json({ message: "Token is invalid" })
        }

        const user = await User.findById(decoded.userId).select("-password")

        if (!user) {
            return res.status(401).json({ message: "User not found" })
        }

        req.user = user

        next()
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}
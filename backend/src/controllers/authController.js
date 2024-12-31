import cloudinary from "../lib/cloudnary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/userModel.js";
import bcryptjs from "bcryptjs"

export const Signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        if (!email || !fullName || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" })
        }

        //if user exists
        const userExists = await User.findOne({ email: email })

        if (userExists) {
            return res.status(400).json({ message: "User already exists" })
        }

        //hash Password
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt);


        const newUser = new User({
            email,
            fullName,
            password: hashedPassword
        })

        if (newUser) {
            generateToken(newUser._id, res)
            await newUser.save();
            return res.status(201).json({
                message: "User created successfully",
                user: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })
        }


        return res.status(400).json({ message: "Error While Creating User" })

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error", error: error.message })
    }

}
export const Signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const userExist = await User.findOne({ email: email });
        if (!userExist) {
            return res.status(401).json({ message: "User not found" })
        }

        const isMatch = await bcryptjs.compare(password, userExist.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        generateToken(userExist._id, res)
        return res.status(200).json({
            message: "User signed in successfully",
            user: userExist._id,
            fullName: userExist.fullName,
            email: userExist.email,
            profilePic: userExist.profilePic
        })

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error", error: error.message })
    }

}
export const Signout = async (req, res) => {
    try {
        res.cookie("token", "", {
            maxAge: 0
        })

        return res.status(200).json({ message: "User signed out successfully" })
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error", error: error.message })
    }

}


export const UpdateProfile = async (req, res) => {
    const { profilePic } = req.body
    const userId = req.user._id
    try {

        if (!profilePic) {
            return res.status(400).json({ message: "Profile Pic is required" })
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic)

        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true })

        if (updatedUser) {
            return res.status(200).json({
                message: "Profile Updated successfully",
                user: updatedUser._id,
                fullName: updatedUser.fullName,
                email: updatedUser.email,
                profilePic: updatedUser.profilePic
            })
        }
        return res.status(400).json({ message: "Error While Updating Profile" })
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}


export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user)

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}


import cloudinary from "../lib/cloudnary.js"
import { getReceiverSocketId, io } from "../lib/socket.js"
import Message from "../models/messageModel.js"
import User from "../models/userModel.js"

export const getUsersForSidebar = async (req, res) => {
    try {
        const signedInUserId = req.user._id
        const filterUsers = await User.find({ _id: { $ne: signedInUserId } }).select("-password")

        res.status(200).json(filterUsers)

    } catch (error) {
        console.log(error.message)
        res.status(500).send("Server Error")
    }
}


export const sendMessages = async (req, res) => {
    const { text, image } = req.body
    const { id: receiverId } = req.params
    const senderId = req.user._id
    try {
        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        })

        await newMessage.save()


        //todo socket.io
        const receiverSocketId = getReceiverSocketId(receiverId)
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        res.status(201).json(newMessage)
    } catch (error) {
        console.log("Error in Messaging : ", error.message)
        res.status(500).send("Message Server Error")

    }
}


export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ],
        });

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

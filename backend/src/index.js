import express from 'express';
import authRoutes from './routes/authRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser"
import { ConnectDb } from './lib/Db.js';
import cors from "cors"
import { app, server } from './lib/socket.js';

import path from "path"


dotenv.config();

const __dirname = path.resolve()

const PORT = process.env.PORT;

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(cors(
    {
        origin: 'http://localhost:5173',
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    }
))
app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "../frontend/dist")))

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist" ,"index.html"))
    })  

}


server.listen(PORT, () => {
    console.log(`Server is running on port localhost:${PORT}`);
    ConnectDb()
});

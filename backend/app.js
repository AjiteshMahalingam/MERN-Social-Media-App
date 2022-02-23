const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');
const multer = require("multer");
// const connectDB = require('./utils/connectDB');

const userRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const conversationsRouter = require('./routes/conversations');
const messagesRouter = require('./routes/messages');
const auth = require('./middleware/auth');

const app = express();
dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}, () => {
    console.log(`MongoDB Connected`);
});
app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "public/images"));
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    },
});

const upload = multer({
    storage: storage
})

app.post("/api/upload", auth, upload.single("file"), (req, res) => {
    try {
        return res.status(200).send({ 'message': "File uploded successfully" });
    } catch (error) {
        res.status(500).send({ 'error': error.message });
    }
});

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/conversations", conversationsRouter);
app.use("/api/messages", messagesRouter);

app.listen(8800, () => {
    console.log("Server running up at 8800");
});
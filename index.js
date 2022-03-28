const express = require("express");
const mongoose = require('mongoose')
const auth = require("./middlewares/auth")
require('dotenv').config()
const cors = require("cors");
const morgan = require('morgan')
const app = express();

const multer = require('multer');
const res = require("express/lib/response");
const port = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

//middlewares
app.use(morgan('dev'));
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

app.get('/ping', (req, res) => {
    res.status(200).send("Welcome to New11 Insta-clone api!")
});

//testing multer
const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 3000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|png|jpeg|gif)$/)) {
            return cb(new Error('Please Upload an image'))
        }
        cb(undefined, true)
    }
})

app.post('/upload', auth(), upload.single('upload'), (req, res) => {
    console.log(req.file);
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})
//auth routes
app.use("/auth", require("./routes/auth"))
//user routes
app.use("/user", require("./routes/user"))
//post routes
app.use("/post", require("./routes/post"))

// Not found route - 404
app.use("**", (req, res) => {
    res.status(404).send({ message: "Route not found hdhh" })
})


app.listen(port, async () => {
    try {
        await mongoose.connect(MONGODB_URI)
        console.log('Connected to database')
    } catch (error) {
        console.log(" Couldn't connect to database ", error)
    }

    console.log("Server started on port " + port);
})
const express = require("express");
const mongoose = require('mongoose')
const auth = require("./middlewares/auth")
const User = require("./models/user");
require('dotenv').config()
const cors = require("cors");
const { cloudinary } = require("./utils/cloudinary")
const morgan = require('morgan')
const app = express();
const multer = require('multer');
const port = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

//middlewares
app.use(morgan('dev'));
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static('./uploads'));

app.get('/ping', (req, res) => {
    res.status(200).send("Welcome to New11 Insta-clone api!")
});


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const uploadImg = multer({ storage: storage }).single('image');

app.post('/user/upload', auth(), uploadImg, async (req, res) => {

    const data = req.file.path
    try {

        const uploadedResponse = await cloudinary.uploader.upload(data, {
            upload_preset: 'ml_default'
        });
        const user = await User.findByIdAndUpdate(req.user_id, {
            $set: {
                avater: uploadedResponse.url
            }
        }, { $new: true })
        await user.save();
        res.send({ user }).status(200)
    } catch (error) {
        console.log((error))
        res.status(500).send({ msg: error })
    }

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
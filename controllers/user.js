const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const sharp = require("sharp")
const User = require("../models/user")
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const user = {}
//registration function
user.signup = async (req, res) => {
    const data = req.body

    try {
        if (data.password.length < 7) return res.status(400).send({ error: 'Password should be at least 7 characters' })
        if (data.age < 15) return res.status(400).send({ error: 'should be at least 15 years' })

        const passwordHash = await bcrypt.hash(data.password, 10)
        const user = await new User({
            email: data.email,
            password: passwordHash,
            fullname: data.fullname,
            age: data.age,
        }).save()

        const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, { expiresIn: 50 * 10 })

        res.status(201).send({
            message: "User created",
            data: {
                token,
                userId: user._id,
                email: user.email,
                fullname: user.fullname,
                age: user.age,
            }
        })
    } catch (error) {
        res.status(400).send({ message: "User couldn't be created", error })
    }

}


user.signin = async (req, res) => {
    const data = req.body

    try {
        const user = await User.findOne({ email: data.email })
        if (!user) return res.status(400).send({ message: "Invalid email or password" })
        const isValidPassword = await bcrypt.compare(data.password, user.password)
        if (!isValidPassword) return res.status(400).send({ message: "Invalid email or password" })
        if (!user.status) return res.status(400).send({ message: "You have been disabled" })

        const token = jwt.sign({ user_id: user._id }, JWT_SECRET_KEY)

        res.status(201).send({
            message: "User LoggedIn",
            data: {
                token,
                user_id: user._id,
                email: user.email,
                fullname: user.fullname,
                age: user.age,
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Unable to signin", error })
    }

}

//get single user by id
user.getOne = async (req, res) => {

    try {
        const user = await User.findById(req.user_id)
        if (!user) return res.status(403).send({ message: "User Profile not found" })
        const { password, ...others } = user._doc
        res.status(200).send({ message: "User Profile", data: others })
    } catch (error) {
        res.status(500).send({ message: "Couldn't get user", error })
    }
}

//update user info by id
user.updateUser = async (req, res) => {
    const data = req.body
    try {
        const user = await User.findByIdAndUpdate(req.user_id, { $set: data }, { new: true })
        if (!user) return res.status(403).send({ message: "User Profile not found" })
        const { password, ...others } = user._doc
        res.status(200).send({ message: "User Profile Updated", data: others })
    } catch (error) {
        res.status(500).send({ message: "Couldn't Update user", error })
    }
}

//update user password by id
user.updatePassword = async (req, res) => {
    const data = req.body
    try {
        const user = await User.findById(req.user_id)
        if (!user) return res.status(403).send({ message: "User not found" })
        const isValidPassword = await bcrypt.compare(data.oldpassword, user.password)
        if (!isValidPassword) return res.status(400).send({ message: "Wrong Old password" })
        if (data.password !== data.confirm) return res.send({ message: "Password and Confirm not the same" })
        const passwordHash = await bcrypt.hash(data.password, 10)
        const updatedUser = await User.findByIdAndUpdate(req.user_id, { $set: { password: passwordHash } }, { new: true })

        const { password, ...others } = updatedUser._doc
        res.status(200).send({ message: "User Password Updated", data: others })
    } catch (error) {
        res.status(500).send({ message: "Couldn't Update user", error })
    }
}

//follow user
user.follow = async (req, res) => {

    if (req.params.id !== req.user_id.toString()) {
        try {
            const user = await User.findById(req.user_id)
            const currentUser = await User.findById(req.params.id)
            if (!user.followings.includes(req.params.id)) {
                if (!currentUser) {
                    return res.send({ message: "User not foun" })
                }
                await user.updateOne({ $push: { followings: req.params.id } });
                await currentUser.updateOne({ $push: { followers: req.user_id.toString() } });

                res.status(200).send({ message: "User have been followed" });

            } else {
                return res.status(400).send({ message: "You already follow this user" });
            }
        } catch (error) {
            res.status(500).send(error)
        }
    } else {
        res.status(400).send({ message: "You cant follow yourself" });
    }

}
//unfollow user
user.unfollow = async (req, res) => {

    if (req.params.id !== req.user_id.toString()) {
        try {
            const user = await User.findById(req.user_id)
            const currentUser = await User.findById(req.params.id)
            if (user.followings.includes(req.params.id)) {
                await user.updateOne({ $pull: { followings: req.params.id } });
                await currentUser.updateOne({ $pull: { followers: req.user_id.toString() } });

                return res.status(200).send({ message: "User have been unfollowed" });

            } else {
                return res.status(403).send({ message: "You do not follow this user initially" });
            }
        } catch (error) {
            return res.status(500).send(error)
        }
    } else {
        return res.status(400).send({ message: "You cant unfollow yourself" });
    }

}

user.uploadImage = ((req, res) => {
    console.log(req.file.buffer.toString());
    res.send({ userId: req.user_id }).status(200)
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

//upload image
// user.uploadImage = async (req, res) => {
//     console.log(req);
// const user = await User.findById(req.user_id);
// if (!user) return res.status(403).send({ error: 'User not found' })
// if (!req.file) return res.status(400).send({ error: "Please Upload an image" })
// const string = await sharp(req.file.buffer).png().resize({ width: 250, height: 250 }).toString();
// user.avatar = string
// await user.save()
// res.send()
// }, (error, req, res, next) => {
//     res.status(500).send({ error: error.message })
// }
// user.uploadImage = (req, res) => {
//     console.log(req.file);
//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send({ error: error.message })
// }

module.exports = user
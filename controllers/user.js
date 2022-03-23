const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
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
        if (!user.status) return res.status(403).send({ message: "You have been disabled" })

        const token = jwt.sign({ user_id: user._id }, JWT_SECRET_KEY)

        res.status(200).send({
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

module.exports = user
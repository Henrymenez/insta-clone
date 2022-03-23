const router = require("express").Router()
const auth = require("./../middlewares/auth")
const userController = require("./../controllers/user")


router.get("/", auth(), userController.getOne)

module.exports = router 
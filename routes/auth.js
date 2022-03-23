const router = require("express").Router()
const AuthController = require("./../controllers/user")

//authentication routes
router.post("/register", AuthController.signup)
router.post("/login", AuthController.signin);

module.exports = router
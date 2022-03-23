const router = require("express").Router()
const auth = require("./../middlewares/auth")
const userController = require("./../controllers/user")


router.get("/", auth(), userController.getOne)
router.put("/edit", auth(), userController.updateUser)
router.put("/password", auth(), userController.updatePassword)
module.exports = router 
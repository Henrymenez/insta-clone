const router = require("express").Router()
const auth = require("./../middlewares/auth")
const userController = require("./../controllers/user")


router.get("/", auth(), userController.getOne)//get profile details
router.put("/edit", auth(), userController.updateUser)//edit profile details
router.put("/password", auth(), userController.updatePassword)//change password
router.put("/follow/:id", auth(), userController.follow); //follow users
router.put("/unfollow/:id", auth(), userController.unfollow); //unfollow users
module.exports = router 
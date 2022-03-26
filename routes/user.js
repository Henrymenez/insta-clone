const router = require("express").Router()
const auth = require("./../middlewares/auth")
const multer = require("multer");
const userController = require("./../controllers/user")

//testing multer
const upload = multer({
    dest: 'pictures',
    limits: {
        fileSize: 3000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|png|jpeg|gif)$/)) {
            return cb(new Error('Please Upload an image'))
        }
        cb(undefined, true)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})


router.get("/", auth(), userController.getOne)//get profile details
router.put("/edit", auth(), userController.updateUser)//edit profile details
router.put("/password", auth(), userController.updatePassword)//change password
router.put("/follow/:id", auth(), userController.follow); //follow users
router.put("/unfollow/:id", auth(), userController.unfollow); //unfollow users
router.post("/pictures", auth(), upload.single('upload'), userController.uploadImage);

module.exports = router 
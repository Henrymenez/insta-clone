const router = require("express").Router()
const auth = require("./../middlewares/auth")
const postController = require("./../controllers/post")
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },

});
const uploadImg = multer({ storage: storage }).single('image');

router.post("/", auth(), uploadImg, postController.create);//create post
router.get("/:id", auth(), postController.getOne);//get single post
router.put("/:id", auth(), postController.update);//update post by creator
router.delete("/:id", auth(), postController.deletePost)//delete post by creator
router.put("/like/:id", auth(), postController.like);//like post
router.put("/unlike/:id", auth(), postController.unlike);//unlike post
/*
router.get("/", auth(), postController.getTL)
*/
module.exports = router 
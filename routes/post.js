const router = require("express").Router()
const auth = require("./../middlewares/auth")
const postController = require("./../controllers/post")


router.post("/", auth(), postController.create);//create post
router.get("/:id", auth(), postController.getOne);//get single post
router.put("/:id", auth(), postController.update);//update post by creator
router.delete("/:id", auth(), postController.deletePost)//delete post by creator
router.put("/like/:id", auth(), postController.like);//like post
router.put("/unlike/:id", auth(), postController.unlike);//unlike post
/*
router.get("/", auth(), postController.getTL)
*/
module.exports = router 
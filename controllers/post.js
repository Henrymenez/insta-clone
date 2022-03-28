const Post = require("../models/post")
const User = require("../models/user")

const post = {}

//get a post
//get all posts of the followings tl

post.create = async (req, res) => {
    const data = req.body

    try {
        const post = await new Post({
            owner: req.user_id,
            title: data.title,
            desc: data.desc,
        }).save()

        res.status(201).send(post)

    } catch (err) {
        res.status(500).send({ message: "Post couldn't be created", err })
    }

}
post.getOne = async (req, res) => {

    try {

        const post = await Post.findById(req.params.id)

        if (!post) return res.status(403).send({ message: "Post not found" })
        if (!post.status) return res.status(200).send({ message: "Post", data: post })
        if (post.status && post.owner.toString() !== req.user_id.toString()) return res.status(401).send({ message: "Unauthorized user" })

        res.status(200).send({ message: "Post", data: post })
    } catch (error) {
        res.status(400).send({ message: "Couldn't get post", error })
    }
}


post.update = async (req, res) => {
    const data = req.body
    try {
        const post = await Post.findById(req.params.id)
        if (!post) return res.status(403).send({ message: "Post not found" })
        if (post.owner.toString() === req.user_id.toString()) {
            const updatedPost = await Post.findByIdAndUpdate(req.params.id, { $set: data }, { new: true });
            res.status(200).send({ message: "Post Updated", data: updatedPost })
        } else {
            res.status(400).send({ message: "you can update only your post" });
        }

    } catch (error) {
        res.status(500).send({ message: "Couldn't Update Post", error })
    }

}

post.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) return res.status(403).send({ message: "Post not found" })
        if (post.owner.toString() === req.user_id.toString()) {
            const deletedPost = await Post.findByIdAndDelete(req.params.id);
            res.status(200).send({ message: "Post Deleted", data: deletedPost })
        } else {
            res.status(400).send({ message: "you can delete only your post" });
        }
    } catch (error) {
        res.status(500).send({ message: "Couldn't delete post", error })
    }
}


post.like = async (req, res) => {

    try {
        const post = await Post.findById(req.params.id)
        if (!post.likes.includes(req.user_id)) {

            await post.updateOne({
                $push: {
                    likes: req.user_id
                }
            });

            res.status(200).send({ message: "Liked post" });

        } else {

            res.status(403).send({ message: "You already Liked this post" });
        }
    } catch (error) {
        res.status(500).send(error)
    }


}

post.unlike = async (req, res) => {

    try {
        const post = await Post.findById(req.params.id)
        if (post.likes.includes(req.user_id)) {
            await Post.updateOne({ $pull: { likes: req.user_id } });
            res.status(200).send({ message: "Post unliked" });

        } else {
            res.status(403).send({ message: "You already unliked this user" });
        }
    } catch (error) {
        res.status(500).send(error)
    }

}

module.exports = post
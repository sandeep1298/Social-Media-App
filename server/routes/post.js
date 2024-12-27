const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")

router.get('/allpost', requireLogin, (req, res) => {
    Post.find()
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .sort({ createdAt: -1 })
        .then(posts => {
            res.json({ posts });
        })
        .catch(err => {
            console.log(err);
        });
});

router.get('/getsubpost',requireLogin, (req,res)=>{
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .then(posts =>{
        res.json({posts})
    })
    .catch(err =>{
        console.log(err)
    })
})

router.post('/createpost',requireLogin,(req,res)=>{
    const {title,body,photo} = req.body
    if(!title || !body || !photo){
     return  res.status(422).json({error:"Please add all the fields"})
    }
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        photo,
        postedBy:req.user
    })
    post.save().then(result =>{
        res.json({
            message: "Post Created Successfully",
            post:result})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.put('/updatepost/:postId', requireLogin, (req, res) => {
    const { title, body, photo } = req.body;

    // Validate postId format
    if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
        return res.status(400).json({ error: "Invalid Post ID" });
    }

    // Find and update the post
    Post.findOne({ _id: req.params.postId })
        .populate("postedBy", "_id")
        .exec()
        .then(post => {
            if (!post) {
                return res.status(404).json({ error: "Post not found" });
            }

            // Check if the current user is the owner of the post
            if (post.postedBy._id.toString() === req.user._id.toString()) {
                // Update the post fields
                if (title) post.title = title;
                if (body) post.body = body;
                if (photo) post.photo = photo;

                // Save the updated post
                post.save()
                    .then(updatedPost => {
                        res.json({
                            message: "Post updated successfully",
                            post: updatedPost
                        });
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).json({ error: "Failed to update post" });
                    });
            } else {
                return res.status(403).json({ error: "Unauthorized" });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        });
});

router.get('/mypost',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy", "_id name")
    .then(mypost =>{
        res.json({mypost})
    })
    .catch(err =>{
        console.log(err)
    })
})

router.put('/like', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(
        req.body.postId,
        { $push: { likes: req.user._id } },
        { new: true }
    )
    .populate("postedBy", "_id name")
    .populate("comments.postedBy","_id name")
    .exec()
    .then(result => res.json(result))
    .catch(err => res.status(422).json({ error: err }));
});

router.put('/unlike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(
        req.body.postId,
        { $pull: { likes: req.user._id } },
        { new: true }
    )
    .populate("postedBy", "_id name")
    .populate("comments.postedBy","_id name")
    .exec()
    .then(result => res.json(result))
    .catch(err => res.status(422).json({ error: err }));
});


router.put('/comment', requireLogin, (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id,
    };

    Post.findByIdAndUpdate(
        req.body.postId,
        { $push: { comments: comment } },
        { new: true }
    )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec()
    .then(result => res.json(result))
    .catch(err => res.status(422).json({ error: err }));
});

router.delete('/deletepost/:postId', requireLogin, (req, res) => {
    // Validate postId format
    if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
        return res.status(400).json({ error: "Invalid Post ID" });
    }

    Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec()
    .then(post => {
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        if (post.postedBy._id.toString() === req.user._id.toString()) {
            // Use deleteOne to remove the document
            return Post.deleteOne({ _id: post._id })
                .then(result => res.json({ message: "Post deleted successfully", result }))
                .catch(err => {
                    console.error(err);
                    res.status(500).json({ error: "Failed to delete post" });
                });
        } else {
            return res.status(403).json({ error: "Unauthorized" });
        }
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    });
});


module.exports = router
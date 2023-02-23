import express from 'express';
import Post from '../models/postModel.js';
import { isAuth, generateToken } from '../utils.js';

const postRouter = express.Router();

//creating a post

postRouter.post('/', isAuth, async (req, res) => {
  try {
    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      post: req.body.post,
      user_id: req.user._id,
      user_name: req.user.username,
      Date: req.body.date,
    });
    const post = await newPost.save();
    res.status(200).send({ message: 'Post Successfully completed', post });
  } catch (err) {
    res.status(500).send({ message: 'Something went wrong' });
  }
});

//fetch all posts by excluding scheduled posts.

postRouter.get('/allPosts', async (req, res) => {
  let dt = new Date();
  dt = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate();
  try {
    const posts = await Post.find({
      Date: { $lte: dt },
    }).sort({ createdAt: -1 });

    res.status(200).send(posts);
  } catch (err) {
    res.status(500).send({ message: 'Something went wrong' });
  }
});

//fetch scheduled posts

postRouter.get('/scheduledPosts', isAuth, async (req, res) => {
  let dt = new Date();
  dt = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate();

  try {
    const scheduledPosts = await Post.find({
      user_id: req.user._id,
      Date: { $gt: dt },
    }).sort({
      createdAt: -1,
    });
    res.status(200).send(scheduledPosts);
  } catch (err) {
    res.status(500).send({ message: 'Something went wrong' });
  }
});

//fetch my posts
postRouter.get('/myposts', isAuth, async (req, res) => {
  let dt = new Date();
  dt = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate();

  try {
    const myposts = await Post.find({
      user_id: req.user._id,
      Date: { $lte: dt },
    }).sort({
      createdAt: -1,
    });
    res.status(200).send(myposts);
  } catch (err) {
    res.status(500).send({ message: 'Something went wrong' });
  }
});

//fetch posts by ascending or descending order.

postRouter.get('/getSortedPosts/oldest', async (req, res) => {
  let dt = new Date();
  dt = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate();
  try {
    const post = await Post.find({ Date: { $lte: dt } }).sort({
      createdAt: 1,
    });
    if (!post) return res.status(404).send();
    res.send(post);
  } catch (err) {
    res.status(500).send({ message: 'Something went wrong' });
  }
});

//fetch post by post id
postRouter.get('/getPost/:id', async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).send();
    res.send(post);
  } catch (err) {
    res.status(500).send('Post not found');
  }
});

//deleting a post based on post id

postRouter.delete('/post/:id', async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id });
    if (!post) return res.status(404).send();
    res.send({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).send(err);
  }
});

//updating post
postRouter.put('/updatePost/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      post.title = req.body.title;
      post.content = req.body.content;
      post.post = req.body.post;
      post.Date = req.body.date;
      await post.save();
      res.send({ message: 'Post updated' });
    } else {
      res.status(404).send({ message: 'Post Not Found' });
    }
  } catch (err) {
    res.status(500).send({ message: 'Error' });
  }
});

export default postRouter;

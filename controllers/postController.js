import Post from '../models/postModel.js';
import User from '../models/userModel.js';

// Create post
const createPost = async (req, res) => {
  const { id } = req.user;
  const { title, content } = req.body;

  if (!id) {
    return res.json({
      message: 'Please login to create a post',
      success: false,
      status: 401,
    });
  }

  if (!title || !content) {
    return res.json({
      message: 'All fields are required',
      status: 401,
      success: false,
    });
  }

  const userEmail = await User.findById(id);

  try {
    const post = await new Post({
      title,
      content,
      author: id,
      authorEmail: userEmail.email,
    }).save();

    return res.json({
      message: 'Post created successfully',
      status: 201,
      post,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// Get All Blog Posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    return res.json({
      message: 'Posts fetched successfully',
      posts,
      status: 201,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// Get All the Posts of a particular user
const getMyPosts = async (req, res) => {
  const { id } = req.user;

  try {
    const myPosts = await Post.find({ author: id });
    // console.log(myPosts);
    res.json({
      message: 'User posts fetched successfully',
      success: true,
      status: 200,
      myPosts,
    });
    return;
  } catch (error) {
    console.log(error);
  }
};

// Get User single post
const getUserPost = async (req, res) => {
  const { id } = req.user;
  try {
    const post = await Post.findById(req.params.id);

    const newAuthor = post.author.toString().split();

    if (newAuthor[0] === id) {
      res.json({
        post,
        message: 'Post fetched successfully',
        success: true,
        status: 201,
      });
    } else {
      res.json({
        message: 'You can only view your post...',
        status: 400,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// Delete post
const deletePost = async (req, res) => {
  const { id } = req.user;
  try {
    const post = await Post.findById(req.params.id);

    const newAuthor = post.author.toString().split();

    if (newAuthor[0] === id) {
      try {
        await Post.findByIdAndDelete(req.params.id);
        res.json({
          message: 'Post deleted successfully',
          status: 201,
          success: true,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      res.json({
        message: 'You can only delete your post...',
        status: 400,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// Update Post
const updatePost = async (req, res) => {
  const { id } = req.user;
  try {
    const post = await Post.findById(req.params.id);

    const newAuthor = post.author.toString().split();

    if (newAuthor[0] === id) {
      try {
        const updatePost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.json({
          updatePost,
          message: 'Post updated successfully',
          status: 201,
          success: true,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      res.json({
        message: 'You can only update your post...',
        status: 400,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export {
  getAllPosts,
  getMyPosts,
  getUserPost,
  createPost,
  updatePost,
  deletePost,
};

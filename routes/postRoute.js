/* API links that can allow users to create, read, update, and delete blog posts. It should also support user authentication and authorization.
Tasks deliverables: 

User Authentication and Authorization:
Implement user registration and login functionality using JWT authentication.
Ensure that only authorised users can perform actions like creating, updating, and deleting blog posts.

Blog Post Management:
Create endpoints for creating, reading, updating, and deleting blog posts.
Each blog post should have a title, content, author, and timestamp.

*/

import express from 'express';
import {
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  getMyPosts,
  getUserPost,
} from '../controllers/postController.js';
import { tokenVerification } from '../utils/verifyToken.js';

const router = express.Router();

router.post('/create-post', tokenVerification, createPost);
router.put('/user/update-post/:id', tokenVerification, updatePost);
router.get('/user/posts/:id', tokenVerification, getMyPosts);
router.get('/user/post/:id', tokenVerification, getUserPost);
router.get('/', getAllPosts);
router.delete('/user/delete-post/:id', tokenVerification, deletePost);

export default router;

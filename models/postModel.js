import mongoose, { Schema } from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    author: { type: Schema.Types.ObjectId, ref: 'user' },
    authorEmail: { type: String },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() },
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

export default Post;

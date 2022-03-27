/* eslint-disable camelcase */
const Post = require('../models/post');

//  errors messages
const authorizationError = { message: 'you dont have this authorization' };
const randomError = { message: 'something went wrong' };
const ItemFactory = require('../item factory/itemFactory');

const itemFactory = new ItemFactory();
async function savePost(req, type = 'create') {
  let { post } = req;
  switch (type) {
    case 'create':
      post.title = req.body?.title;
      post.type = req.body?.type;

      post.description = itemFactory.createItem(
        req.body?.type,
        req.body?.description
      );

      post.image = req.body?.image;
      post.price = req.body?.price;
      post.isSold = req.body?.isSold;
      post.owner = req.user?._id;
      break;
    case 'update':
      post.title = req.body?.title ?? post.title;
      post.type = req.body?.type;

      post.description =
        itemFactory.createItem(req.body?.type, req.body?.description) ??
        itemFactory.createItem(post.type, post.description);

      post.image = req.body?.image ?? post.image;
      post.price = req.body?.price ?? post.price;
      post.isSold = req.body?.isSold ?? post.isSold;
      break;
    default:
      break;
  }
  try {
    post = await post.save();
    return post;
  } catch (error) {
    return error;
  }
}
const filterPosts = async (res, query) => {
  try {
    // Find and sort by latest
    const posts = await Post.find(query); // .sort({ createdAt: -1 });
    if (posts.length <= 0) {
      res.status(204).json({ message: 'No Posts found' });
    } else res.status(201).json(posts);
  } catch (err) {
    res.status(422).json({ message: err.message });
  }
};
module.exports = {
  updatePost: async (req, res) => {
    const { id } = req.params;
    try {
      //  check authority for the user
      const post = await Post.findById(id);
      if (id && req.user._id === post.owner.toString()) {
        req.post = await Post.findById(id);
        const updatedPost = await savePost(req, 'update');
        return res.status(201).json(updatedPost);
      }
      throw authorizationError;
    } catch (error) {
      return res.status(401).json(error);
    }
  },
  deletePost: async (req, res) => {
    const { id } = req.params;
    try {
      //  check authority for the user
      const post = await Post.findById(id);
      if (id && req.user._id === post.owner.toString()) {
        const deletedPost = await Post.findByIdAndDelete(id);
        return res.status(200).json(deletedPost);
      }
      throw authorizationError;
    } catch (error) {
      return res.status(403).json(error);
    }
  },
  addComment: async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    try {
      const post = await Post.findById(id);
      const newComment = {
        text,
        //  user should be signed in and authenticated
        creator: req?.user?._id ?? null,
      };
      post.comments.push(newComment);
      const updatedPost = await post.save();
      return res.status(201).json(updatedPost);
    } catch (error) {
      return res.status(403).json(randomError);
    }
  },
  updateComment: async (req, res) => {
    const { id, commentid } = req.params;
    const { text } = req.body;
    try {
      const post = await Post.findById(id);
      const comment = post.comments.find((c) => c.id === commentid);
      //  check authority for the user
      if (id && req.user._id === comment.creator.toString()) {
        comment.text = text;
        const updatedPost = await post.save();
        return res.status(201).json(updatedPost);
      }
      throw authorizationError;
    } catch (error) {
      return res.status(403).json(error);
    }
  },
  deleteComment: async (req, res) => {
    const { id, commentid } = req.params;
    try {
      const post = await Post.findById(id);
      const comment = post.comments.find((c) => c.id === commentid);
      if (id && req.user._id === comment.creator.toString()) {
        const indexOfComment = post.comments.indexOf(comment);
        post.comments.splice(indexOfComment, 1);
        const updatedPost = await post.save();
        return res.status(200).json(updatedPost);
      }
      throw authorizationError;
    } catch (error) {
      return res.status(403).json(error);
    }
  },
  getAllPosts: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: -1 });
      if (!posts) res.status(204).json({ message: `there are no posts` });
      else res.status(200).json(posts);
    } catch (err) {
      res.status(403).json({ message: err.message });
    }
  },

  getOnePost: async (req, res) => {
    const { id } = req.params;
    try {
      const post = await Post.findById(id);
      if (!post)
        res
          .status(204)
          .json({ message: `The post you are looking for not found` });
      else res.status(200).json(post);
    } catch (err) {
      res.status(403).json({ message: err.message });
    }
  },
  addNewPost: async (req, res) => {
    try {
      req.post = new Post();
      const newPost = await savePost(req);
      /*
    To add post the user needs to be registered(onlyAtuhenticated middleware check that)
    All necessary validations are handled by quesion model
    so we can save new post directly
    */
      const postData = req.body;
      // Assign the new post to the current user
      postData.user = req.user.id;
      res.status(201).json(newPost);
    } catch (err) {
      res.status(403).json({ message: err.message });
    }
  },

  getFilteredPosts: async (req, res) => {
    const { type, max_price, min_price } = req.query;
    if (!type)
      res.status(403).json({ message: 'invalid type for item filter' });
    // eslint-disable-next-line no-restricted-globals
    else if (max_price && isNaN(max_price))
      res
        .status(403)
        .json({ message: 'min and max price should be numbers only' });
    // eslint-disable-next-line no-restricted-globals
    else if (min_price && isNaN(min_price))
      res
        .status(403)
        .json({ message: 'min and max price should be numbers only' });
    else {
      const typeSecuence = type.split('-');
      const query = {
        $and: [
          { type: { $in: typeSecuence } },
          { price: { $gte: min_price || 0 } },
          { price: { $lte: max_price || Infinity } },
        ],
      };
      filterPosts(res, query);
    }
  },
  searchForPosts: async (req, res) => {
    // search in post's title and types
    const { text } = req.query;
    if (!text)
      res.status(403).json({ message: 'Make sure you type search text' });
    else {
      const regEx = new RegExp(text, 'i'); // insensitive
      const query = {
        $or: [{ title: { $regex: regEx } }, { type: { $regex: regEx } }],
      };
      filterPosts(res, query);
    }
  },
};

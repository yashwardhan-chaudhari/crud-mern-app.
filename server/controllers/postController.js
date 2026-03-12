import Post from '../models/Post.js';

const createError = (message, status) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

// ─── POST /api/posts ──────────────────────────────────────────────────────────
export const createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    // Validation — 400 Bad Request
    if (!title || !title.trim()) return next(createError('Title is required', 400));
    if (!content || !content.trim()) return next(createError('Content is required', 400));

    const post = await Post.create({
      title: title.trim(),
      content: content.trim(),
      author: req.user._id,
    });

    const populated = await post.populate('author', 'name email');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/posts ───────────────────────────────────────────────────────────
export const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Only show the current user's posts
    const filter = { author: req.user._id };

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate('author', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/posts/:id ───────────────────────────────────────────────────────
export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name email');

    // 404 — not found
    if (!post) return next(createError('Post not found', 404));

    // 403 — not your post
    if (post.author._id.toString() !== req.user._id.toString()) {
      return next(createError('You don\'t have permission to view this post', 403));
    }

    res.json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/posts/:id ───────────────────────────────────────────────────────
export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    // 404
    if (!post) return next(createError('Post not found', 404));

    // 403 — Authorization check
    if (post.author.toString() !== req.user._id.toString()) {
      return next(createError('You don\'t have permission to edit this post', 403));
    }

    const { title, content } = req.body;
    if (!title || !title.trim()) return next(createError('Title is required', 400));
    if (!content || !content.trim()) return next(createError('Content is required', 400));

    post.title = title.trim();
    post.content = content.trim();
    await post.save();

    const populated = await post.populate('author', 'name email');
    res.json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/posts/:id ────────────────────────────────────────────────────
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    // 404
    if (!post) return next(createError('Post not found', 404));

    // 403 — Authorization check (key demo for assignment video)
    if (post.author.toString() !== req.user._id.toString()) {
      return next(createError('You don\'t have permission to delete this post', 403));
    }

    await post.deleteOne();
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    next(error); // DB errors → 500 via errorHandler middleware
  }
};

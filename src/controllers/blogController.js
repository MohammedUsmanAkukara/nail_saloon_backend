import BlogPost from '../models/BlogPost.js';

export const getBlogPosts = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const query = { published: true };

    if (category && category !== 'All') {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
      ];
    }

    const posts = await BlogPost.find(query).sort({ publishedAt: -1 });
    res.json({
      success: true,
      data: posts,
    });
  } catch (err) {
    next(err);
  }
};

export const getBlogPostBySlug = async (req, res, next) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, published: true });
    if (!post) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }

    const recent = await BlogPost.find({ _id: { $ne: post._id }, published: true })
      .sort({ publishedAt: -1 })
      .limit(3);

    res.json({
      success: true,
      data: post,
      recent,
    });
  } catch (err) {
    next(err);
  }
};

export const adminGetBlogPosts = async (req, res, next) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: posts,
    });
  } catch (err) {
    next(err);
  }
};

export const adminCreateBlogPost = async (req, res, next) => {
  try {
    const { title, slug, excerpt, content, coverImage, category, tags, readTime, author, published } = req.body;
    const formattedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const post = await BlogPost.create({
      title,
      slug: formattedSlug,
      excerpt,
      content,
      coverImage,
      category,
      tags: tags || [],
      readTime: readTime || '4 min read',
      author: author || {},
      published: published !== undefined ? published : true,
    });

    res.status(201).json({
      success: true,
      message: 'Article created.',
      data: post,
    });
  } catch (err) {
    next(err);
  }
};

export const adminUpdateBlogPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!post) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }

    res.json({
      success: true,
      message: 'Article updated.',
      data: post,
    });
  } catch (err) {
    next(err);
  }
};

export const adminDeleteBlogPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }
    res.json({
      success: true,
      message: 'Article deleted.',
    });
  } catch (err) {
    next(err);
  }
};

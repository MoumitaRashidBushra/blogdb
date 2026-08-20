import { Op } from "sequelize";
import { Blog, User } from "../Model/associations.js";

// User can create blog
async function createBlog(userId, blogTitle, blogContent, category) {
  const user = await User.findByPk(userId);

  if (!user) {
    console.log("User not found");
    return null;
  }

  const newBlog = await Blog.create({
    userId,
    blogTitle,
    blog: blogContent,
    category,
  });

  console.log("Blog created");
  return newBlog;
}

// User can see all of their blogs
async function getUserBlogs(userId) {
  const blogs = await Blog.findAll({
    where: { userId },
    order: [["id", "DESC"]],
  });

  if (blogs.length === 0) {
    console.log("No blogs are found");
    return [];
  }

  console.log("Your blogs:");

  blogs.forEach((b) => {
    console.log(`- [${b.id}] ${b.blogTitle}`);
  });

  return blogs;
}

// user can search only their own blog by id or title; admin searches all blogs (pass no userId)
async function searchBlog(query, userId = null) {
  const input = String(query ?? "").trim();

  if (!input) {
    console.log("Please enter a blog ID or blog title");
    return [];
  }

  const isNumericId = /^\d+$/.test(input);

  const where = {};
  if (userId !== null) {
    where.userId = userId;
  }

  let blogs;

  if (isNumericId) {
    // Search by Blog ID → only one blog
    where.id = Number(input);
    blogs = await Blog.findAll({ where });
  } else {
    // Search by Blog Title → multiple blogs can match
    where.blogTitle = {
      [Op.like]: `%${input}%`,
    };
    blogs = await Blog.findAll({
      where,
      order: [["id", "DESC"]],
    });
  }

  if (blogs.length === 0) {
    console.log("Blog not found");
    return [];
  }

  console.log(`Search results for "${input}":`);

  blogs.forEach((b) => {
    console.log(`\n[${b.id}] ${b.blogTitle} (${b.category})\n${b.blog}`);
  });

  return blogs;
}

// User can update only his own blog
async function updateBlog(blogId, updates, userId) {
  const allowedUpdates = {};

  if (updates.blogTitle !== undefined) {
    allowedUpdates.blogTitle = updates.blogTitle;
  }

  if (updates.blog !== undefined) {
    allowedUpdates.blog = updates.blog;
  }

  if (updates.category !== undefined) {
    allowedUpdates.category = updates.category;
  }

  if (Object.keys(allowedUpdates).length === 0) {
    console.log("No valid fields to update");
    return false;
  }

  const [affectedRows] = await Blog.update(allowedUpdates, {
    where: {
      id: blogId,
      userId: userId,
    },
  });

  if (affectedRows === 0) {
    console.log("Blog not found or you are not the owner");
    return false;
  }

  console.log("Blog updated successfully");
  return true;
}

// user can delete his own blog
async function deleteOwnBlog(blogId, userId) {
  const deleted = await Blog.destroy({
    where: {
      id: blogId,
      userId: userId,
    },
  });

  if (deleted === 0) {
    console.log("Blog not found or you are not the owner");
    return false;
  }

  console.log("Blog deleted successfully");
  return true;
}

// admin can deleted any blog
async function adminDeleteBlog(blogId) {
  const deleted = await Blog.destroy({
    where: {
      id: blogId,
    },
  });

  if (deleted === 0) {
    console.log("Blog not found");
    return false;
  }

  console.log("Blog deleted successfully");
  return true;
}

// Admin can view all blogs from all users
async function allUsersBlog() {
  const blogs = await Blog.findAll({
    include: {
      model: User,
      attributes: ["firstname", "lastname", "email"],
    },
  });

  if (blogs.length === 0) {
    console.log("No blogs found");
    return [];
  }

  blogs.forEach((b) => {
    console.log(
      `[${b.id}] ${b.blogTitle} (${b.category}) - by ${b.User.firstname} ${b.User.lastname}`,
    );
  });

  return blogs;
}

async function allBlog() {
  return allUsersBlog();
}

export {
  adminDeleteBlog,
  allBlog,
  allUsersBlog,
  createBlog,
  deleteOwnBlog,
  getUserBlogs,
  searchBlog,
  updateBlog,
};

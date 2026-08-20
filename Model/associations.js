import Blog from "./blogModel.js";
import User from "./userModel.js";

User.hasMany(Blog, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Blog.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

export { Blog, User };

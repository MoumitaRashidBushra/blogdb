import { User } from "../Model/associations.js";

// User can register
async function registerUser(firstname, lastname, email, password) {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    console.log("User already registered");
    return null;
  }
  const user = await User.create({ firstname, lastname, email, password });
  console.log("Registration successful");
  return user;
}

// User and admin can login
async function loginUser(email, password) {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    console.log("Invalid email or password");
    return null;
  }
  if (!user.isActive) {
    console.log("User is deactivated");
    return null;
  }
  if (user.password !== password) {
    console.log("Invalid email or password");
    return null;
  }
  console.log(`Welcome back, ${user.firstname}`);
  return user;
}

//Admin can use all user list
async function allUsers() {
  const users = await User.findAll({ attributes: { exclude: ["password"] } });
  console.log("User list:", JSON.stringify(users, null, 2));
  return users;
}

// Admin can update user status(isActive)
async function updateUserStatus(id, isActive) {
  if (typeof isActive !== "boolean") {
    console.log("isActive must be true or false");
    return false;
  }

  const [affectedRows] = await User.update({ isActive }, { where: { id } });

  if (affectedRows === 0) {
    console.log("No user found with that id");
    return false;
  }

  console.log("User status updated");
  return true;
}

// Admin can deleted any user by id
async function deleteUserById(id) {
  const deleted = await User.destroy({ where: { id } });
  if (deleted === 0) {
    console.log("User not found");
    return false;
  }
  console.log("User deleted");
  return true;
}

export { allUsers, deleteUserById, loginUser, registerUser, updateUserStatus };

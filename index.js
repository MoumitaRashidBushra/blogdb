import readline from "node:readline";

import {
  adminDeleteBlog,
  allBlog,
  allUsersBlog,
  createBlog,
  deleteOwnBlog,
  getUserBlogs,
  searchBlog,
  updateBlog,
} from "./Service/blogService.js";

import {
  allUsers,
  deleteUserById,
  loginUser,
  registerUser,
  updateUserStatus,
} from "./Service/userService.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

let currentUser = null;

// =========================
// MAIN MENU
// =========================

async function mainMenu() {
  console.log("\n===== BLOG APPLICATION =====");
  console.log("1. View All Blogs");
  console.log("2. Login");
  console.log("3. Register");
  console.log("4. Exit");

  const choice = await ask("Enter your choice: ");

  switch (choice) {
    case "1":
      await allBlog();
      return mainMenu();

    case "2": {
      const email = await ask("Email: ");
      const password = await ask("Password: ");

      const user = await loginUser(email, password);

      if (user) {
        currentUser = user;

        if (user.role === "admin") {
          return adminMenu();
        }

        return userMenu();
      }

      return mainMenu();
    }

    case "3": {
      const firstname = await ask("First name: ");
      const lastname = await ask("Last name: ");
      const email = await ask("Email: ");
      const password = await ask("Password: ");

      await registerUser(firstname, lastname, email, password);

      return mainMenu();
    }

    case "4":
      console.log("Goodbye!");
      rl.close();
      return;

    default:
      console.log("Invalid choice");
      return mainMenu();
  }
}

// =========================
// USER MENU
// =========================

async function userMenu() {
  console.log("\n===== USER MENU =====");
  console.log("1. View Your Blogs");
  console.log("2. Search Blog by ID/Title");
  console.log("3. Create Blog");
  console.log("4. Update Blog");
  console.log("5. Delete Blog");
  console.log("6. Logout");

  const choice = await ask("Enter your choice: ");

  switch (choice) {
    case "1":
      await getUserBlogs(currentUser.id);
      return userMenu();

    case "2": {
      const query = await ask("Enter blog ID or title: ");

      await searchBlog(query, currentUser.id);

      return userMenu();
    }

    case "3": {
      const blogTitle = await ask("Blog title: ");
      const blogContent = await ask("Blog content: ");
      const category = await ask("Category: ");

      await createBlog(currentUser.id, blogTitle, blogContent, category);

      return userMenu();
    }

    case "4": {
      const id = await ask("Blog ID to update: ");

      const blogTitle = await ask("New title (leave blank to keep): ");

      const blogContent = await ask("New content (leave blank to keep): ");

      const category = await ask("New category (leave blank to keep): ");

      const updates = {};

      if (blogTitle) {
        updates.blogTitle = blogTitle;
      }

      if (blogContent) {
        updates.blog = blogContent;
      }

      if (category) {
        updates.category = category;
      }

      await updateBlog(parseInt(id, 10), updates, currentUser.id);

      return userMenu();
    }

    case "5": {
      const id = await ask("Blog ID to delete: ");

      await deleteOwnBlog(parseInt(id, 10), currentUser.id);

      return userMenu();
    }

    case "6":
      console.log("Logged out successfully.");

      currentUser = null;

      return mainMenu();

    default:
      console.log("Invalid choice");
      return userMenu();
  }
}

// =========================
// ADMIN MENU
// =========================

async function adminMenu() {
  console.log("\n===== ADMIN MENU =====");
  console.log("1. View All Users");
  console.log("2. View All Blogs");
  console.log("3. Search Blog by ID/Title");
  console.log("4. Update User");
  console.log("5. Delete User");
  console.log("6. Delete Blog");
  console.log("7. Logout");

  const choice = await ask("Enter your choice: ");

  switch (choice) {
    case "1":
      await allUsers();
      return adminMenu();

    case "2":
      await allUsersBlog();
      return adminMenu();

    case "3": {
      const query = await ask("Enter blog ID or title: ");

      await searchBlog(query);

      return adminMenu();
    }

    case "4": {
      const id = await ask("User ID to update: ");

      const isActiveInput = await ask("Set isActive (true/false): ");

      if (isActiveInput !== "true" && isActiveInput !== "false") {
        console.log("Please enter true or false");
        return adminMenu();
      }

      await updateUserStatus(parseInt(id, 10), isActiveInput === "true");

      return adminMenu();
    }

    case "5": {
      const id = await ask("User ID to delete: ");

      await deleteUserById(parseInt(id, 10));

      return adminMenu();
    }

    case "6": {
      const id = await ask("Blog ID to delete: ");

      await adminDeleteBlog(parseInt(id, 10));

      return adminMenu();
    }

    case "7":
      console.log("Logged out successfully.");

      currentUser = null;

      return mainMenu();

    default:
      console.log("Invalid choice");
      return adminMenu();
  }
}

// =========================
// CLOSE CLI
// =========================

function closeCli() {
  rl.close();
}

export { closeCli, mainMenu };

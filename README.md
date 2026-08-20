# Blog DB

## Project Summary

Blog DB is a command-line blog application built with Node.js and Sequelize (MySQL). Users can register, log in, and manage their own blog posts (create, update, delete, search) through an interactive terminal menu, while admins get elevated access to manage all users and all blogs — including activating/deactivating accounts and deleting any user or blog. Data is persisted in MySQL via two related tables (`users` and `blogs`), with the schema created and synced automatically on startup.

## Features

### Authentication
- User registration (first name, last name, email, password)
- Login for both regular users and admins
- Deactivated accounts are blocked from logging in

### User capabilities
- View all blogs
- View only their own blogs
- Search blogs by ID or title (scoped to their own blogs)
- Create a new blog (title, content, category)
- Update their own blog (partial updates supported — leave a field blank to keep it unchanged)
- Delete their own blog
- Logout

### Admin capabilities
- View all registered users
- View all blogs from all users (with author info)
- Search any blog by ID or title (not scoped to a single user)
- Update a user's active status (activate/deactivate)
- Delete any user (cascades and removes their blogs)
- Delete any blog
- Logout

## Tech Stack

- **Runtime:** Node.js (ES Modules)
- **ORM:** [Sequelize](https://sequelize.org/)
- **Database:** MySQL (via `mysql2` driver)
- **Config:** `dotenv`
- **Interface:** Terminal CLI using Node's built-in `readline`

## Database Structure

Two tables, related through a one-to-many association (`User` has many `Blog`, `Blog` belongs to `User`, with cascading delete):

**`users`**
| Column     | Type    | Notes                          |
|------------|---------|---------------------------------|
| id         | INTEGER | Primary key, auto-increment     |
| firstname  | STRING  | Required                        |
| lastname   | STRING  | Optional                        |
| email      | STRING  | Required, unique                |
| password   | STRING  | Required                        |
| isActive   | BOOLEAN | Default `true`                  |
| role       | STRING  | Default `"user"` (or `"admin"`) |

**`blogs`**
| Column     | Type    | Notes                                   |
|------------|---------|------------------------------------------|
| id         | INTEGER | Primary key, auto-increment              |
| userId     | INTEGER | Foreign key → `users.id`                 |
| blogTitle  | STRING  | Required                                 |
| blog       | TEXT    | Required, the blog content               |
| category   | STRING  | Required                                 |

Both tables automatically track `createAt` / `updateAt` timestamps. The schema is created/synced automatically on startup via `sequelize.sync()`.

## Setup Instructions

### Prerequisites
- Node.js installed
- A running MySQL server

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Create a `.env` file in the project root with your database credentials:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=blogdb
DB_USER=root
DB_PASSWORD=your_password
```

Make sure the database specified in `DB_NAME` exists in your MySQL server before starting the app (Sequelize will create the tables for you, but not the database itself).

### 3. Run the application
```bash
node main.js
```

On startup, the app connects to the database, syncs the `users` and `blogs` tables, and launches the interactive CLI menu.

## Usage

When you run the app you'll see the main menu:

```
===== BLOG APPLICATION =====
1. View All Blogs
2. Login
3. Register
4. Exit
```

- Choose **3** to register a new account (you'll be created with the default `user` role — promote to `admin` directly in the database if needed).
- Choose **2** to log in. Based on your role, you'll be routed to either the **User Menu** or the **Admin Menu**.
- Choose **1** to browse all blogs without logging in.

**User menu** lets you view your own blogs, search, create, update, and delete them.

**Admin menu** lets you view all users/blogs, search any blog, activate/deactivate or delete users, and delete any blog.

Follow the on-screen prompts to enter the required input for each action.

## Project Structure

```
blog-db/
├── main.js                  # Entry point: connects to DB and starts the CLI
├── index.js                 # CLI menus (main/user/admin) and navigation logic
├── db.js                    # Sequelize instance and DB connection setup
├── Model/
│   ├── userModel.js         # User Sequelize model
│   ├── blogModel.js         # Blog Sequelize model
│   └── associations.js      # User ↔ Blog relationships
├── Service/
│   ├── userService.js       # User-related business logic (register, login, etc.)
│   └── blogService.js       # Blog-related business logic (CRUD, search)
└── .env                      # Database configuration (not committed)
```

## 🎥 Demo Video

Watch a walkthrough of the project here: [https://app.usebubbles.com/dye7vARGyu4jCUrYxF2hyn/recording-aug-20-2026](https://app.usebubbles.com/dye7vARGyu4jCUrYxF2hyn/recording-aug-20-2026)

# Blogging Platform RESTful API
## Overview
This project is a scalable RESTful API built with Node.js, Express.js, and MongoDB for a full-featured blogging platform. It supports user authentication, blog post management, commenting, and category filtering — all with a clean and modular codebase.
## Features
- **User Authentication:**
    - Register, login, and JWT-protected routes
- **User Management:**
    - Profile updates and role-based permissions (optional)
- **Blog Post Management:**
    - CRUD operations for blog posts
    - Associate posts with categories and authors
- **Comments:**
    - Add, retrieve, and manage comments on posts
- **Categories:**
    - Categorize blog posts and filter by category
- **Clean Architecture:**
    - Modular routing and controller-based structure for maintainability
## Technologies Used
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT (JSON Web Tokens)
- **API Architecture:** RESTful
## Installation
1. Clone the repository
```bash
git clone <repository-url>
```
2. Install dependencies
```bash
npm install
```
3. Set up environment variables
   Create a .env file in the root directory and configure the following
```bash
PORT=4000
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
```
4. Run the application
   ```bash
   npm run start
   ```
5. Access API at:
```bash
http://localhost:5000/api
```
## API Endpoints
### Auth
- `POST /api/auth/register` – Register a new user
- `POST /api/auth/login` – Login and receive a JWT
### Users
- `GET /api/users/` – Get all users (admin only)
- `GET /api/users/:id` – Get user by ID
- `PUT /api/users/:id` – Update a user (protected)
- `DELETE /api/users/:id` – Delete a user (admin only)
- `GET /api/users/count` - Get Users Count
- `PUT /api/users/upload` - Upload new user photo
### Posts
- `GET /api/posts` – List all posts
- `POST /api/posts` – Create a new post (protected)
- `GET /api/posts/:id` – Get posts details 
- `PUT /api/posts/:id` – Update a posts (protected)
- `DELETE /api/posts/:id` – Delete a posts (protected)
- `GET /api/posts/count` - Get Posts Count
### Comments
- `GET /api/comments` – List all comments (admin only)
- `POST /api/comments` – Create a new comments (protected)
- `PUT /api/comments/:id` – Update a comments (protected)
- `DELETE /api/comments/:id` – Delete a comments (protected)
### Category
- `GET /api/categories` – List all categories 
- `POST /api/categories` – Create a new categories (admin only)
- `DELETE /api/categories/:id` – Delete a comments (protected)
# Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your changes.
# License
This project is licensed under the MIT License.
# Support
For support or inquiries, please contact [sabdelrahman110@gmail.com](mailto:sabdelrahman110@gmail.com).

# Book Review System – GraphQL API

A comprehensive GraphQL-based backend API built with Node.js that allows users to register, log in, add books, and write reviews. This project demonstrates modern backend development practices including authentication, authorization, and data relationship management.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing the API](#testing-the-api)
- [Data Relationships](#data-relationships)
- [Authentication](#authentication)

## ✨ Features

### User Module
- ✅ User registration with username, email, and password
- ✅ User login with JWT token generation
- ✅ Password hashing using bcrypt
- ✅ Role-based system (user/admin)

### Book Module
- ✅ Add new books (title, author, description)
- ✅ Books are linked to the user who added them
- ✅ View all books with their reviews
- ✅ View individual book details

### Review Module
- ✅ Add reviews (rating 1-5, comment) for books
- ✅ Reviews are linked to both user and book
- ✅ Admins can delete any review
- ✅ Users can delete their own reviews

## 🛠 Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **Apollo Server Express** - GraphQL server
- **GraphQL** - API query language
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT (jsonwebtoken)** - Authentication
- **bcryptjs** - Password hashing
- **dotenv** - Environment variable management

## 📁 Project Structure

```
k:\graphql\
├── .env                          # Environment variables
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies and scripts
├── README.md                     # Project documentation
└── src/
    ├── index.js                  # Main server entry point
    ├── config/
    │   └── db.js                 # MongoDB connection setup
    ├── models/
    │   ├── User.js               # User model with password hashing
    │   ├── Book.js               # Book model
    │   └── Review.js             # Review model
    ├── utils/
    │   └── auth.js               # JWT & password utilities
    └── graphql/
        ├── typeDefs.js           # GraphQL schema definitions
        └── resolvers/
            └── index.js          # Query & Mutation resolvers
```

## 📦 Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd k:\graphql
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## ⚙️ Configuration

The `.env` file contains the following configuration:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/graphql?retryWrites=true&w=majority
JWT_SECRET=your-secret-key
PORT=4000
```

**Environment Variables:**
- `MONGODB_URI` - MongoDB connection string (already configured with MongoDB Atlas)
- `JWT_SECRET` - Secret key for JWT token generation
- `PORT` - Server port (default: 4000)

## 🚀 Running the Application

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will start at: **http://localhost:4000/graphql**

You'll see the following output:
```
MongoDB connected successfully
🚀 Server ready at http://localhost:4000/graphql
📚 Book Review System API is running
```

## 📚 API Documentation

### GraphQL Schema

#### Types

**User**
```graphql
type User {
  id: ID!
  username: String!
  email: String!
  role: String!
}
```

**Book**
```graphql
type Book {
  id: ID!
  title: String!
  author: String!
  description: String!
  addedBy: User!
  reviews: [Review!]!
}
```

**Review**
```graphql
type Review {
  id: ID!
  rating: Int!
  comment: String!
  user: User!
  book: Book!
  createdAt: String!
}
```

**AuthPayload**
```graphql
type AuthPayload {
  token: String!
  user: User!
}
```

### Queries

#### 1. Get All Books
```graphql
query {
  getBooks {
    id
    title
    author
    description
    addedBy {
      id
      username
      email
    }
    reviews {
      id
      rating
      comment
      user {
        username
      }
    }
  }
}
```

#### 2. Get Single Book
```graphql
query {
  getBook(id: "BOOK_ID_HERE") {
    id
    title
    author
    description
    addedBy {
      username
    }
    reviews {
      rating
      comment
      user {
        username
      }
    }
  }
}
```

### Mutations

#### 1. Register User
```graphql
mutation {
  register(
    username: "johndoe"
    email: "john@example.com"
    password: "password123"
  ) {
    token
    user {
      id
      username
      email
      role
    }
  }
}
```

#### 2. Login User
```graphql
mutation {
  login(
    email: "john@example.com"
    password: "password123"
  ) {
    token
    user {
      id
      username
      email
      role
    }
  }
}
```

#### 3. Add Book (Requires Authentication)
```graphql
mutation {
  addBook(
    title: "The Great Gatsby"
    author: "F. Scott Fitzgerald"
    description: "A classic American novel set in the Jazz Age"
  ) {
    id
    title
    author
    description
    addedBy {
      username
    }
  }
}
```

**HTTP Headers:**
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN_HERE"
}
```

#### 4. Add Review (Requires Authentication)
```graphql
mutation {
  addReview(
    bookId: "BOOK_ID_HERE"
    rating: 5
    comment: "Absolutely amazing book! A must-read classic."
  ) {
    id
    rating
    comment
    user {
      username
    }
    book {
      title
    }
  }
}
```

**HTTP Headers:**
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN_HERE"
}
```

#### 5. Delete Review (Requires Authentication - Admin or Owner)
```graphql
mutation {
  deleteReview(id: "REVIEW_ID_HERE")
}
```
#### 6. Update User Role (Admin only)
```graphql
mutation {
  updateUserRole(
    userId: "USER_ID_HERE"
    role: "admin"
  ) {
    id
    username
    email
    role
  }
}
```

**HTTP Headers:**
```json
{
  "Authorization": "Bearer ADMIN_JWT_TOKEN_HERE"
}
```

**HTTP Headers:**
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN_HERE"
}
```

## 🧪 Testing the API

### Step-by-Step Testing Guide

1. **Open GraphQL Playground:**
   - Navigate to http://localhost:4000/graphql in your browser

2. **Register a new user:**
   ```graphql
   mutation {
     register(
       username: "testuser"
       email: "test@example.com"
       password: "test123"
     ) {
       token
       user {
         id
         username
         role
       }
     }
   }
   ```
   **Save the token from the response!**

3. **Login (optional - to get a fresh token):**
   ```graphql
   mutation {
     login(
       email: "test@example.com"
       password: "test123"
     ) {
       token
       user {
         username
       }
     }
   }
   ```

4. **Add HTTP Headers for authenticated requests:**
   - Click on "HTTP HEADERS" at the bottom of the GraphQL Playground
   - Add:
     ```json
     {
       "Authorization": "Bearer YOUR_TOKEN_HERE"
     }
     ```

5. **Add a book:**
   ```graphql
   mutation {
   - First, update a user's role to "admin" (preferred: via an admin-only GraphQL mutation if your server exposes one; otherwise update directly in MongoDB).

     Example GraphQL mutation (if implemented on your server):

     ```graphql
     mutation {
       updateUserRole(
         userId: "USER_ID_HERE"
         role: "admin"
       ) {
         id
         username
         email
         role
       }
     }
     ```

     **HTTP Headers:**

     ```json
     {
       "Authorization": "Bearer ADMIN_JWT_TOKEN_HERE"
     }
     ```

     If your API doesn't expose such a mutation, run this MongoDB command in a mongo shell or via MongoDB Atlas to set the role directly:

     ```js
     db.users.updateOne(
       { _id: ObjectId("USER_ID_HERE") },
       { $set: { role: "admin" } }
     )
     ```
   - Then use the deleteReview mutation with the admin's token
       author: "George Orwell"
       description: "A dystopian social science fiction novel"
     ) {
       id
       title
       addedBy {
         username
       }
     }
   }
   ```
   **Save the book ID!**

6. **Add a review:**
   ```graphql
   mutation {
     addReview(
       bookId: "BOOK_ID_FROM_STEP_5"
       rating: 5
       comment: "A masterpiece of dystopian fiction!"
     ) {
       id
       rating
       comment
     }
   }
   ```

7. **Get all books with reviews:**
   ```graphql
   query {
     getBooks {
       title
       author
       addedBy {
         username
       }
       reviews {
         rating
         comment
         user {
           username
         }
       }
     }
   }
   ```

8. **Test admin functionality (Delete review):**
   - First, update a user's role to "admin" directly in MongoDB
   - Then use the deleteReview mutation with the admin's token

## 🔗 Data Relationships

### Entity Relationship Diagram

```
User (1) ──────── (M) Book
  │                     │
  │                     │
  │                     │
  └──────── (M) Review (M) ──┘

Legend:
- A User can add many Books
- A Book can have many Reviews
- A Review belongs to one User and one Book
- A User can write many Reviews
```

### Mongoose Schema Relationships

1. **User → Book:**
   - `Book.addedBy` references `User._id`

2. **User → Review:**
   - `Review.userId` references `User._id`

3. **Book → Review:**
   - `Review.bookId` references `Book._id`

## 🔐 Authentication

### JWT Token-based Authentication

1. **Token Generation:**
   - Upon successful registration or login, a JWT token is generated
   - Token contains: user ID, email, and role
   - Token expires in 7 days

2. **Token Usage:**
   - Include token in the Authorization header: `Bearer YOUR_TOKEN`
   - Token is verified in the Apollo Server context

3. **Protected Routes:**
   - `addBook` - Requires authentication
   - `addReview` - Requires authentication
   - `deleteReview` - Requires authentication (admin or review owner)

### Authorization Rules

| Mutation | User Role | Additional Conditions |
|----------|-----------|----------------------|
| `register` | None | - |
| `login` | None | - |
| `addBook` | user/admin | Must be authenticated |
| `addReview` | user/admin | Must be authenticated |
| `deleteReview` | admin | Can delete any review |
| `deleteReview` | user | Can only delete own reviews |

## 🔒 Security Features

- ✅ Password hashing using bcrypt (salt rounds: 10)
- ✅ JWT token-based authentication
- ✅ Role-based authorization
- ✅ Input validation for ratings (1-5)
- ✅ Protected mutations requiring authentication
- ✅ CSRF prevention enabled
- ✅ Unique email and username validation

## 📝 Error Handling

The API provides clear error messages:

- **UNAUTHENTICATED** - User not logged in or invalid token
- **FORBIDDEN** - User lacks permission for the action
- **BAD_USER_INPUT** - Invalid input data
- **INTERNAL_SERVER_ERROR** - Server-side errors

Example error response:
```json
{
  "errors": [
    {
      "message": "You must be logged in to add a book",
      "extensions": {
        "code": "UNAUTHENTICATED"
      }
    }
  ]
}
```

## 🎯 Project Requirements Checklist

### Setup & Tech Stack ✅
- ✅ Node.js with Express
- ✅ Apollo Server Express
- ✅ GraphQL
- ✅ MongoDB with Mongoose
- ✅ JWT Authentication
- ✅ bcrypt.js for password hashing
- ✅ .env for configuration

### User Module ✅
- ✅ Register with username, email, password
- ✅ Login and receive JWT token
- ✅ Passwords stored in hashed form
- ✅ User roles: `user` (default) and `admin`

### Book Module ✅
- ✅ Authenticated users can add books
- ✅ Books include title, author, description
- ✅ Books linked to user who added them (`addedBy`)

### Review Module ✅
- ✅ Authenticated users can add reviews
- ✅ Reviews include rating and comment
- ✅ Reviews belong to specific book and user
- ✅ Admins can delete any review

### GraphQL Schema ✅
**Queries:**
- ✅ `getBooks` - Returns list of all books with reviews
- ✅ `getBook(id: ID!)` - Returns single book with reviews

**Mutations:**
- ✅ `register(username, email, password)`
- ✅ `login(email, password)`
- ✅ `addBook(title, author, description)`
- ✅ `addReview(bookId, rating, comment)`
- ✅ `deleteReview(id)`

### Data Relationships ✅
- ✅ User can add many Books
- ✅ Book can have many Reviews
- ✅ Review belongs to both User and Book

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running (local or Atlas)
- Check MONGODB_URI in .env file
- Verify network access in MongoDB Atlas (whitelist IP)

### Authentication Issues
- Ensure Authorization header format: `Bearer TOKEN`
- Check if token has expired (7-day expiration)
- Verify JWT_SECRET matches between token generation and verification

### Common Errors
- **"User already exists"** - Email or username already registered
- **"Invalid credentials"** - Wrong email or password
- **"Book not found"** - Invalid book ID in addReview
- **"You are not authorized"** - Non-admin trying to delete others' reviews

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the error message and code
3. Verify authentication headers are correctly set
4. Ensure MongoDB connection is active

## 📄 License

ISC

---

**Built with ❤️ using Node.js and GraphQL**

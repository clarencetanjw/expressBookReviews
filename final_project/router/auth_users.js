const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const app = express();

// Middleware to log requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
  
  // Middleware to handle errors
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
  });

let users = [];

const isValid = (username)=> { 
    // Check if the username is valid (if required)
    if (!(username)) {
      return false;
    } else {
        return true;
    }
}

const authenticatedUser = (username, password) => {

    // Search for the user in the users array based on the provided username
    const user = users.find(user => user.username === username);

    // If the user is not found, return false
    if (!user) {
        return false;
    
    } else {
    // Check if the password matches the one stored for the user
    return user.password === password;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const {username, password} = req.body;
    const Atoken = jwt.sign({ username }, 'secret key', { expiresIn: '1h' });

    // Check if the username and password are provided
    if (!username || !password) {
        return res.status(400).json({message: "username & password are required"});
    }

    // Check if the username is valid
    if (!isValid(username)) {
        return res.status(400).json({message: "username is invalid"});
    }

     // Check if the username and password match
     if (!authenticatedUser(username, password)) {
        return res.status(400).json({message: "Invalid Credentials"});
     }
     
      // If the credentials are valid, generate a JWT token
      const token = jwd.sign({username}, "secret key");

      // Return the JWT token as the response
      return res.status(200).json({token});
});

// Add a book review
function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]; // Assuming token is sent in the Authorization header
    if (!token) return res.status(401).json({ message: 'Token not provided' });

    jwt.verify(token, 'secret key', (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid token' });
        req.user = decoded;
        next();
    });
}

regd_users.delete("/auth/review/:isbn", verifyToken, (req, res) => {
    const { isbn } = req.params;
    const username = req.user.username;

    // Check if the ISBN is valid
    if (!isbn) {
        return res.status(400).json({ message: "ISBN is required" });
    }

    // Check if the user has posted a review for the given ISBN
    if (!books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Review not found for the given ISBN and user" });
    }

    // Delete the review for the given ISBN and user
    delete books[isbn].reviews[username];

    return res.status(200).json({ message: "Review deleted successfully" });
});

regd_users.put("/auth/review/:isbn", verifyToken, (req, res) => {
    const {isbn} = req.params;
    const {review} = req.body;
    const username = req.user.username

     // Check if the ISBN is valid
     if (!isbn) {
        return res.status(400).json({Message: "ISBN is required"});
     }
    // Check if the review is provided
    if (!review) {
        return res.status(400).json({Message: "Review is required"});
    }

    // Check if the user has already posted a review for the given ISBN
    const existingReview = books[isbn].reviews[username];

    // If the user has already posted a review, update it
    if (existingReview) {
        books[isbn].reviews[username] = review;
        return res.status(200).json({Message: "Review updated successfully"});
    
    } else {
    // If the user has not posted a review, add a new review
    books[isbn].reviews[username] = review;
    return res.status(200).json({Message: "Review updated successfully"});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
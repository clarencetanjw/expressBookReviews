const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

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
regd_users.put("/auth/review/:isbn", (req, res) => {
    const {isbn} = req.params;
    const {review} = req.body;
    const username = req.user.username

     // Check if the ISBN is valid
     if (!isbn) {
        return res.status(400).json({Message: "ISBN is required"});
    
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

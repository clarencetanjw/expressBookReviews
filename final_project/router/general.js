const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    try {
    // Retrieve username and password from the request body
    const {username, password} = req.body;

     // Check if username and password are provided
     if (!username || !password) {
        return res.status(404).json({message: "Username and password are required"});
    }   
    
    // Check if the username already exists
    if (users.find(user=> user.username === username)) {
        return res.status(400).json({message: "User already exists"});
    }
      // If username is unique, create a new user object and add it to the users array
      const {newUser} = {username, password}
      users.push(newUser);

      // Return a success message
      return res.status(200).json({Message: "User Registered Successfully"});
    } catch (error) {
        console.error("Error registering user", error);
        return res.status(500).json({Message: "Internal Server Error"});
    }
  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  try {
    // Retrieve the list of books from the books database
    const bookList = Object.values(books);

     // Convert the book list to a JSON string with indentation for readability
     const formattedBookList = JSON.stringify(bookList, null, 2)

     // Return the formatted book list as a JSON response
     return res.status(200).json(formattedBookList);
  } catch (error){
     // Handle any errors that occur during the process
     console.error("Error retrieving book list:", error);
     return res.status(500).json({message: "Internal Server Error"});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
try {
    // Retrieve the ISBN from the request parameters
    const {isbn} = req.params;

    // Search for the book in the books database based on the ISBN
    const book = Object.values(books).find(book => book.isbn === isbn);

    // If the book is found, return its details as a JSON response
    if (book) {
        return res.status(200).json(book);
    } else {
        // If the book is not found, return a 404 Not Found response
        return res.status(404).json({message: "Book not Found"});
    } 
}catch (error) {
        // Handle any errors that occur during the process
        console.error("Error retrieving book details by isbn", error)
        return res.status(500).json({message: "Internal Server Error"})
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  try {
    // Retrieve the author from the request parameters
    const {author} = req.params;

    // Filter books based on the provided author
    const fAuthorBooks = Object.values(books).filter(book=> book.author === author)

    // If books are found for the author, return them as a JSON response
    if (fAuthorBooks.length > 0) {
        return res.status(200).json(fAuthorBooks);
    } else {
    // If no books are found for the author, return a 404 Not Found response
    return res.status(404).json({message: "No Books found by Author"});
    }
    } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error retrieving Books by Author", error);
    return res.status (500).json({message: "Internal Server Error"});
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  try {
    // Retrieve the author from the request parameters
    const {title} = req.params;

    // Filter books based on the provided title
    const fTitleBooks = Object.values(books).filter(book=> book.title === title)
    
    // If books are found for the author, return them as a JSON response
    if (fTitleBooks.length > 0) {
        return res.status(200).json(fTitleBooks);
        
    } else {
         // If no books are found for the author, return a 404 Not Found response
         return res.status(404).json({message: "No Books Founds by Title"});
        }
    } catch (error) {
        // Handle any errors that occur during the process
        console.error("Error retrieveing Books by Title", error);
        return res.status(500).json({message: "Internal Server Error"});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  try {
    // Retrieve the author from the request parameters
    const {review} = req.params;

    // Filter books based on the provided reviews
    const fReviewBooks = Object.values(books).filter(book=>book.review === review)

    // If books are found for the author, return them as a JSON response
    if (fReviewBooks.length>0) {
    return res.status(200).json(fReviewBooks);

    } else {
    // If no books are found for the author, return a 404 Not Found response
    return res.status(404).json({message: "No Books Found by Reviews"});
    }

    } catch (error) {
    //Handle any errors that occur during the process
    console.error("Error retrieving Book by Reviews", error);
    return res.status(500).json({Message: "Internal Server Error"});
    }
});

module.exports.general = public_users;

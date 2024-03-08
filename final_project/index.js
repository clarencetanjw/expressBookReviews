const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
const token = req.session.token
const secretKey = "your_secret_key"; // Replace with your actual secret key used for JWT

 // Check if a token exists in the session
 if (!token){
    return res.status(401).json({message: "Unauthorized: No Token Provided"});
 }
 try {
    // Verify the token using the secret key
    const decoded = jwt.verify (token,secretKey)

    // Attach the decoded user information to the request object
    req.user = decoded;
 
    // Proceed to the next middleware or route handler
    next();
 } catch(error) {
    // If token verification fails, return an error response
    return res.status(403).json({message: "Forbidden: Invalid Token"});
 }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));

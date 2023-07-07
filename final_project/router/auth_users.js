const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    //write code to check is the username is valid
    let user = users.filter(user => user.username === username);
    return user.length > 0;
}

const authenticatedUser = (username,password)=>{
    //write code to check if username and password match the one we have in records.
    let user = users.filter(u => u.username === username && u.passsword === password)
    return user.length > 0;

}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password) {
        return res.status(404).json({message: "Error log in"});
    }

    //let authenticatedUser
    if(authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
            }, 'access', {expiresIn: 60 * 60});
            req.session.authorization = {
                accessToken, username
            }
            return res.status(200).send("User successfully logged in");
        } else {
            return res.status(208).json({message: "Invalid login"})
        }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let filtered_book = books[isbn]
    if (filtered_book) {
        let review = req.query.review;
        let reviewer = req.session.authorization['username'];
        if(review) {
            filtered_book['reviews'][reviewer] = review;
            books[isbn] = filtered_book;
        }
        res.send(`The review for the book with ISBN  ${isbn} has been added/updated.`);
    }
    else{
        res.send("Unable to find this ISBN!");
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if(book){
        const user = req.session.authorization['username'];
        const review = book['reviews'][user];
        if(review) {
            delete review;
            res.send(`The review for the book with ISBN  ${isbn} has been deleted.`)
        }

        res.send(`No review found.`)
    }

}) 

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

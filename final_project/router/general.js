const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  const doesExist = users.filter(user => user.username === username)
  if(username && password){
      if(doesExist.length > 0){
          return res.status(404).json({ message: "User already exists" })
      } else {
          users.push({"username":username, "passsword":password});
          return res.status(200).json({message: "User successful registred"})
      }

  } 
  return res.status(404).json({message: "Unable to register user."});

});

/*
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});
*/

// Get the book list available in the shop with promises
public_users.get('/',function (req, res) {
    const getAvaliableBooks = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify(books, null, 4)));
    });
    getAvaliableBooks.then();

  });

/*
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  res.send(books[isbn]);
 });
 */

// Get book details based on ISBN with promises
public_users.get('/isbn/:isbn', function(req, res) {
    const getBookById = new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        resolve(res.send(books[isbn]));
    });
    getBookById.then();
})
  
/*
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let book = [];
  let i = 0
  for(id in books) {
      if (books[id]["author"] === author) {
          book[i] = books[id];
          i++;
      }
  }
  res.send(book)
});
*/

// Get book details based on author with promises
public_users.get('/author/:author', function(req, res) {
    const booksByAuthor = new Promise((resolve, reject) => {
        let author = req.params.author;
        let book = [];
        let i = 0
        for(id in books) {
            if (books[id]["author"] === author) {
                book[i] = books[id];
                i++;
            }
        }
        resolve(res.send(book))
    });

    booksByAuthor.then();
})

/*
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    let booksByTitle = [];
    let i = 0
    for(id in books) {
        if (books[id]["title"] === title) {
            booksByTitle[i] = books[id];
            i++;
        }
    }
    res.send(booksByTitle)
});
*/

// Get all books based on title with promises
public_users.get('/title/:title',function (req, res) {
        let title = req.params.title;
        let booksByTitle = [];
        let i = 0
        for(id in books) {
            if (books[id]["title"] === title) {
                booksByTitle[i] = books[id];
                i++;
            }
        }
    const booksDetails = new Promise((resolve, reject) => {
        resolve(res.send(booksByTitle));
    });
    booksDetails.then();
})

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]["reviews"]);
});

module.exports.general = public_users;


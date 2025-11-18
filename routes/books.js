// routes/books.js
const express = require("express");
const router = express.Router();

// search form
router.get('/search',function(req, res, next){
    res.render("search.ejs")
});

   //search results (partial match)
router.get('/search-result', function (req, res, next) {
    let keyword = req.query.keyword || "";
    let sqlquery = "SELECT * FROM books WHERE name LIKE ?";
    let searchTerm = '%${keyword}%';

    db.query(sqlquery,[searchTerm], (err,result)=> {
        if (err) return next(err);
        res.render("list.ejs",{availableBooks:result})
    });
});
 
// Full List
  router.get('/list', function(req, res, next) {
    db.query("SELECT * FROM books", (err,result)=> {
        if (err) return next(err);
        res.render("list.ejs",{availableBooks: result});
    });
  });

// Bargain books
  router.get('/bargainbooks', function(req, res, next) {
    db.query("SELECT * FROM books WHERE price <20", (err,result)=> {
        if (err) return next(err)
        res.render("list.ejs",{availableBooks: result}) 
    });
  });
    
// add book form
  router.get('/addbook', function(req, res, next) {
        res.render('addbook.ejs') 
    })

// handle add book submission
  router.post('/bookadded', function(req, res, next) {
    let sqlquery = "INSERT INTO Books (name,price) values (?,?)"
    let newrecord = [req.body.name,req.body.price];
    
    db.query(sqlquery,newrecord, (err,result)=> {
        if (err) return next(err);
        res.render("bookadded.ejs",{
            name: req.body.name,
            price: req.body.price
            });
        });
    });
 
  
// Export the router object 
module.exports = router

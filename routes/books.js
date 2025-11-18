// Create a new router
const { name } = require("ejs");
const express = require("express")
const router = express.Router()

router.get('/search',function(req, res, next){
    res.render("search.ejs")
});

   //search results (partial match)
router.get('/search-result', function (req, res, next) {
    let keyword = req.query.keyword || ''
    let sqlquery = "select from Books Where name like ?"
    let searchTerm = '%${keyword}'

    db.query(sqlquery,searchTerm, (err,result)=> {
        if (err) {next(err)}
        res.render("list.ejs",{availablebooks:result})
    })
})
 
// Full List
  router.get('/list', function(req, res, next) {
    db.query("select from books", (err,result)=> {
        if (err) {next(err)}
        res.render("list.ejs",{availablebooks: result}) 
    })
  })

// Bargain books
  router.get('/bargainbooks', function(req, res, next) {
    db.query("select from books", (err,result)=> {
        if (err) {next(err)}
        res.render("list.ejs",{availablebooks: result}) 
    })
  })
    
// add book form
  router.get('/addbook', function(req, res, next) {
        res.render('addbook.ejs') 
    })

// handle add book submission
  router.get('/bookadded', function(req, res, next) {
    let sqlquery = "insert into Books (name,price) values (?,?)"
    let newrecord = [req.body.name,req.body.price]
    
    db.query(sqlquery,newrecord, (err,result)=> {
        if (err) {next(err)}
        else {
        res.render("bookadded.ejs",{
            name: req.body.name,
            price: req.body.price
            })
        }
    })
  })
  
// Export the router object 
module.exports = router

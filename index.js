require('dotenv').config();
const { request, response } = require("express");
const express = require("express");
const mongoose = require('mongoose');
const Database  = require("./database");

//initialization
const ourAPP =express();

const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI,
).then(()=>console.log("connection established")).catch((err)=>{console.log(err)});

ourAPP.use(express.json()); 

ourAPP.get("/",(request,response)=>{

    response.json({message:"Request Served"});

});

ourAPP.get("/book",(req,res)=>{
    return res.json({books:Database.Book}); 
});

ourAPP.get("/hey",(req,res)=>{
    return res.json({books:Database.Book});
}); 

    ourAPP.get("/book/:bookID",(req,res)=>{
    const getBook =Database.Book.filter(
      (book)=> book.ISBN===req.params.bookID
    );
    return res.json({book:getBook})
}); 

ourAPP.post("/book/new",(request,response)=>{
    
    console.log(request.body);
    response.json({message:"book added successfully"});
})


ourAPP.get("/book/c/:category",(req,res)=>{
    const getBook =Database.Book.filter(
        (book)=> book.category.includes(req.params.category)
    );
    return res.json({book:getBook})

})

ourAPP.get("/book/a/:author",(req,res)=>{
    const getBook =Database.Book.filter(
        (book)=>book.authors.includes(req.params.author)
        );
            return res.json({book:getBook})
})

// route   /author/new
// Description add new author
// Access PUBLIC
// Parameter NONE
// METHOD NONE
ourAPP.post("/author/new",(req,res)=>{
        const {newAuthor}=req.body;
        console.log(newAuthor);

        res.json({message:"author is added "})
})

ourAPP.post("/publication/new",(req,res)=>{
    const publication =req.body;
    console.log(publication);
    return res.json({message:"book published "});
})


ourAPP.put("/book/update/:isbn",(req,res)=>{
    const {updatedBook} = req.body;
    const {isbn} = req.params;
const book = Database.Book.map((book)=>{
        if(book.ISBN===isbn){
            console.log({...book,...updatedBook});

        return {...book,...updatedBook};
    
    }
})
 return res.json(book);
});

ourAPP.put("/bookAuthor/update/:isbn",(req,res)=>{
    const {newAuthor}=req.body;
    const {isbn}=req.params;
Database.Book.map((book)=>{
    if(book.ISBN===isbn){
        if(!book.authors.includes(newAuthor)){
            return book.authors.push(newAuthor);
        }
        return book;
    }
    return book;

});
   Database.Author.forEach((author)=>{
       if(author.id===newAuthor){
           if(!author.books.includes(isbn)){
               return author.books.push(isbn);
           }
           return author;
       }
   
       return author;
   });
return res.json({book:Database.Book,author:Database.Author});
});

ourAPP.delete("/book/delete/:isbn",(req,res)=>{

    const {isbn} = req.params;

    const filteredbooks =Database.Book.filter((book)=>book.ISBN !== isbn);
        
    Database.Book = filteredbooks;
    
    return res.json(Database.Book);
});

ourAPP.delete("/book/delete/author/:isbn/:id",(req,res)=>{

    const {isbn,id} = req.params;
    Database.Book.forEach((book)=>{
        if(book.ISBN==isbn){
            if(!book.authors.includes(parseInt(id))){

                return book;
            }
            book.authors = book.authors.filter((databaseid)=> databaseid !== parseInt(id))
            return book;
        }
        return book;
    })

    Database.Author.forEach((author)=>{
        if(author.id === parseInt(id)){
            if(!author.books.includes(isbn)){
                return author;
            }
            author.books =author.books.filter((book)=> book!==isbn);
            return author;
        }
        return res.json({book:Database.Book,author:Database.author});
    })

});
ourAPP.listen(4000,()=>console.log("server is running"));

const { response, request } = require("express");
const express = require("express");
const Database = require("./database");
const ourAPP = express();


ourAPP.get("/",(request,response)=>{

    response.json({message:"Request Served"});

});

ourAPP.get("/book",(request,response)=>{
    return response.json({books:Database.Book});
})
ourAPP.post("/book/new",(request,response)=>{
    
    console.log(request.body);
    response.json({message:"book added successfully"});
})


ourAPP.listen(3000,()=>console.log("server"));
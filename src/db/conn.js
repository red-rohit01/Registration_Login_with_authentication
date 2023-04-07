const mongoose=require("mongoose");

const dblink=process.env.DATABASE
mongoose.connect(dblink)
.then( () =>
{
    console.log("connection is successful");
})
.catch((e)=>
{
    console.log(e);
})

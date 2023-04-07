const mongoose=require("mongoose");

const dblink=process.env.DATABASE
//mongodb+srv://rohitbaba:<password>@cluster0.tdagoip.mongodb.net/?retryWrites=true&w=majority
mongoose.connect(dblink)
.then( () =>
{
    console.log("connection is successful");
})
.catch((e)=>
{
    console.log(e);
})

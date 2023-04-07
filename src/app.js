require('dotenv').config();
const express=require("express");
const app=express();
const path=require("path");
require("./db/conn");
const port = process.env.PORT || 8000;
const hbs=require("hbs");
const bcrypt =require("bcrypt");
const Register = require("./models/registers");
const cookieParser = require("cookie-parser");
const auth=require("./middleware/auth")

const static_path=path.join(__dirname, "../public");
const template_path=path.join(__dirname, "../templates/views");
const partial_path=path.join(__dirname, "../templates/partials");

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views",template_path);
hbs.registerPartials(partial_path);

//console.log(process.env.SECRET_KEY);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended : false}));

app.get("/",(req,res)=>{
    //res.redirect("https://www.google.com");
    res.render("index");
})

app.get("/secret", auth , (req,res)=>{
    // console.log(`The cookie generated on secret page is ${req.cookies.jwt}`);
    res.redirect("https://red-rohit01.github.io/first_react_app/");
})

app.get("/logout", auth , async(req,res)=>{
     try {
        req.user.tokens= req.user.tokens.filter((curr)=>
        {
            return curr.token != req.token;
        })

        //logout from all the devices
        //req.user.tokens=[];

        res.clearCookie("jwt");

        await req.user.save();
        res.render("index");

     } catch (error) {
        res.status(501).send("It's Us not You.We are working to resolve it at earliest");
     }
})


app.get("/contact",(req,res)=>{
    res.render("contact");
})
app.get("/login",(req,res)=>{
    res.render("index");
})

app.get("/register",(req,res)=>{
    res.render("register");
})

app.post("/register", async (req,res)=>{
    try
    {
         const pwd=req.body.password;
         const cpwd = req.body.confirm_password;

         if(pwd == cpwd)
         {

            const registerEmployee = new Register({
                full_name : req.body.full_name,
                username : req.body.username,
                email : req.body.email,
                phone : req.body.phone,
                password : req.body.password,
                confirm_password : req.body.confirm_password,
                gender : req.body.gender
            })

            const token=await registerEmployee.generateAuthToken();

            res.cookie("jwt",token,{
                expires : new Date(Date.now()+ 30000),
                httpOnly : true                            // Cookies will be valid only for 30 sec after
            });                                            // its creation and setting httpOnly: true makes only
                                                          // client to delete it.server will have no access.
            const registered = await registerEmployee.save();
            //const registered = await Register.create(registerEmployee);
            //const registered= await Register.insertMany([registerEmployee]);
            res.status(200).render("index");

         }
         else{
            res.status(400).send("Passwords are not Matching");
         }

    }
    catch(e){
        res.status(408).send();
    }
})

// login validation

app.post("/login", async(req,res)=>{
    try{
        const email=req.body.email;
        const pwd=req.body.password;

        const useremail= await Register.findOne({email : email});

        const ismatch= await bcrypt.compare(pwd,useremail.password);

        const token=await useremail.generateAuthToken();

        res.cookie("jwt",token,{
            expires : new Date (Date.now()+ 50000),                   // 25892000000ms== 30days
            httpOnly : true,
            //secure : true                                // Cookies will be saved only on the secure connections i.e., https
        });

        if(ismatch)
        {
            res.status(201).render("secret");
        }
        else 
        {
            res.send("Invalid LogIn details");
        }
    }
    catch(e)
    {
        res.status(400).send("Invalid Credentials");
    }
})

//Bcrypt is one way communication i.e., It can only be encoded and can not be decoded in the original value.

// const bcrypt=require("bcrypt")
// const securePassword = async(password)=>{

//     const hashpassword= await bcrypt.hash(password,10);

//     const passwordmatch = await bcrypt.compare(password,hashpassword);

// }
// securePassword("pass@123");

//  JSON WebToken:

// const jwt=require("jsonwebtoken");
// const createToken = async()=>{
//     const token = await jwt.sign({id: "5treuretweriwerjwe"},process.env.SECRET_KEY,
//     {expiresIn : "2 minutes"}
//     );

//     const userverification = await jwt.verify(token, process.env.SECRET_KEY);
// }
// createToken();

app.listen(port,()=>
{
    console.log(`port is listening at ${port}`);
})

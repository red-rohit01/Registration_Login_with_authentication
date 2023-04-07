const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

const employeeSchema =new mongoose.Schema({
    full_name : {
        type : String,
        required : true
    },
    username :{
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    phone : {
        type : Number,
        unique : true,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    confirm_password : {
        type : String,
        required : true
    },
    gender : {
        type : String,
        required : true
    },
    tokens : [{                                   // we are creating array of objects because a user will login a
        token : {                                 // lot more times and each time a new token is generated.so,
            type : String,                        // we have created an array of object
            required : true
        }
    }]

});

employeeSchema.methods.generateAuthToken = async function(){
    try{
        const token = await jwt.sign({_id:this._id },process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token : token});
        await this.save();
        return token;
    }
    catch(error){
        console.log(error);
        res.send("the error part is " + error);
    }
};

employeeSchema.pre("save",async function(next){

    if(this.isModified("password"))
    {
        this.password= await bcrypt.hash(this.password , 10);
        this.confirm_password= await bcrypt.hash(this.password , 10);
    }
    next();
})

const Register = new mongoose.model("Register",employeeSchema);

module.exports = Register;
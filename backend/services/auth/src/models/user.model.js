import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        unique:[true,"username already exist"],
        required:true
    },
    email:{
        type:String,
        unique:[true,"Account already exists with this email address"],
        required:true
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    profileImg:{
        type:String
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    bio:{
        type:String,
        default:""
    }
},{timestamps:true});

const userModel = mongoose.model("User",userSchema);

export default userModel;


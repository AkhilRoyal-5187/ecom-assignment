// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//     name: {type : String, required : true},
//     email:{type : String, required : true, unique : true},
//     password : {type : String, required : true},
//     age : {type : Number, required : true},
//     createdAt : {type : Date, default : Date.now}
// })

// const user = mongoose.model('user',userSchema)
// export default user;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  role : {type : String, enum : ['admin', 'user'], default : 'user'},
  createdAt: { type: Date, default: Date.now },
});

const user = mongoose.model("user", userSchema);

export default user;


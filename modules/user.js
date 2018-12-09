const mongoose =  require ('mongoose');

//userscheema

const UserSchema = mongoose.Schema({
   name:{
       type: String,
       required:true
   },
   email:{
    type: String,
    required:true
   },
   username:{
    type: String,
    required:true
   },
   password:{
    type:String,
    required:true
    },
    role:{
        type:String,
        required:true,
        default:'user'
    }
});


const User = module.exports = mongoose.model('User',UserSchema);

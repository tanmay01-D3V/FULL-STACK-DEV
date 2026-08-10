const mongooes=require('mongoose');
const employeeSchema=new mongooes.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:String,
        required:true
    },
    position:{
        type:String,
        required:true
    },
    salary:{
        type:Number,
        required:true
    }
});

const Employee=mongooes.model('Employee',employeeSchema);
module.exports=Employee;
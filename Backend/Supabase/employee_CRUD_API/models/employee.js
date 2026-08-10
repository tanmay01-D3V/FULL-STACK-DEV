const supabase = require('../config/db');

class Employee {
    async findAll(){
        const {data, error}= await Supabase.from('employee').select('*');
        if (error){
            throw new Error("Something went wrong while fetching employees");
        }
        return data;
    }
}
const db = require('../config/db');

class Employee {
    static async find(){
        const snapshot = await db.collection('employees').get();
        if (snapshot.empty){
            return [];
        }
        const employees = [];
        snapshot.forEach((doc) => {
            employees.push({
                id:doc.id,
                ...doc.data()
            })
        });
        return employees;
    }
    static async findById(id){
        const docref = db.collection('employees').doc(id);
        const doc = await docref.get();
        if(!doc.exists){
            return null;
        }
        return {id:doc.id, ...doc.data()};
    }

    static async create(employee){
        const docref = await db.collection('employees').add(employee);
        const doc = await docref.get();
        if(!doc.exists){
            return null;
        }
        return {id:doc.id,...doc.data()};
    }

    static async findByIdAndUpdate(id,employee){
        const docref = db.collection('employees').doc(id);
        const doc = await docref.get();
        if(!doc.exists){
            return null;
        }
        await docref.update(employee);
        const updatedEmployeeData = await docref.get();
        return {
            id:updatedEmployeeData.id,...updatedEmployeeData.data()
        };
    }

    static async findByIdAndDelete(id,employee){
        const docref = db.collection('employees').doc(id);
        const doc = await docref.get();
        if(!doc.exists){
            return null;
        }
        await docref.delete();
        return {id:doc.id,...doc.data()};      
    }
}

module.exports = Employee;
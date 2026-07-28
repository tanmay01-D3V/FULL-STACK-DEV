class ProgrammingClass {
    constructor(){
        this.id="";
        this.name="";
        this.course="";
    }

    setId(id){
        this.id=id;
    }

    setName(name){
        this.name=name;
    }

    setCourse(course){
        this.course=course;
    }

    getId(){
        return this.id;
    }

    getName(){
        return this.name;
    }

    getCourse(){
        return this.course;
    }
}

p1=new ProgrammingClass();

// p1.id="101";
// p1.name="JavaScript";
// p1.course="OOP's";

// console.log(p1.id,p1.name, p1.course);

p1.setId("404");    
p1.setName("Rizwan");
p1.setCourse("Bombing the Bombers");

console.log(p1.getId(),p1.getName(), p1.getCourse());
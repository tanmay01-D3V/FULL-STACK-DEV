// let person = {
//     name: "Tanmay",
//     age: "19",
//     city: "Thane",
// };

// console.log("\n" + person.name + " is resident of " + person.city + "\n")

// // let book = {
// //     title: ["square", "Java", "xyz"],
// //     author: ["Tanmay","Daksh", "Apj abdul kalam"],
// //     price: ["18000","120","10M"],
// // }

// // document.write(book.title[1]);

// let car = {
//     brand: "Audi",
//     model: "Audi R8",
//     year: 2023,
// }

// for (let key in car){
// console.log(key + " : " + car[key])
// }

// let student = [
//     {name: "Tanmay", marks: "89"},
//     {name: "Saad", marks: "39"},
//     {name: "Daksh", marks: "60"}
// ]

// for (let i=0;i<student.length;i++){
//     if (student[i].marks<=55) {
//     console.log("\n" + student[i].name + " has failed the exam" + "\n");
// }
// else{
//     console.log( student[i].name + " has passed the exam" + "\n")
// }
// }

// let students = [
//     ["Tanmay", 67, 40, 85],
//     ["Saad", 56, 72, 50],
//     ["Daksh", 95, 40, 78],
// ];

// let totalMath = 0;
// let totalScience = 0;
// let totalEnglish = 0;

// for (let i = 0; i < students.length; i++) {
//     totalMath += students[i][1];
//     totalScience += students[i][2];
//     totalEnglish += students[i][3];
// }

// console.log("Total Math Marks:", totalMath);
// console.log("Total Science Marks:", totalScience);
// console.log("Total English Marks:", totalEnglish);

// let studentsString = JSON.stringify(students);
// console.log("\n"+studentsString);


let original = [10,20,45];
let copy = [...original]

copy.push(40);

console.log(original);
console.log(copy); 
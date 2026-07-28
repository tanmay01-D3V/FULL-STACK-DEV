function fetchdata(){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let data = "Server data fetched successfully!";
            if(data){
                resolve(data);
            }
            else{
                reject("Data is undefined!");
            }
        }, 5000);
    });
}

fetchdata()
.then((data) => {
console.log(data);
})
.catch((error) => {
console.error(error);
});

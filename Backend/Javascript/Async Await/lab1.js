function fetchData(url) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let data = `Data fetched from successfully!`;
            if (data) {
                resolve(data);
            } else {
                reject("Data is undefined!");
            }
        }, 3000);
    });
}
async function getData() {
    try {
        const data = await fetchData();
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}
getData();
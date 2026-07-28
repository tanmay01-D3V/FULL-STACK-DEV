function task1() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("Task 1 completed");
            resolve();
        }, 1000);
    });
}   

function task2() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("Task 2 completed");
            resolve();
        }, 2000);
    });
}

function task3() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("Task 3 completed");
            resolve();
        }, 1500);
    });
}

async function executeTasks() {
    try {
        await task1();
        promise.all([task2(),task3()])
    } catch (error) {
        console.error(error);
    }
}
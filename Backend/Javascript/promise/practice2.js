function task1() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Task 1 completed!");
      resolve();
    }, 3000);
  });
}

function task2() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Task 2 completed!");
      resolve();
    }, 3000);
  });
}

function task3() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Task 3 completed!");
      resolve();
    }, 3000);
  });
}

task1()
  .then(() => {
    return task2();
  })
  .then(() => {
    return task3();
  })
  .then(() => {
    console.log("All tasks completed!");
  })
  .catch((error) => {
    console.error(error);
  });

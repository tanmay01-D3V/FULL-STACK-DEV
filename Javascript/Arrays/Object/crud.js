let tasks = [
    { id: 1, text: 'Buy coffee', completed: false },
    { id: 2, text: 'Write code', completed: true },
];

const newTask = { id: 3, text: 'Debug CSS', completed: false };
tasks = [...tasks, newTask];

const deleteTask = (id) => {
    tasks = tasks.filter(task => task.id !== id);
};

deleteTask(2);
console.log(tasks);

const cart = [
    {name: 'Laptop', price: 1200, qty: 1},
    {name: 'Mouse', price: 50, qty: 2},
    {name: 'Laptop', price: 12, qty: 1},
];
const total = cart.reduce((acc,items) => acc + (items.price * items.qty), 0);

const hasMouse = cart.some(items => items.name === 'Mouse');

const parseInput = (input) => {
    return input.split(",")
        .map((num) => Number(num.trim()))
        .filter(num => !isNaN(num));
};

const union = (arr1, arr2) => {
    return Array.from(new Set([...arr1, ...arr2]));
};

const intersection = (arr1, arr2) => {
    return arr1.filter(num => arr2.includes(num));
};

const difference = (arr1, arr2) => {
    return arr1.filter(num => !arr2.includes(num));
};

document.getElementById("calculate").addEventListener("click", () => {
    const inputA = document.getElementById("setA").value;
    const inputB = document.getElementById("setB").value;
    const operation = document.getElementById("operation").value;

    const setA = parseInput(inputA);
    const setB = parseInput(inputB);

    let result = [];

    if (operation === "union") {
        result = union(setA, setB);
    } else if (operation === "intersection") {
        result = intersection(setA, setB);
    } else if (operation === "difference") {
        result = difference(setA, setB);
    }

    document.getElementById("result").innerHTML = `operation: ${operation.toUpperCase()}<br>result: ${result.join(", ")}`;
});
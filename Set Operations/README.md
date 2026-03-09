# Mathematical Set Operations Library

A simple and interactive web application to perform mathematical set operations on arrays. This project demonstrates fundamental concepts of set theory through an easy-to-use interface.

## 📋 Features

- **Union Operation**: Combines two sets and removes duplicates to get all unique elements
- **Intersection Operation**: Finds common elements between two sets
- **Difference Operation**: Returns elements from the first set that are not in the second set
- **User-Friendly Interface**: Clean and simple UI for easy interaction
- **Real-time Calculation**: Instantly computes results based on user input

## 🌐 Live Demo

🚀 **[View Live Deployment](https://full-stack-dev-woad.vercel.app)**

## 🛠️ Technologies Used

- **HTML5**: Structure and markup
- **CSS3**: Styling and layout
- **JavaScript (ES6+)**: Set operations logic and DOM manipulation

## 📦 Project Structure

```
Set Operations/
├── index.html          # Main HTML file
├── style.css           # Styling and responsive design
├── script.js           # Set operations logic
├── assets/             # Additional assets
└── README.md           # Project documentation
```

## 🚀 How to Use

1. Enter numbers for **Array A** separated by commas (e.g., `1, 2, 3, 4`)
2. Enter numbers for **Array B** separated by commas (e.g., `3, 4, 5, 6`)
3. Select an operation from the dropdown:
   - **Union**: All unique elements from both sets
   - **Intersection**: Only common elements
   - **Difference**: Elements in A but not in B
4. Click **Execute** to calculate the result
5. View the result displayed below

## 📝 Examples

### Union
- Array A: `1, 2, 3`
- Array B: `3, 4, 5`
- Result: `1, 2, 3, 4, 5`

### Intersection
- Array A: `1, 2, 3`
- Array B: `2, 3, 4`
- Result: `2, 3`

### Difference
- Array A: `1, 2, 3, 4`
- Array B: `3, 4`
- Result: `1, 2`

## 💻 Available Functions

### `parseInput(input)`
Parses comma-separated input string into an array of numbers.

### `union(arr1, arr2)`
Returns an array containing all unique elements from both arrays.

### `intersection(arr1, arr2)`
Returns an array containing only the elements present in both arrays.

### `difference(arr1, arr2)`
Returns an array containing elements from arr1 that are not in arr2.

## 🎨 Styling Features

- Responsive design that works on desktop and mobile devices
- Custom styled input fields with placeholders
- Interactive buttons and dropdown menus
- Clear and readable result display

## 📚 Learning Outcomes

This project demonstrates:
- Fundamental set theory concepts
- Array manipulation in JavaScript
- Set object usage for removing duplicates
- Filter and map array methods
- Event handling with DOM
- Form input processing

## 🔗 References

- [Set Operations in Mathematics](https://www.mathsisfun.com/sets/set-operations.html)
- [JavaScript Set Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
- [Array Methods Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

## 👤 Author

**Tanmay V**

## 📄 License

This project is open source and available for educational purposes.

## 🚀 Deployment

This project is deployed on [Vercel](https://vercel.com). Access it at:
**[https://full-stack-dev-woad.vercel.app](https://full-stack-dev-woad.vercel.app)**

---

**Happy Computing! 🎉**

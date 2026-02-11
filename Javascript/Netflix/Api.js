fetch("https://zenquotes.io/api/quotes")
.then (response => response.json())
.then (data => {console.log("Fetched Quote: ", data[0].a)});



export async function fetchQuotes() {
    const response = await fetch("https://zenquotes.io/api/quotes")
    const data = await response.json();
    console.log("Fetched Quotes: ", data);
}

fetchQuotes();

function search(event) {
            event.preventDefault();
            const query = document.getElementById("query").value;
            alert("You searched for: " + query);
        }
const buyBtn = document.getElementById('buy-btn');

buyBtn.addEventListener('click', () => {
    // Get all checked checkboxes
    const selectedOptions = document.querySelectorAll('input[name="beverage"]:checked');

    if (selectedOptions.length > 0) {
        let itemsList = '';
        let totalPrice = 0;

        selectedOptions.forEach((option) => {
            const name = option.getAttribute('data-name');
            const price = parseFloat(option.getAttribute('data-price'));

            itemsList += `- ${name}\n`;
            totalPrice += price;
        });

        // Alert with summary
        alert(`You selected:\n${itemsList}\nTotal Price: ₹${totalPrice}`);
    } else {
        alert('Please select at least one item!');
    }
});

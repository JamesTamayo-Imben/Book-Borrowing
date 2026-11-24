    // Function to fetch total and available stock from the PHP script
    function getTotalStock() {
        fetch('gPSYStock.php') // Replace with your PHP file path
            .then(response => response.json())  // Parse the JSON response
            .then(data => {
                if (data.total !== undefined && data.available !== undefined) {
                    const totalStock = data.total;  // Total number of books
                    const availableBooks = data.available;  // Available number of books
    
                    // Calculate percentages
                    const availablePercentage = Math.round((availableBooks / totalStock) * 100);
                    // const borrowedPercentage = 100 - availablePercentage;
    
                    // Update the HTML with the calculated values
                    document.getElementById('PSYPercentage').textContent = `${availablePercentage}%`;
                    // document.getElementById('borrowedPercentage').textContent = `${borrowedPercentage}%`;
    
                    // Optionally, you can also adjust the height of the rows to reflect the percentage visually
                    document.getElementById('PSYRow').style.height = `${availablePercentage}%`;
                    // document.getElementById('borrowedRow').style.height = `${borrowedPercentage}%`;
                } else {
                    console.error("Error: Total or Available stock not found in response");
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                document.getElementById('PSYPercentage').textContent = 'Error';
                document.getElementById('PSYRow').textContent = 'Error';
            });
    }
    
    // Call the function to get the total stock and update the page
    getTotalStock();
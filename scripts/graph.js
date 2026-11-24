var initrylng = (function() {
    // Predefined category-to-color mapping
    const categoryColors = {
        "CE Books": "rgb(0, 140, 255)", 
        "IS Books": "rgb(6, 214, 16)", 
        "MW Books": "rgb(247, 35, 247)",          
        "NS Books": "rgb(250, 175, 237)",            
        "PSYCH Books": "rgb(236, 236, 236)"
    };

    var trylng = function() {
        fetch('piegraph.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const labels = data.map(item => item.category); // Extract categories
                const values = data.map(item => item.borrowed); // Extract borrowed counts

                // Get colors for each category
                const backgroundColors = labels.map(label => categoryColors[label] || 'rgb(200, 200, 200)');

                // Data for the pie chart
                const chartData = {
                    labels: labels,
                    datasets: [{
                        data: values,
                        backgroundColor: backgroundColors,
                        hoverBackgroundColor: backgroundColors.map(color => color.replace('rgb', 'rgba').replace(')', ', 0.8)')),
                        borderColor: '#bbb',
                        borderWidth: 0.9,
                        hoverOffset: 20
                    }]
                };

                // Chart configuration
                const config = {
                    type: 'pie',
                    data: chartData,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                                labels: {
                                    color: '#333',
                                    font: {
                                        size: 14
                                    }
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(tooltipItem) {
                                        const value = tooltipItem.raw;
                                        const total = values.reduce((acc, val) => acc + val, 0);
                                        const percentage = ((value / total) * 100).toFixed(2);
                                        return `${tooltipItem.label}: ${value} books (${percentage}%)`;
                                    }
                                }
                            },
                            title: {
                                display: true,
                                text: 'Books Borrowed by Category',
                                font: {
                                    size: 18,
                                    weight: 'bold'
                                },
                                color: '#555'
                            }
                        },
                        animation: {
                            animateScale: true,
                            animateRotate: true
                        }
                    }
                };

                // Render the chart
                const ctx = document.getElementById('pieChart').getContext('2d');
                if (window.chartInstance) {
                    window.chartInstance.destroy();  // Destroy previous chart instance
                }
                window.chartInstance = new Chart(ctx, config); // Create a new chart instance
            })
            .catch(error => console.error('Error fetching data:', error));
    };

    return {
        init: function() {
            trylng(); // Load books on initialization
            // Reload data when navigation items are clicked
            $(".nav-link").on("click", function() {
                trylng(); // Reload data
            });
        }
    };
})();
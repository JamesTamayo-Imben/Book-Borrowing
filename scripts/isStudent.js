// Function to fetch and display the percentage of IMACS students
function getStudentPercentage() {
    fetch('isStudent.php') // Replace with the actual path to your PHP file
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
            if (data.studentCount !== undefined && data.totalStudents !== undefined) {
                const studentCount = data.studentCount; // IMACS student count
                const totalStudents = data.totalStudents; // Total registered students

                // Calculate percentage
                const percentage = Math.round((studentCount / totalStudents) * 100);

                // Update the row height
                const row = document.getElementById('isStudent');
                row.style.height = `${percentage}%`;

                // Update the percentage display
                document.getElementById('isPercentage').textContent = `${percentage}%`;
            } else {
                console.error("Error: Data not found in response");
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Call the function to fetch and update the graph
getStudentPercentage();

<?php
// class Config {
//     public $conn;

//     public function __construct() {
//         $this->conn = new mysqli("localhost", "root", "", "borrowing_system");

//         if ($this->conn->connect_error) {
//             die("Connection failed: " . $this->conn->connect_error);
//         }
//     }
// }

class Config {
    public $conn;

    public function __construct() {
        // Database connection parameters
        $host = '127.0.0.1';
        $username = 'root'; // Replace with your DB username
        $password = ''; // Replace with your DB password
        $dbname = 'borrowing_system'; // Replace with your database name

        // Create a new mysqli connection
        $this->conn = new mysqli($host, $username, $password, $dbname);

        // Check for connection errors
        if ($this->conn->connect_error) {
            die('Connection failed: ' . $this->conn->connect_error);
        }
    }
}

// Create the connection instance
$config = new Config();
?>

<?php
session_start();
require 'dbconn.php';

class LoginStudent {

    public function checkUser($username) {
        error_reporting(E_ERROR);
        $config = new Config();
        $response = array();
        $conn = $config->conn;

        if ($conn->connect_error) {
            return $conn->connect_error;
        } else {
            $query = 'SELECT username from loginUsers where username = ?';
            
            if ($stmt = $conn->prepare($query)) {
                $stmt->bind_param('s', $username);
                
                if ($stmt->execute()) {
                    $stmt->bind_result($username);
                    $stmt->store_result();
                    
                    if ($stmt->num_rows > 0) {
                        return 'USER_FOUND';
                    } else {
                        return 'USER_NOT_FOUND';
                    }
                    $stmt->close();
                } else {
                    return $stmt->error;
                }
            } else {
                return $conn->error;
            }
            $conn->close();
        }
    }

    public function getHashPassword($username) {
        error_reporting(E_ERROR);
        $config = new Config();
        $response = array();
        $conn = $config->conn;

        if ($conn->connect_error) {
            return  $conn->connect_error;
        } else {
            $query = 'SELECT password from loginUsers where username = ?';
            
            if ($stmt = $conn->prepare($query)) {
                $stmt->bind_param('s', $username);
                
                if ($stmt->execute()) {
                    $stmt->bind_result($password);
                    $stmt->store_result();
                    
                    if ($stmt->num_rows > 0) {
                        while ($stmt->fetch()) {
                            return $password;
                        }
                    } 
                    $stmt->close();
                } else {
                    return $stmt->error;
                }
            } else {
                return $conn->error;
            }
            $conn->close();
        } 
    }

    public function verifyInput($password, $hashpassword) {
        return password_verify($password, $hashpassword);
    }

    public function doLogin($username, $password) {
        $app = new LoginStudent();
        $response = array();
        $checkUser = $app->checkUser($username);

        if ($checkUser == 'USER_FOUND') {
            $hashpassword = $app->getHashPassword($username);
            $verifyPassword = $app->verifyInput($password, $hashpassword);

            if ($verifyPassword) {
                // Fetch the user's details
                $config = new Config();
                $conn = $config->conn;
                $query = 'SELECT role, studentID, email, lastName, middleName, firstName, birthdate, age, gender, contactNumber, institution, province, city, barangay, blkLot FROM loginUsers WHERE username = ?';
                $stmt = $conn->prepare($query);
                $stmt->bind_param('s', $username);

                if ($stmt->execute()) {
                    // Bind all the result variables
                    $stmt->bind_result($role, $studentID, $email, $lastName, $middleName, $firstName, $birthdate, $age, $gender, $contactNumber, $institution, $province, $city, $barangay, $blkLot);
                    $stmt->fetch();
                    $stmt->close();

                    // Store session variables
                    $_SESSION['username'] = $username;
                    $_SESSION['studentID'] = $studentID;
                    $_SESSION['email'] = $email;
                    $_SESSION['role'] = $role;
                    $_SESSION['lastName'] = $lastName;
                    $_SESSION['middleName'] = $middleName;
                    $_SESSION['firstName'] = $firstName;
                    $_SESSION['birthdate'] = $birthdate;
                    $_SESSION['age'] = $age;
                    $_SESSION['gender'] = $gender;
                    $_SESSION['contactNumber'] = $contactNumber;
                    $_SESSION['institution'] = $institution;
                    $_SESSION['province'] = $province;
                    $_SESSION['city'] = $city;
                    $_SESSION['barangay'] = $barangay;
                    $_SESSION['blkLot'] = $blkLot;

                    // Return successful response
                    $response['isSuccess'] = true;
                    $response['value'] = 1;
                    $response['msg'] = 'Login Successful';
                    $response['role'] = $role;
                    $response['studentID'] = $studentID;
                    $response['email'] = $email;
                } else {
                    $response['isSuccess'] = false;
                    $response['value'] = 0;
                    $response['msg'] = 'Error fetching user details from the database.';
                }
            } else {
                $response['isSuccess'] = false;
                $response['value'] = 0;
                $response['msg'] = 'Invalid password.';
            }
        } else if ($checkUser == 'USER_NOT_FOUND') {
            $response['isSuccess'] = false;
            $response['value'] = 0;
            $response['msg'] = 'User not found.';
        } else {
            $response['isSuccess'] = false;
            $response['value'] = 0;
            $response['msg'] = $checkUser;
        }

        return json_encode($response);
    }
}

$app = new LoginStudent();

if (isset($_REQUEST['action'])) {
    if ($_REQUEST['action'] == 'isLogin') {
        $username = $_REQUEST['username'];
        $password = $_REQUEST['password'];
        $response =  $app->doLogin($username, $password);
        echo $response;
        $decode_response = json_decode($response);

        if ($decode_response->isSuccess) {
            $_SESSION['username'] = $username;
        }
    }
} else {
    echo 'ERROR: No direct access';
}
?>
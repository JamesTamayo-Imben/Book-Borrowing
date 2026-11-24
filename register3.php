<?php
session_start();
require 'dbconn.php';

class RegisterUsers {

    public function savePersonalInfoko($lname, $mname, $fname, $bday, $age, $gender, $connum, $email, $insti, $student, $province, $city, $brgy, $blk) {
        error_reporting(E_ERROR);
        $config = new Config();
        $response = array();

        $conn = $config->conn;

        if($conn->connect_error) {
            return $conn->connect_error;
        }

        // Begin transaction
        $conn->begin_transaction();

        try {
            // Insert into the student table
            $queryStudent = 'INSERT INTO student (lastName, middleName, firstName, birthdate, age, gender, contactNumber, email, institution, studentID, province, city, barangay, blkLot) 
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            if ($stmtStudent = $conn->prepare($queryStudent)) {
                $stmtStudent->bind_param(
                    'ssssssssssssss',
                    $lname, $mname, $fname, $bday, $age, $gender, $connum, $email, $insti, $student, $province, $city, $brgy, $blk
                );
                $stmtStudent->execute();
                $stmtStudent->close();
            } else {
                throw new Exception('Error preparing student query: ' . $conn->error);
            }



//pang fwetch galing sa student papuntang user

//             $ry = "SELECT lastName, middleName, firstName, birthdate, age, gender, contactNumber, email, institution, studentID, province, city, barangay, blkLot FROM student";
// $sult = $conn->query($ry);

// // Check if query execution is successful
// if ($sult === false) {
//     throw new Exception('Error executing SELECT query: ' . $conn->error);
// }

// // Process each row from the result set
// while ($row = $sult->fetch_assoc()) {
//     $lastName = $row['lastName'];
//     $middleName = $row['middleName'];
//     $firstName = $row['firstName'];
//     $birthdate = $row['birthdate'];
//     $age = $row['age'];
//     $gender = $row['gender'];
//     $contactNumber = $row['contactNumber'];
//     $email = $row['email'];
//     $institution = $row['institution'];
//     $studentID = $row['studentID'];
//     $province = $row['province'];
//     $city = $row['city'];
//     $barangay = $row['barangay'];
//     $blkLot = $row['blkLot'];

//     // Insert into the users table
//     $userType = "user";
//     $hashedPassword = password_hash($studentID, PASSWORD_DEFAULT); // Using hashed studentID as password

//     $queryUsers = 'INSERT INTO loginUsers (username, email, studentID, password, role, lastName, middleName, firstName, birthdate, age, gender, contactNumber, institution, province, city, barangay, blkLot) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
//     if ($stmtUsers = $conn->prepare($queryUsers)) {
//         $stmtUsers->bind_param(
//             'sssssssssssssssss',
//             $lastName,
//             $email,
//             $studentID,
//             $hashedPassword,
//             $userType,
//             $lastName,
//             $middleName,
//             $firstName,
//             $birthdate,
//             $age,
//             $gender,
//             $contactNumber,
//             $institution,
//             $province,
//             $city,
//             $barangay,
//             $blkLot
//         );
//         $stmtUsers->execute();
//         $stmtUsers->close();
//     } else {
//         throw new Exception('Error preparing users query: ' . $conn->error);
//     }
// }



            // Insert into the users table
            $userType = "user";
            $hashedPassword = password_hash($student, PASSWORD_DEFAULT); // Using studentID as password
            $queryUsers = 'INSERT INTO loginUsers (username, email, studentID,  password, role,  lastName, middleName, firstName, birthdate, age, gender, contactNumber, institution, province, city, barangay, blkLot) VALUES (?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?,?,?,?,?)';
            if ($stmtUsers = $conn->prepare($queryUsers)) {
                $stmtUsers->bind_param('sssssssssssssssss', $lname, $email, $student,  $hashedPassword, $userType, $lname, $mname, $fname, $bday, $age, $gender, $connum, $insti, $province, $city, $brgy, $blk);
                $stmtUsers->execute();
                $stmtUsers->close();
            } else {
                throw new Exception('Error preparing users query: ' . $conn->error);
            }

            // Commit transaction
            $conn->commit();
            $response['isSuccess'] = true;
            $response['msg'] = 'User saved successfully';

        } catch (Exception $e) {
            // Rollback transaction in case of error
            $conn->rollback();
            $response['isSuccess'] = false;
            $response['msg'] = 'Error: ' . $e->getMessage();
        }

        $conn->close();
        return json_encode($response);
    }
}

$app = new RegisterUsers();

if (isset($_REQUEST['action'])) {
    if ($_REQUEST['action'] == 'isLogins') {
        $lname = $_REQUEST['lname'];
        $mname = $_REQUEST['mname'];
        $fname = $_REQUEST['fname'];
        $bday = $_REQUEST['bday'];
        $age = $_REQUEST['age'];
        $gender = $_REQUEST['gender'];
        $connum = $_REQUEST['connum'];
        $email = $_REQUEST['email'];
        $insti = $_REQUEST['insti'];
        $student = $_REQUEST['student'];
        $province = $_REQUEST['province'];
        $city = $_REQUEST['city'];
        $brgy = $_REQUEST['brgy'];
        $blk = $_REQUEST['blk'];

        // Save the user data
        echo $app->savePersonalInfoko($lname, $mname, $fname, $bday, $age, $gender, $connum, $email, $insti, $student, $province, $city, $brgy, $blk);
    }
} else {
    echo 'ERROR: No direct access';
}
?>
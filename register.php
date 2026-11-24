<?php


session_start();
require 'dbconn.php';

header('Content-Type: application/json; charset=utf-8');

if (($_SESSION['role'] ?? '') !== 'admin') {
    http_response_code(403);
    echo json_encode(['isSuccess' => false, 'msg' => 'Administrator access is required.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['isSuccess' => false, 'msg' => 'A POST request is required.']);
    exit;
}

class RegisterUsers {

    public function savePersonalInfoko($username, $lname, $mname, $fname, $bday, $age, $gender, $connum, $email, $insti, $student, $province, $city, $brgy, $blk) {
        error_reporting(E_ERROR);
        $config = new Config();
        $response = array();

        $conn = $config->conn;

        if ($conn->connect_error) {
            return json_encode(["isSuccess" => false, "msg" => "Database connection error: " . $conn->connect_error]);
        }

        // Begin transaction
        $conn->begin_transaction();

        try {
            // Validate username
            $usernameCheckStmt = $conn->prepare("SELECT COUNT(*) FROM loginUsers WHERE username = ?");
            $usernameCheckStmt->bind_param("s", $username);
            $usernameCheckStmt->execute();
            $usernameCheckStmt->bind_result($usernameExists);
            $usernameCheckStmt->fetch();
            $usernameCheckStmt->close();

            if ($usernameExists > 0) {
                return json_encode(["isSuccess" => false, "msg" => "Username already exists."]);
            }

            // Validate age
            if ((int)$age < 18) {
                return json_encode(["isSuccess" => false, "msg" => "Invalid age. Must be 18 or older."]);
            }

            // Validate contact number
            if (!preg_match('/^\d{11}$/', $connum)) {
                return json_encode(["isSuccess" => false, "msg" => "Contact number must be exactly 11 digits."]);
            }

            $contactNumberCheckStmt = $conn->prepare("SELECT COUNT(*) FROM loginUsers WHERE contactNumber = ?");
            $contactNumberCheckStmt->bind_param("s", $connum); // Use "s" for string
            $contactNumberCheckStmt->execute();
            $contactNumberCheckStmt->bind_result($contactNumberExists);
            $contactNumberCheckStmt->fetch();
            $contactNumberCheckStmt->close();

            if ($contactNumberExists > 0) {
                return json_encode(["isSuccess" => false, "msg" => "Contact number already exists."]);
            }

            // Validate email
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                return json_encode(["isSuccess" => false, "msg" => "Invalid email format."]);
            }

            $emailCheckStmt = $conn->prepare("SELECT COUNT(*) FROM loginUsers WHERE email = ?");
            $emailCheckStmt->bind_param("s", $email);
            $emailCheckStmt->execute();
            $emailCheckStmt->bind_result($emailExists);
            $emailCheckStmt->fetch();
            $emailCheckStmt->close();

            if ($emailExists > 0) {
                return json_encode(["isSuccess" => false, "msg" => "Email already exists."]);
            }

            // Validate student ID
            $studentIDCheckStmt = $conn->prepare("SELECT COUNT(*) FROM loginUsers WHERE studentID = ?");
            $studentIDCheckStmt->bind_param("s", $student);
            $studentIDCheckStmt->execute();
            $studentIDCheckStmt->bind_result($studentIDExists);
            $studentIDCheckStmt->fetch();
            $studentIDCheckStmt->close();

            if ($studentIDExists > 0) {
                return json_encode(["isSuccess" => false, "msg" => "Student ID already exists."]);
            }

            // Prepare for insertion
            $bday = date('Y-m-d', strtotime($bday)); // Convert birthdate to Y-m-d
            $warning = 0;

            // Insert into the student table
            $queryStudent = 'INSERT INTO student (username, lastName, middleName, firstName, birthdate, age, gender, contactNumber, email, institution, studentID, province, city, barangay, blkLot, warning) 
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            $stmtStudent = $conn->prepare($queryStudent);
            $stmtStudent->bind_param(
                'sssssssssssssssi',
                $username, $lname, $mname, $fname, $bday, $age, $gender, $connum, $email, $insti, $student, $province, $city, $brgy, $blk, $warning
            );
            if (!$stmtStudent->execute()) {
                throw new Exception('Error inserting into student: ' . $stmtStudent->error);
            }
            $stmtStudent->close();

            //Insert into the loginUsers table
            $userType = "user";
            $hashedPassword = password_hash($student, PASSWORD_DEFAULT);
            $queryUsers = 'INSERT INTO loginUsers (username, email, studentID, password, role, lastName, middleName, firstName, birthdate, age, gender, contactNumber, institution, province, city, barangay, blkLot) 
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            $stmtUsers = $conn->prepare($queryUsers);
            $stmtUsers->bind_param(
                'sssssssssssssssss',
                $username, $email, $student, $hashedPassword, $userType, $lname, $mname, $fname, $bday, $age, $gender, $connum, $insti, $province, $city, $brgy, $blk
            );
            if (!$stmtUsers->execute()) {
                throw new Exception('Error inserting into loginUsers: ' . $stmtUsers->error);
            }
            $stmtUsers->close();

            // Commit transaction
            $conn->commit();
            $response['isSuccess'] = true;
            $response['msg'] = 'User saved successfully';

        } catch (Exception $e) {
            $conn->rollback();
            $response['isSuccess'] = false;
            $response['msg'] = 'Error: ' . $e->getMessage();
        }

        $conn->close();
        return json_encode($response);
    }
}

$app = new RegisterUsers();

if (isset($_POST['action']) && $_POST['action'] == 'isLogins') {
    echo $app->savePersonalInfoko(
        $_POST['username'] ?? '', $_POST['lname'] ?? '', $_POST['mname'] ?? '', $_POST['fname'] ?? '',
        $_POST['bday'] ?? '', $_POST['age'] ?? '', $_POST['gender'] ?? '', $_POST['connum'] ?? '',
        $_POST['email'] ?? '', $_POST['insti'] ?? '', $_POST['student'] ?? '', $_POST['province'] ?? '',
        $_POST['city'] ?? '', $_POST['brgy'] ?? '', $_POST['blk'] ?? ''
    );
} else {
    http_response_code(400);
    echo json_encode(['isSuccess' => false, 'msg' => 'No direct access']);
}







// session_start();
// require 'dbconn.php';

// class RegisterUsers {

//     public function savePersonalInfoko($username, $lname, $mname, $fname, $bday, $age, $gender, $connum, $email, $insti, $student, $province, $city, $brgy, $blk) {
//         error_reporting(E_ERROR);
//         $config = new Config();
//         $response = array();

//         $conn = $config->conn;

//         if($conn->connect_error) {
//             return $conn->connect_error;
//         }

//         // Begin transaction
//         $conn->begin_transaction();

//         try {

//     $usernameCheckStmt = $conn->prepare("SELECT COUNT(*) FROM loginUsers WHERE username = ?");
//     $usernameCheckStmt->bind_param("s", $username); // "s" for string
//     $usernameCheckStmt->execute();
//     $usernameCheckStmt->bind_result($usernameExists);
//     $usernameCheckStmt->fetch();
//     $usernameCheckStmt->close();

//     if ($usernameExists > 0) {
//         return json_encode(["isSuccess" => false, "msg" => "Username already exist."]);
//         exit; // Stop further execution if student ID is not found
//     }

//     if ($age < 18) {
//         return json_encode(["isSuccess" => false, "msg" => "Invalid Age."]);
//         exit; // Stop further execution if student ID is not found
//     }


   
//     $connumLength = strlen($connum);
    
//     if ($connumLength != 11) {
//         return json_encode(["isSuccess" => false, "msg" => "Contact number has to be 11 digit."]);
//         exit; // Stop further execution if student ID is not found
//     }

//     $contactNumberCheckStmt = $conn->prepare("SELECT COUNT(*) FROM loginUsers WHERE contactNumber = ?");
//     $contactNumberCheckStmt->bind_param("s", $connum); // "s" for string
//     $contactNumberCheckStmt->execute();
//     $contactNumberCheckStmt->bind_result($contactNumberExists);
//     $contactNumberCheckStmt->fetch();
//     $contactNumberCheckStmt->close();

//     if ($contactNumberExists > 0) {
//         return json_encode(["isSuccess" => false, "msg" => "Contact number already exist."]);
//         exit; // Stop further execution if student ID is not found
//     }



//     $emailCheckStmt = $conn->prepare("SELECT COUNT(*) FROM loginUsers WHERE email = ?");
//     $emailCheckStmt->bind_param("s", $email); // "s" for string
//     $emailCheckStmt->execute();
//     $emailCheckStmt->bind_result($emailExists);
//     $emailCheckStmt->fetch();
//     $emailCheckStmt->close();

//     if ($emailExists > 0) {
//         return json_encode(["isSuccess" => false, "msg" => "Email already exist."]);
//         exit; // Stop further execution if student ID is not found
//     }

//     $studentIDCheckStmt = $conn->prepare("SELECT COUNT(*) FROM loginUsers WHERE studentID = ?");
//     $studentIDCheckStmt->bind_param("s", $student); // "s" for string
//     $studentIDCheckStmt->execute();
//     $studentIDCheckStmt->bind_result($studentIDExists);
//     $studentIDCheckStmt->fetch();
//     $studentIDCheckStmt->close();

//     if ($studentIDExists > 0) {
//         return json_encode(["isSuccess" => false, "msg" => "Student ID already exist."]);
//         exit; // Stop further execution if student ID is not found
//     }


//     $warning = 0;
//             // Insert into the student table
//             $queryStudent = 'INSERT INTO student (username, lastName, middleName, firstName, birthdate, age, gender, contactNumber, email, institution, studentID, province, city, barangay, blkLot, warning) 
//                              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
//             if ($stmtStudent = $conn->prepare($queryStudent)) {
//                 $stmtStudent->bind_param(
//                     'sssssssssssssss',
//                    $username, $lname, $mname, $fname, $bday, $age, $gender, $connum, $email, $insti, $student, $province, $city, $brgy, $blk, $warning);
//                 $stmtStudent->execute();
//                 $stmtStudent->close();
//             } else {
//                 throw new Exception('Error preparing student query: ' . $conn->error);
//             }


//             //Insert into the users table
//             $userType = "user";
//             $hashedPassword = password_hash($student, PASSWORD_DEFAULT); // Using studentID as password
//             $queryUsers = 'INSERT INTO loginUsers (username, email, studentID,  password, role,  lastName, middleName, firstName, birthdate, age, gender, contactNumber, institution, province, city, barangay, blkLot) VALUES (?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?,?,?,?,?)';
//             if ($stmtUsers = $conn->prepare($queryUsers)) {
//                 $stmtUsers->bind_param('sssssssssssssssss', $username, $email, $student,  $hashedPassword, $userType, $lname, $mname, $fname, $bday, $age, $gender, $connum,$insti, $province, $city, $brgy, $blk);
//                 $stmtUsers->execute();
//                 $stmtUsers->close();
// // username Ascending 1
// // email
// // studentID
// // password
// // role
// // lastName
// // middleName
// // firstName
// // birthdate
// // age
// // gender
// // contactNumber
// // institution
// // province
// // city
// // barangay
// // blkLot

//             } else {
//                 throw new Exception('Error preparing users query: ' . $conn->error);
//             }

//            // Commit transaction
//             $conn->commit();
//             $response['isSuccess'] = true;
//             $response['msg'] = 'User saved successfully';

//         } catch (Exception $e) {
//             // Rollback transaction in case of error
//             $conn->rollback();
//             $response['isSuccess'] = false;
//             $response['msg'] = 'Error: ' . $e->getMessage();
//         }

//         $conn->close();
//         return json_encode($response);
//     }
// }

// $app = new RegisterUsers();

// if (isset($_REQUEST['action'])) {
//     if ($_REQUEST['action'] == 'isLogins') {
//         $username = $_REQUEST['username'];
//         $lname = $_REQUEST['lname'];
//         $mname = $_REQUEST['mname'];
//         $fname = $_REQUEST['fname'];
//         $bday = $_REQUEST['bday'];
//         $age = $_REQUEST['age'];
//         $gender = $_REQUEST['gender'];
//         $connum = $_REQUEST['connum'];
//         $email = $_REQUEST['email'];
//         $insti = $_REQUEST['insti'];
//         $student = $_REQUEST['student'];
//         $province = $_REQUEST['province'];
//         $city = $_REQUEST['city'];
//         $brgy = $_REQUEST['brgy'];
//         $blk = $_REQUEST['blk'];

//         // Save the user data
//         echo $app->savePersonalInfoko($username, $lname, $mname, $fname, $bday, $age, $gender, $connum, $email, $insti, $student, $province, $city, $brgy, $blk);
//     }
// } else {
//     echo 'ERROR: No direct access';
// }
?>
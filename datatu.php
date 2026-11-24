<?php
session_start();

$response = array();

if (isset($_SESSION['studentID']) && isset($_SESSION['email'])) {
    $response['isSuccess'] = true;
    $response['studentID'] = $_SESSION['studentID'];
    $response['email'] = $_SESSION['email'];
    $response['role'] = isset($_SESSION['role']) ? $_SESSION['role'] : 'N/A';
    $response['lastName'] = isset($_SESSION['lastName']) ? $_SESSION['lastName'] : 'N/A';
    $response['middleName'] = isset($_SESSION['middleName']) ? $_SESSION['middleName'] : 'N/A';
    $response['firstName'] = isset($_SESSION['firstName']) ? $_SESSION['firstName'] : 'N/A';
    $response['birthdate'] = isset($_SESSION['birthdate']) ? $_SESSION['birthdate'] : 'N/A';
    $response['age'] = isset($_SESSION['age']) ? $_SESSION['age'] : 'N/A';
    $response['gender'] = isset($_SESSION['gender']) ? $_SESSION['gender'] : 'N/A';
    $response['contactNumber'] = isset($_SESSION['contactNumber']) ? $_SESSION['contactNumber'] : 'N/A';
    $response['institution'] = isset($_SESSION['institution']) ? $_SESSION['institution'] : 'N/A';
    $response['province'] = isset($_SESSION['province']) ? $_SESSION['province'] : 'N/A';
    $response['city'] = isset($_SESSION['city']) ? $_SESSION['city'] : 'N/A';
    $response['barangay'] = isset($_SESSION['barangay']) ? $_SESSION['barangay'] : 'N/A';
    $response['blkLot'] = isset($_SESSION['blkLot']) ? $_SESSION['blkLot'] : 'N/A';
} else {
    $response['isSuccess'] = false;
    $response['msg'] = 'No session data found. Please log in again.';
}

echo json_encode($response);
?>

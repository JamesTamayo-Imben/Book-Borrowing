<?php
session_start();

$response = array();

if (isset($_SESSION['studentID']) && isset($_SESSION['email'])) {
    $response['isSuccess'] = true;
    $response['studentID'] = $_SESSION['studentID'];
    $response['email'] = $_SESSION['email'];
} else {
    $response['isSuccess'] = false;
    $response['msg'] = 'No session data found';
}

echo json_encode($response);
?>

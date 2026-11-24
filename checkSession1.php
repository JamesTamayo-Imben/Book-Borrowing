<?php
session_start();

if(isset($_SESSION['username'])) {
    $arr = array(
        'isSuccess' => true
    );
} else {
    $arr = array(
        'isSuccess' => false,
        'value' => 0,
        'msg' => 'inactive session'
    );
}

echo json_encode($arr);

// session_start();
// if ($loginSuccessful) {
//     $_SESSION['username'] = $username;
//     echo json_encode(['isSuccess' => true]);
// } else {
//     echo json_encode(['isSuccess' => false, 'msg' => 'Invalid credentials']);
// }

?>
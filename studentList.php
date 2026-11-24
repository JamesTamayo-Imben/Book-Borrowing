<?php
session_start();
require 'dbconn.php';

header('Content-Type: application/json; charset=utf-8');

function respond($isSuccess, $message, $value = [], $filters = [])
{
    echo json_encode([
        'isSuccess' => $isSuccess,
        'value' => $value,
        'filters' => $filters,
        'msg' => $message
    ]);
    exit;
}

if (($_SESSION['role'] ?? '') !== 'admin') {
    http_response_code(403);
    respond(false, 'Administrator access is required.');
}

$config = new Config();
$conn = $config->conn;
$action = $_POST['action'] ?? '';

if ($action === 'updateStudent') {
    $studentID = trim($_POST['studentID'] ?? '');
    $gender = trim($_POST['gender'] ?? '');
    $contactNumber = trim($_POST['contactNumber'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $institution = trim($_POST['institution'] ?? '');

    if ($studentID === '' || $gender === '' || $institution === '' ||
        !preg_match('/^\d{11}$/', $contactNumber) || !filter_var($email, FILTER_VALIDATE_EMAIL) ||
        strlen($gender) > 30 || strlen($institution) > 100) {
        http_response_code(400);
        respond(false, 'Check the student details and try again.');
    }

    try {
        $conn->begin_transaction();

        foreach ([
            ['gender', $gender],
            ['institution', $institution]
        ] as [$column, $value]) {
            $optionStmt = $conn->prepare(
                "SELECT COUNT(*) FROM student WHERE LOWER(TRIM($column)) = LOWER(?)"
            );
            if (!$optionStmt) {
                throw new RuntimeException('Unable to verify the selected student details.');
            }
            $optionStmt->bind_param('s', $value);
            if (!$optionStmt->execute()) {
                throw new RuntimeException('Unable to verify the selected student details.');
            }
            $optionStmt->bind_result($optionCount);
            $optionStmt->fetch();
            $optionStmt->close();
            if ((int)$optionCount === 0) {
                $conn->rollback();
                http_response_code(400);
                respond(false, 'Choose a gender and institution used by the student records.');
            }
        }

        foreach ([
            ['SELECT COUNT(*) FROM student WHERE studentID = ?', $studentID],
            ['SELECT COUNT(*) FROM loginUsers WHERE studentID = ?', $studentID]
        ] as [$query, $id]) {
            $stmt = $conn->prepare($query);
            if (!$stmt) {
                throw new RuntimeException('Unable to verify the student record.');
            }
            $stmt->bind_param('s', $id);
            if (!$stmt->execute()) {
                throw new RuntimeException('Unable to verify the student record.');
            }
            $stmt->bind_result($recordCount);
            $stmt->fetch();
            $stmt->close();
            if ((int)$recordCount !== 1) {
                $conn->rollback();
                http_response_code(404);
                respond(false, 'The student account could not be found.');
            }
        }

        foreach ([
            ['email', $email, 'Email address'],
            ['contactNumber', $contactNumber, 'Contact number']
        ] as [$column, $value, $label]) {
            $query = "SELECT COUNT(*) FROM loginUsers WHERE $column = ? AND studentID <> ?";
            $stmt = $conn->prepare($query);
            if (!$stmt) {
                throw new RuntimeException('Unable to verify the updated details.');
            }
            $stmt->bind_param('ss', $value, $studentID);
            if (!$stmt->execute()) {
                throw new RuntimeException('Unable to verify the updated details.');
            }
            $stmt->bind_result($duplicateCount);
            $stmt->fetch();
            $stmt->close();
            if ((int)$duplicateCount > 0) {
                $conn->rollback();
                http_response_code(409);
                respond(false, $label . ' is already used by another account.');
            }
        }

        $studentStmt = $conn->prepare(
            'UPDATE student SET gender = ?, contactNumber = ?, email = ?, institution = ? WHERE studentID = ?'
        );
        $loginStmt = $conn->prepare(
            'UPDATE loginUsers SET gender = ?, contactNumber = ?, email = ?, institution = ? WHERE studentID = ?'
        );
        if (!$studentStmt || !$loginStmt) {
            throw new RuntimeException('Unable to prepare the account update.');
        }

        $studentStmt->bind_param('sssss', $gender, $contactNumber, $email, $institution, $studentID);
        $loginStmt->bind_param('sssss', $gender, $contactNumber, $email, $institution, $studentID);
        if (!$studentStmt->execute() || !$loginStmt->execute()) {
            throw new RuntimeException('Unable to save the updated student details.');
        }

        $studentStmt->close();
        $loginStmt->close();
        $conn->commit();
        respond(true, 'Student details updated.');
    } catch (Throwable $error) {
        $conn->rollback();
        error_log('Student update failed: ' . $error->getMessage());
        http_response_code(500);
        respond(false, 'The student details could not be saved. Try again.');
    }
}

if ($action === 'deleteStudent') {
    $studentID = trim($_POST['studentID'] ?? '');
    if ($studentID === '') {
        http_response_code(400);
        respond(false, 'A student ID is required.');
    }

    try {
        $activeStmt = $conn->prepare(
            'SELECT
                (SELECT COUNT(*) FROM borrowedbook WHERE studentID = ?) +
                (SELECT COUNT(*) FROM overduebook WHERE studentID = ?)'
        );
        if (!$activeStmt) {
            throw new RuntimeException('Unable to check active loans.');
        }
        $activeStmt->bind_param('ss', $studentID, $studentID);
        if (!$activeStmt->execute()) {
            throw new RuntimeException('Unable to check active loans.');
        }
        $activeStmt->bind_result($activeLoans);
        $activeStmt->fetch();
        $activeStmt->close();
        if ((int)$activeLoans > 0) {
            http_response_code(409);
            respond(false, 'This student has active or overdue loans. Resolve them before deleting the account.');
        }

        $conn->begin_transaction();
        $loginStmt = $conn->prepare('DELETE FROM loginUsers WHERE studentID = ? AND role = ?');
        $studentStmt = $conn->prepare('DELETE FROM student WHERE studentID = ?');
        if (!$loginStmt || !$studentStmt) {
            throw new RuntimeException('Unable to prepare the account deletion.');
        }

        $role = 'user';
        $loginStmt->bind_param('ss', $studentID, $role);
        $studentStmt->bind_param('s', $studentID);
        if (!$loginStmt->execute() || !$studentStmt->execute()) {
            throw new RuntimeException('Unable to delete the student account.');
        }
        if ($loginStmt->affected_rows !== 1 || $studentStmt->affected_rows !== 1) {
            $conn->rollback();
            http_response_code(404);
            respond(false, 'The student account could not be found.');
        }

        $loginStmt->close();
        $studentStmt->close();
        $conn->commit();
        respond(true, 'Student account deleted.');
    } catch (Throwable $error) {
        $conn->rollback();
        error_log('Student deletion failed: ' . $error->getMessage());
        http_response_code(500);
        respond(false, 'The student account could not be deleted. Try again.');
    }
}

$stmt = $conn->prepare(
    'SELECT studentID, TRIM(gender), contactNumber, email, TRIM(institution) FROM student ORDER BY studentID'
);
if (!$stmt || !$stmt->execute()) {
    http_response_code(500);
    respond(false, 'Student records could not be loaded.');
}

$stmt->bind_result($studentID, $gender, $contactNumber, $email, $institution);
$students = [];
while ($stmt->fetch()) {
    $students[] = [
        'studentID' => $studentID,
        'gender' => $gender,
        'contactNumber' => $contactNumber,
        'email' => $email,
        'institution' => $institution
    ];
}
$stmt->close();

$filters = [];
foreach ([
    'gender' => 'gender',
    'institution' => 'institution'
] as $filterName => $column) {
    $filterStmt = $conn->prepare(
        "SELECT DISTINCT TRIM($column) FROM student
         WHERE $column IS NOT NULL AND TRIM($column) <> ''
         ORDER BY TRIM($column)"
    );
    if (!$filterStmt || !$filterStmt->execute()) {
        http_response_code(500);
        respond(false, 'Student filters could not be loaded.');
    }

    $filterStmt->bind_result($filterValue);
    $filters[$filterName] = [];
    while ($filterStmt->fetch()) {
        $filters[$filterName][] = $filterValue;
    }
    $filterStmt->close();
}

$conn->close();

respond(true, 'Student records loaded.', $students, $filters);

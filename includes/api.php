<?php

function apiDatabase(): mysqli
{
    global $config;
    require_once __DIR__ . '/../dbconn.php';

    return $config->conn;
}

function apiError(string $message, int $status = 500): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => $message]);
    exit;
}

function sendBookCards(string $categoryID): void
{
    header('Content-Type: application/json; charset=utf-8');
    $conn = apiDatabase();
    $query = "SELECT b.bookID, b.title, b.author, b.image, b.description,
                     b.publishedDate, b.availableStock,
                     COALESCE((SELECT adminID FROM admin LIMIT 1), 'defaultAdminID') AS adminID
              FROM books b
              WHERE b.categoryID = ?";

    try {
        $stmt = $conn->prepare($query);
        $stmt->bind_param('s', $categoryID);
        $stmt->execute();
        $result = $stmt->get_result();
        echo json_encode(['value' => $result->fetch_all(MYSQLI_ASSOC)]);
        $stmt->close();
    } catch (mysqli_sql_exception $exception) {
        error_log($exception->getMessage());
        apiError('Unable to load books.');
    } finally {
        $conn->close();
    }
}

function sendStockSummary(string $categoryID): void
{
    header('Content-Type: application/json; charset=utf-8');
    $conn = apiDatabase();

    try {
        $stmt = $conn->prepare(
            'SELECT COALESCE(SUM(totalStock), 0) AS total,
                    COALESCE(SUM(availableStock), 0) AS available
             FROM books
             WHERE categoryID = ?'
        );
        $stmt->bind_param('s', $categoryID);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        echo json_encode([
            'total' => (int) $result['total'],
            'available' => (int) $result['available'],
        ]);
        $stmt->close();
    } catch (mysqli_sql_exception $exception) {
        error_log($exception->getMessage());
        apiError('Unable to load stock totals.');
    } finally {
        $conn->close();
    }
}

function sendInstitutionSummary(string $institution): void
{
    header('Content-Type: application/json; charset=utf-8');
    $conn = apiDatabase();

    try {
        $stmt = $conn->prepare(
            'SELECT COUNT(*) AS totalStudents,
                    COALESCE(SUM(institution = ?), 0) AS studentCount
             FROM student'
        );
        $stmt->bind_param('s', $institution);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        echo json_encode([
            'studentCount' => (int) $result['studentCount'],
            'totalStudents' => max(1, (int) $result['totalStudents']),
        ]);
        $stmt->close();
    } catch (mysqli_sql_exception $exception) {
        error_log($exception->getMessage());
        apiError('Unable to load student totals.');
    } finally {
        $conn->close();
    }
}

function sendBorrowedBooks(bool $overdue = false, ?string $categoryID = null): void
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    header('Content-Type: application/json; charset=utf-8');

    if (!isset($_SESSION['studentID'])) {
        apiError('Student ID not found in session', 401);
    }

    $conn = apiDatabase();
    $table = $overdue ? 'overduebook' : 'borrowedbook';
    $query = "SELECT b.bookID, b.title, b.author, b.image,
                     bb.borrowedDate, bb.returnDate
              FROM {$table} bb
              INNER JOIN books b ON b.bookID = bb.bookID
              WHERE bb.studentID = ?";

    if ($categoryID !== null) {
        $query .= ' AND b.categoryID = ?';
    }

    try {
        $stmt = $conn->prepare($query);
        if ($categoryID === null) {
            $stmt->bind_param('s', $_SESSION['studentID']);
        } else {
            $stmt->bind_param('ss', $_SESSION['studentID'], $categoryID);
        }

        $stmt->execute();
        $result = $stmt->get_result();
        echo json_encode(['value' => $result->fetch_all(MYSQLI_ASSOC)]);
        $stmt->close();
    } catch (mysqli_sql_exception $exception) {
        error_log($exception->getMessage());
        apiError('Unable to load borrowed books.');
    } finally {
        $conn->close();
    }
}

<?php

session_start();
require_once __DIR__ . '/dbconn.php';

header('Content-Type: application/json; charset=utf-8');

function manageBooksRespond(array $payload, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}

function manageBooksInputString(array $data, string $key): string
{
    $value = $data[$key] ?? '';
    if (!is_string($value) && !is_int($value)) {
        manageBooksRespond(['error' => 'Catalog text fields must be plain text.'], 400);
    }

    return trim((string) $value);
}

if (!isset($_SESSION['username'])) {
    manageBooksRespond(['error' => 'Sign in to manage the catalog.'], 401);
}

$conn = $config->conn;
$username = (string) $_SESSION['username'];
$transactionStarted = false;

try {
    $roleStatement = $conn->prepare('SELECT role FROM loginUsers WHERE username = ?');
    $roleStatement->bind_param('s', $username);
    $roleStatement->execute();
    $role = $roleStatement->get_result()->fetch_column();
    $roleStatement->close();

    if ($role !== 'admin') {
        manageBooksRespond(['error' => 'Administrator access is required.'], 403);
    }

    $method = $_SERVER['REQUEST_METHOD'];
    if ($method === 'GET') {
        $csrfToken = $_SESSION['manageBooksCsrf'] ?? bin2hex(random_bytes(32));
        $_SESSION['manageBooksCsrf'] = $csrfToken;
        $result = $conn->query(
            'SELECT bookID, categoryID, title, author, image, description,
                    publishedDate, totalStock, availableStock
             FROM books
             ORDER BY title'
        );
        manageBooksRespond([
            'csrfToken' => $csrfToken,
            'value' => $result->fetch_all(MYSQLI_ASSOC),
        ]);
    }

    if ($method !== 'POST') {
        manageBooksRespond(['error' => 'Unsupported request method.'], 405);
    }

    $requestToken = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    $sessionToken = $_SESSION['manageBooksCsrf'] ?? '';
    if ($sessionToken === '' || !hash_equals($sessionToken, $requestToken)) {
        manageBooksRespond(['error' => 'Your session token is invalid. Refresh and try again.'], 403);
    }

    $requestBody = file_get_contents('php://input');
    $data = json_decode($requestBody, true);
    if (!is_array($data)) {
        manageBooksRespond(['error' => 'The request body must be valid JSON.'], 400);
    }

    $action = manageBooksInputString($data, 'action');
    $bookID = manageBooksInputString($data, 'bookID');
    if ($action === 'delete') {
        if ($bookID === '' || strlen($bookID) > 50) {
            manageBooksRespond(['error' => 'Enter a valid book ID.'], 400);
        }

        $referenceStatement = $conn->prepare(
            'SELECT
                (SELECT COUNT(*) FROM borrowedbook WHERE bookID = ?) +
                (SELECT COUNT(*) FROM overduebook WHERE bookID = ?) +
                (SELECT COUNT(*) FROM returnbook WHERE bookID = ?) +
                (SELECT COUNT(*) FROM transactionlog WHERE bookID = ?) AS referenceCount'
        );
        $referenceStatement->bind_param('ssss', $bookID, $bookID, $bookID, $bookID);
        $referenceStatement->execute();
        $referenceCount = (int) $referenceStatement->get_result()->fetch_assoc()['referenceCount'];
        $referenceStatement->close();
        if ($referenceCount > 0) {
            manageBooksRespond([
                'error' => 'This book has borrowing history and cannot be deleted.',
            ], 409);
        }

        $conn->begin_transaction();
        $transactionStarted = true;
        $statusStatement = $conn->prepare('DELETE FROM bookstatus WHERE bookID = ?');
        $statusStatement->bind_param('s', $bookID);
        $statusStatement->execute();
        $statusStatement->close();

        $deleteStatement = $conn->prepare('DELETE FROM books WHERE bookID = ?');
        $deleteStatement->bind_param('s', $bookID);
        $deleteStatement->execute();
        $deleted = $deleteStatement->affected_rows;
        $deleteStatement->close();
        if ($deleted !== 1) {
            $conn->rollback();
            $transactionStarted = false;
            manageBooksRespond(['error' => 'The book was not found.'], 404);
        }
        $conn->commit();
        $transactionStarted = false;
        manageBooksRespond(['message' => 'Book deleted.']);
    }

    if ($action !== 'create' && $action !== 'update') {
        manageBooksRespond(['error' => 'Choose a supported catalog action.'], 400);
    }

    if (
        $bookID === '' ||
        strlen($bookID) > 50 ||
        !preg_match('/^[A-Za-z0-9_-]+$/', $bookID)
    ) {
        manageBooksRespond(['error' => 'Book ID can contain letters, numbers, hyphens, and underscores.'], 400);
    }

    $categoryID = manageBooksInputString($data, 'categoryID');
    $categories = ['KLDIS001', 'KLDPS002', 'KLDCE003', 'KLDNS004', 'KLDMW005'];
    if (!in_array($categoryID, $categories, true)) {
        manageBooksRespond(['error' => 'Choose a valid book collection.'], 400);
    }

    $title = manageBooksInputString($data, 'title');
    $author = manageBooksInputString($data, 'author');
    $image = manageBooksInputString($data, 'image');
    $description = manageBooksInputString($data, 'description');
    $publishedDate = manageBooksInputString($data, 'publishedDate');
    $totalRaw = $data['totalStock'] ?? null;
    $availableRaw = $data['availableStock'] ?? null;
    if (
        (!is_string($totalRaw) && !is_int($totalRaw)) ||
        (!is_string($availableRaw) && !is_int($availableRaw))
    ) {
        manageBooksRespond(['error' => 'Stock values must be non-negative integers.'], 400);
    }
    $totalStock = filter_var($totalRaw, FILTER_VALIDATE_INT);
    $availableStock = filter_var($availableRaw, FILTER_VALIDATE_INT);

    if ($title === '' || strlen($title) > 255 || strlen($author) > 255) {
        manageBooksRespond(['error' => 'Enter a title and keep title and author within 255 characters.'], 400);
    }
    if (
        $totalStock === false ||
        $availableStock === false ||
        $totalStock < 0 ||
        $availableStock < 0 ||
        $availableStock > $totalStock
    ) {
        manageBooksRespond(['error' => 'Stock values must be non-negative integers and available copies cannot exceed total copies.'], 400);
    }
    if (strlen($description) > 60000) {
        manageBooksRespond(['error' => 'The description is too long.'], 400);
    }
    if ($publishedDate !== '') {
        $date = DateTime::createFromFormat('!Y-m-d', $publishedDate);
        if (!$date || $date->format('Y-m-d') !== $publishedDate) {
            manageBooksRespond(['error' => 'Enter a valid publication date.'], 400);
        }
    } else {
        $publishedDate = null;
    }
    if ($image !== '') {
        if (!preg_match('/^book-image\/[A-Za-z0-9._-]+\.(?:jpe?g|png|webp)$/i', $image)) {
            manageBooksRespond(['error' => 'Choose a cover path inside the book-image folder.'], 400);
        }
        if (!is_file(__DIR__ . '/' . $image)) {
            manageBooksRespond(['error' => 'The selected cover image does not exist.'], 400);
        }
    } else {
        $image = null;
    }

    $author = $author === '' ? null : $author;
    $description = $description === '' ? null : $description;
    $activeLoans = 0;
    if ($action === 'update') {
        $loanStatement = $conn->prepare(
            'SELECT
                (SELECT COUNT(*) FROM borrowedbook WHERE bookID = ?) +
                (SELECT COUNT(*) FROM overduebook WHERE bookID = ?) AS loanCount'
        );
        $loanStatement->bind_param('ss', $bookID, $bookID);
        $loanStatement->execute();
        $activeLoans = (int) $loanStatement->get_result()->fetch_assoc()['loanCount'];
        $loanStatement->close();
        if ($totalStock < $activeLoans || $availableStock > $totalStock - $activeLoans) {
            manageBooksRespond([
                'error' => 'Stock cannot be lower than the current active borrowing count.',
            ], 409);
        }
    }

    $conn->begin_transaction();
    $transactionStarted = true;
    if ($action === 'create') {
        $statement = $conn->prepare(
            'INSERT INTO books (
                bookID, categoryID, title, author, image, description,
                publishedDate, totalStock, availableStock
             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $statement->bind_param(
            'sssssssii',
            $bookID,
            $categoryID,
            $title,
            $author,
            $image,
            $description,
            $publishedDate,
            $totalStock,
            $availableStock
        );
        $statement->execute();
        $statement->close();
    } else {
        $existsStatement = $conn->prepare('SELECT bookID FROM books WHERE bookID = ?');
        $existsStatement->bind_param('s', $bookID);
        $existsStatement->execute();
        $exists = $existsStatement->get_result()->num_rows === 1;
        $existsStatement->close();
        if (!$exists) {
            $conn->rollback();
            $transactionStarted = false;
            manageBooksRespond(['error' => 'The book was not found.'], 404);
        }

        $statement = $conn->prepare(
            'UPDATE books
             SET categoryID = ?, title = ?, author = ?, image = ?, description = ?,
                 publishedDate = ?, totalStock = ?, availableStock = ?
             WHERE bookID = ?'
        );
        $statement->bind_param(
            'ssssssiis',
            $categoryID,
            $title,
            $author,
            $image,
            $description,
            $publishedDate,
            $totalStock,
            $availableStock,
            $bookID
        );
        $statement->execute();
        $statement->close();
    }

    $status = $availableStock > 0 ? 'available' : 'unavailable';
    $statusStatement = $conn->prepare(
        'INSERT INTO bookstatus (bookID, status) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE status = VALUES(status)'
    );
    $statusStatement->bind_param('ss', $bookID, $status);
    $statusStatement->execute();
    $statusStatement->close();
    $conn->commit();
    $transactionStarted = false;

    manageBooksRespond([
        'message' => $action === 'create' ? 'Book added to the catalog.' : 'Book updated.',
    ]);
} catch (mysqli_sql_exception $exception) {
    if ($transactionStarted) {
        $conn->rollback();
    }
    error_log($exception->getMessage());
    if ((int) $exception->getCode() === 1062) {
        manageBooksRespond(['error' => 'That book ID is already in use.'], 409);
    }
    manageBooksRespond(['error' => 'The catalog request could not be completed.'], 500);
}

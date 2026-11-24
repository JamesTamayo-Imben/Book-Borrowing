# Book Borrowing System

A PHP and MySQL application for managing a library's book inventory, student accounts, borrowing, returns, and overdue notices. The interface uses Bootstrap and jQuery; MariaDB is supported through XAMPP.

> This is a local development/demo project. The included database accounts and default XAMPP credentials are not suitable for a public or production deployment.

## Features

- Student registration and sign-in, with separate student and administrator dashboards
- Book browsing by collection, live stock display, and keyboard-accessible collection toggles
- Clickable student catalog cards with stock, collection, and bibliographic details
- Administrator-only book create, update, and delete tools
- Responsive spacing and a consistent neutral/forest/green 60/30/10 color system
- Database-backed administrator inventory and circulation summaries, plus a live student catalog
- Borrowing, returns, overdue tracking, and notifications
- Student, stock, and borrowing summaries

## Requirements

- XAMPP with Apache, PHP, and MySQL/MariaDB
- PHP's `mysqli` extension enabled
- A browser

## Quick start with XAMPP

1. Start **Apache** and **MySQL** from the XAMPP Control Panel.
2. Create and seed the database using **phpMyAdmin**:
   - Open `http://localhost/phpmyadmin`.
   - Select **Import** and import [`schema.sql`](./schema.sql).
   - Import [`sample-data.sql`](./sample-data.sql) the same way.
3. Serve the project using either option:

   **XAMPP Apache:** Copy the project folder into XAMPP's `htdocs` directory, then open:

   ```text
   http://localhost/bookborowingsystem/logIn.html
   ```

   **PHP development server:** From this project directory, run:

   ```bash
   php -S 127.0.0.1:8000
   ```

   Then open `http://127.0.0.1:8000/logIn.html`. Keep the terminal open while using the app.

The database connection is configured in [`dbconn.php`](./dbconn.php) for a local XAMPP setup (`127.0.0.1`, user `root`, blank password, database `borrowing_system`). If your MySQL credentials differ, update that file to match your local setup.

## Demo accounts

Import both SQL files before signing in. The sample dataset provides:

| Account | Username | Password |
| --- | --- | --- |
| Administrator | `admin` | `admin` |
| Student 1 | `demo.reader1` | `Reader123!` |
| Student 2 | `demo.reader2` | `Reader123!` |
| Student 3 | `demo.reader3` | `Reader123!` |

These are public demo credentials. Do not reuse them outside a local test environment.

## Database setup

The import files are deliberately separate:

- [`schema.sql`](./schema.sql) creates the `borrowing_system` database and required tables. It also creates the demo administrator account.
- [`sample-data.sql`](./sample-data.sql) adds example students, 20 books matching `book-image/book1.jpg` through `book20.jpg`, inventory statuses, borrowing records, and notifications.
- [`book-catalog-update.sql`](./book-catalog-update.sql) updates the previous sample book metadata by cover path, adds any missing cover records, and preserves existing book IDs and stock. Run it once if the older sample data is already in your database:

  ```bash
  /opt/lampp/bin/mysql -u root borrowing_system < book-catalog-update.sql
  ```

The migration does not remove existing records. It clears the old sample publication dates rather than guessing which edition the cover represents; an administrator can enter a verified date in **Books → Manage catalog**. Book records with borrowing or return history cannot be deleted, preserving circulation records.

For a MySQL command-line setup with XAMPP's default empty root password:

```bash
/opt/lampp/bin/mysql -u root < schema.sql
/opt/lampp/bin/mysql -u root borrowing_system < sample-data.sql
```

In phpMyAdmin, import `schema.sql` first and `sample-data.sql` second. Both files can be imported again without duplicating their sample records. `INSERT IGNORE` preserves rows that already use the sample IDs; it does not overwrite your edits.

The sample book covers refer to the images already in `book-image/`. Student catalog details include concise, work-level context and first-publication years where a matching [Open Library](https://openlibrary.org/) record is available, including [The Pragmatic Programmer](https://openlibrary.org/works/OL5748544W), [C# Game Programming Cookbook for Unity 3D](https://openlibrary.org/works/OL19547573W), [Clean Code](https://openlibrary.org/works/OL17618370W), [Introduction to Algorithms](https://openlibrary.org/works/OL4781294W), [Forty Studies That Changed Psychology](https://openlibrary.org/works/OL1845342W), [Exploring Psychology](https://openlibrary.org/works/OL14859349W), [Abnormal Psychology](https://openlibrary.org/works/OL2035675W), [Civil Engineering Formulas](https://openlibrary.org/works/OL280480W), [The Tower and the Bridge](https://openlibrary.org/works/OL15840572W), and [Why Buildings Fall Down](https://openlibrary.org/works/OL3350803W). The Introduction to Psychology cover does not name an author, so its author is left blank rather than inferred from the publisher. Student names, accounts, and records are fictional demo data.

## Project layout

| Path | Purpose |
| --- | --- |
| `logIn.html`, `dashboard*.html` | Sign-in and dashboard pages |
| `*.php` | Authentication, registration, book, borrowing, return, and data endpoints |
| `dashboardOverview.php`, `catalog.php` | Authenticated dashboard summaries and live catalog data |
| `notificationCount.php` | Session-scoped student notification total |
| `manageBooks.html`, `manageBooks.php`, `scripts/manageBooks.js` | Administrator-only catalog CRUD and validation |
| `scripts/dashboard-data.js`, `scripts/navigation.js` | Dashboard rendering and role-aware navigation |
| `includes/api.php` | Shared handlers used by the category-specific book, stock, student, and borrowing endpoints |
| `dbconn.php` | MySQL connection settings |
| `schema.sql` | Database and table definitions |
| `sample-data.sql` | Repeat-safe demo records |
| `publics/`, `scripts/`, `images/`, `book-image/` | Front-end assets and images |

## Troubleshooting

- **Database connection error:** Confirm XAMPP MySQL is running, the `borrowing_system` database exists, and the credentials in `dbconn.php` match XAMPP.
- **Unknown database or missing table:** Import `schema.sql`, then import `sample-data.sql`.
- **Blank page or HTTP 500:** Use PHP through XAMPP Apache or the PHP development server; opening the HTML files directly with `file://` will not execute PHP endpoints.
- **Missing book cover:** Ensure the project is served from its root and that the `book-image/` directory is present.
- **Old demo titles still appear:** Run [`book-catalog-update.sql`](./book-catalog-update.sql) against the database that already contains the sample records.

## Security note

This project is intended for local learning and demonstration. Before deployment, replace default credentials, use a dedicated least-privilege database user, configure secure session and transport settings, and review authentication, authorization, input validation, and error handling.

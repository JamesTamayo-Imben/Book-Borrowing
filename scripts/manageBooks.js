(function () {
    'use strict';

    var categories = {
        KLDIS001: 'Information System',
        KLDPS002: 'Psychology',
        KLDCE003: 'Engineering',
        KLDNS004: 'Nursing',
        KLDMW005: 'Midwifery'
    };

    var request = async function (options) {
        var response = await fetch('manageBooks.php', options);
        var payload;
        try {
            payload = await response.json();
        } catch (error) {
            throw new Error('The server returned an invalid response.');
        }
        if (!response.ok) {
            throw new Error(payload.error || 'The request could not be completed.');
        }
        return payload;
    };

    var init = function () {
        var form = document.getElementById('manage-book-form');
        if (!form) {
            return;
        }

        var message = document.getElementById('book-management-message');
        var rows = document.getElementById('book-management-rows');
        var count = document.getElementById('book-count');
        var idInput = document.getElementById('book-id');
        var saveButton = document.getElementById('save-book-button');
        var cancelButton = document.getElementById('cancel-book-edit');
        var token = '';
        var books = [];
        var editingBookID = null;

        var showMessage = function (text, state) {
            message.textContent = text;
            message.dataset.state = state || '';
        };

        var renderBooks = function () {
            rows.replaceChildren();
            count.textContent = books.length + (books.length === 1 ? ' book' : ' books');
            if (!books.length) {
                var emptyRow = document.createElement('tr');
                var emptyCell = document.createElement('td');
                emptyCell.className = 'library-management-empty';
                emptyCell.colSpan = 5;
                emptyCell.textContent = 'No books are in the catalog yet.';
                emptyRow.appendChild(emptyCell);
                rows.appendChild(emptyRow);
                return;
            }

            books.forEach(function (book) {
                var row = document.createElement('tr');
                var titleCell = document.createElement('td');
                var authorCell = document.createElement('td');
                var categoryCell = document.createElement('td');
                var stockCell = document.createElement('td');
                var actionCell = document.createElement('td');
                var actions = document.createElement('div');
                var editButton = document.createElement('button');
                var deleteButton = document.createElement('button');

                titleCell.textContent = book.title;
                authorCell.textContent = book.author || '—';
                categoryCell.textContent = categories[book.categoryID] || book.categoryID;
                stockCell.textContent = book.availableStock + ' / ' + book.totalStock;
                actions.className = 'book-actions';
                editButton.className = 'btn btn-sm btn-outline-primary';
                editButton.type = 'button';
                editButton.dataset.action = 'edit';
                editButton.dataset.bookId = book.bookID;
                editButton.textContent = 'Edit';
                deleteButton.className = 'btn btn-sm btn-outline-danger';
                deleteButton.type = 'button';
                deleteButton.dataset.action = 'delete';
                deleteButton.dataset.bookId = book.bookID;
                deleteButton.textContent = 'Delete';
                actions.append(editButton, deleteButton);
                actionCell.appendChild(actions);
                row.append(titleCell, authorCell, categoryCell, stockCell, actionCell);
                rows.appendChild(row);
            });
        };

        var loadBooks = async function () {
            rows.innerHTML = '<tr><td class="library-management-empty" colspan="5">Loading books…</td></tr>';
            try {
                var response = await request({ credentials: 'same-origin' });
                token = response.csrfToken;
                books = response.value;
                renderBooks();
                showMessage('', '');
            } catch (error) {
                rows.innerHTML = '<tr><td class="library-management-empty" colspan="5">Books could not be loaded.</td></tr>';
                showMessage(error.message, 'error');
            }
        };

        var resetForm = function () {
            form.reset();
            editingBookID = null;
            idInput.disabled = false;
            document.getElementById('book-total-stock').value = '1';
            document.getElementById('book-available-stock').value = '1';
            saveButton.textContent = 'Add book';
            cancelButton.hidden = true;
            document.getElementById('book-form-heading').textContent = 'Add a book';
        };

        var startEditing = function (book) {
            editingBookID = book.bookID;
            idInput.value = book.bookID;
            idInput.disabled = true;
            document.getElementById('book-category').value = book.categoryID;
            document.getElementById('book-title').value = book.title;
            document.getElementById('book-author').value = book.author || '';
            document.getElementById('book-image').value = book.image || '';
            document.getElementById('book-published-date').value = book.publishedDate || '';
            document.getElementById('book-total-stock').value = book.totalStock;
            document.getElementById('book-available-stock').value = book.availableStock;
            document.getElementById('book-description').value = book.description || '';
            saveButton.textContent = 'Save changes';
            cancelButton.hidden = false;
            document.getElementById('book-form-heading').textContent = 'Edit book';
            document.getElementById('book-title').focus();
        };

        form.addEventListener('submit', async function (event) {
            event.preventDefault();
            var data = new FormData(form);
            var payload = Object.fromEntries(data.entries());
            payload.action = editingBookID ? 'update' : 'create';
            payload.bookID = editingBookID || payload.bookID;

            try {
                var response = await request({
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': token
                    },
                    body: JSON.stringify(payload)
                });
                resetForm();
                await loadBooks();
                showMessage(response.message, 'success');
            } catch (error) {
                showMessage(error.message, 'error');
            }
        });

        cancelButton.addEventListener('click', resetForm);

        rows.addEventListener('click', async function (event) {
            var button = event.target.closest('button[data-action]');
            if (!button) {
                return;
            }
            var book = books.find(function (item) {
                return item.bookID === button.dataset.bookId;
            });
            if (!book) {
                showMessage('That book is no longer in the list. Refresh and try again.', 'error');
                return;
            }
            if (button.dataset.action === 'edit') {
                startEditing(book);
                return;
            }
            if (!window.confirm('Delete "' + book.title + '"? Books with borrowing history cannot be deleted.')) {
                return;
            }
            try {
                var response = await request({
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': token
                    },
                    body: JSON.stringify({ action: 'delete', bookID: book.bookID })
                });
                if (editingBookID === book.bookID) {
                    resetForm();
                }
                await loadBooks();
                showMessage(response.message, 'success');
            } catch (error) {
                showMessage(error.message, 'error');
            }
        });

        loadBooks();
    };

    window.ManageBooks = {
        init: init
    };
}());

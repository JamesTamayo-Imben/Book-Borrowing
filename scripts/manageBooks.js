(function () {
    'use strict';

    var categories = {
        KLDIS001: 'Information System',
        KLDPS002: 'Psychology',
        KLDCE003: 'Engineering',
        KLDNS004: 'Nursing',
        KLDMW005: 'Midwifery'
    };

    var pageSize = 10;

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
        var pageInfo = document.getElementById('book-management-page-info');
        var pagination = document.getElementById('book-management-pagination');
        var search = document.getElementById('manage-book-search');
        var categoryFilter = document.getElementById('manage-book-category');
        var clearFilters = document.getElementById('clear-manage-book-filters');
        var editorDialog = document.getElementById('book-editor-dialog');
        var deleteDialog = document.getElementById('book-delete-dialog');
        var deleteDescription = document.getElementById('book-delete-description');
        var deleteError = document.getElementById('book-delete-error');
        var confirmDelete = document.getElementById('confirm-book-delete');
        var idInput = document.getElementById('book-id');
        var saveButton = document.getElementById('save-book-button');
        var editorError = document.getElementById('book-editor-error');
        var token = '';
        var books = [];
        var booksLoaded = false;
        var editingBookID = null;
        var selectedDeleteBook = null;
        var currentPage = 0;
        var editorOpener = null;
        var deleteOpener = null;

        var showMessage = function (text, state) {
            message.textContent = text;
            message.dataset.state = state || '';
        };

        var getFilteredBooks = function () {
            var query = search.value.trim().toLocaleLowerCase();
            var category = categoryFilter.value;
            return books.filter(function (book) {
                var searchable = [
                    book.bookID,
                    book.title,
                    book.author,
                    categories[book.categoryID] || book.categoryID
                ].join(' ').toLocaleLowerCase();
                return (!query || searchable.indexOf(query) !== -1) &&
                    (!category || book.categoryID === category);
            });
        };

        var createPageButton = function (label, page, options) {
            var button = document.createElement('button');
            button.type = 'button';
            button.className = 'library-page-button' + (options && options.current ? ' is-current' : '');
            button.textContent = label;
            button.disabled = Boolean(options && options.disabled);
            if (options && options.current) {
                button.setAttribute('aria-current', 'page');
            }
            if (options && options.ariaLabel) {
                button.setAttribute('aria-label', options.ariaLabel);
            }
            if (page !== null) {
                button.dataset.page = String(page);
            }
            return button;
        };

        var renderPagination = function (totalPages) {
            pagination.replaceChildren();
            if (totalPages < 2) {
                return;
            }

            pagination.appendChild(createPageButton('Previous', currentPage - 1, {
                disabled: currentPage === 0,
                ariaLabel: 'Previous page'
            }));

            var pages = [];
            if (totalPages <= 7) {
                for (var index = 0; index < totalPages; index += 1) {
                    pages.push(index);
                }
            } else {
                pages.push(0);
                var start = Math.max(1, currentPage - 1);
                var end = Math.min(totalPages - 2, currentPage + 1);
                if (start > 1) {
                    pages.push(null);
                }
                for (var page = start; page <= end; page += 1) {
                    pages.push(page);
                }
                if (end < totalPages - 2) {
                    pages.push(null);
                }
                pages.push(totalPages - 1);
            }

            pages.forEach(function (page) {
                if (page === null) {
                    var ellipsis = document.createElement('span');
                    ellipsis.className = 'library-page-ellipsis';
                    ellipsis.textContent = '…';
                    ellipsis.setAttribute('aria-hidden', 'true');
                    pagination.appendChild(ellipsis);
                    return;
                }
                pagination.appendChild(createPageButton(String(page + 1), page, {
                    current: page === currentPage,
                    ariaLabel: 'Page ' + (page + 1)
                }));
            });

            pagination.appendChild(createPageButton('Next', currentPage + 1, {
                disabled: currentPage >= totalPages - 1,
                ariaLabel: 'Next page'
            }));
        };

        var renderBooks = function () {
            if (!booksLoaded) {
                return;
            }
            var filteredBooks = getFilteredBooks();
            var totalPages = Math.ceil(filteredBooks.length / pageSize);
            currentPage = Math.min(currentPage, Math.max(0, totalPages - 1));
            var firstIndex = currentPage * pageSize;
            var visibleBooks = filteredBooks.slice(firstIndex, firstIndex + pageSize);

            rows.replaceChildren();
            count.textContent = filteredBooks.length === books.length
                ? books.length + (books.length === 1 ? ' book' : ' books')
                : filteredBooks.length + ' of ' + books.length + ' books';
            if (!visibleBooks.length) {
                var emptyRow = document.createElement('tr');
                var emptyCell = document.createElement('td');
                emptyCell.className = 'library-management-empty';
                emptyCell.colSpan = 5;
                emptyCell.textContent = books.length
                    ? 'No books match your filters. Try another title or collection.'
                    : 'No books are in the catalog yet.';
                emptyRow.appendChild(emptyCell);
                rows.appendChild(emptyRow);
            } else {
                visibleBooks.forEach(function (book) {
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
            }

            pageInfo.textContent = filteredBooks.length
                ? 'Showing ' + (firstIndex + 1) + ' to ' +
                    Math.min(firstIndex + visibleBooks.length, filteredBooks.length) +
                    ' of ' + filteredBooks.length + ' books'
                : 'No books to show';
            renderPagination(totalPages);
        };

        var loadBooks = async function () {
            booksLoaded = false;
            rows.innerHTML = '<tr><td class="library-management-empty" colspan="5">Loading books…</td></tr>';
            try {
                var response = await request({ credentials: 'same-origin' });
                if (!Array.isArray(response.value) || typeof response.csrfToken !== 'string') {
                    throw new Error('The server returned invalid catalog data.');
                }
                token = response.csrfToken;
                books = response.value;
                booksLoaded = true;
                renderBooks();
                showMessage('', '');
                return true;
            } catch (error) {
                rows.innerHTML = '<tr><td class="library-management-empty" colspan="5">Books could not be loaded.</td></tr>';
                count.textContent = '';
                pageInfo.textContent = '';
                pagination.replaceChildren();
                showMessage(error.message, 'error');
                return false;
            }
        };

        var resetForm = function () {
            form.reset();
            editingBookID = null;
            idInput.disabled = false;
            document.getElementById('book-total-stock').value = '1';
            document.getElementById('book-available-stock').value = '1';
            saveButton.textContent = 'Add book';
            editorError.hidden = true;
            editorError.textContent = '';
            document.getElementById('book-form-heading').textContent = 'Add a book';
        };

        var startEditing = function (book, opener) {
            editingBookID = book.bookID;
            editorOpener = opener;
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
            document.getElementById('book-form-heading').textContent = 'Edit book';
            editorDialog.showModal();
            document.getElementById('book-title').focus();
        };

        document.getElementById('add-book-button').addEventListener('click', function () {
            resetForm();
            editorOpener = this;
            editorDialog.showModal();
            idInput.focus();
        });

        form.addEventListener('submit', async function (event) {
            event.preventDefault();
            var data = new FormData(form);
            var payload = Object.fromEntries(data.entries());
            payload.action = editingBookID ? 'update' : 'create';
            payload.bookID = editingBookID || payload.bookID;
            saveButton.disabled = true;
            editorError.hidden = true;

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
                editorDialog.close();
                if (await loadBooks()) {
                    showMessage(response.message, 'success');
                }
            } catch (error) {
                editorError.textContent = error.message;
                editorError.hidden = false;
            } finally {
                saveButton.disabled = false;
            }
        });

        editorDialog.addEventListener('close', function () {
            resetForm();
            if (editorOpener && editorOpener.isConnected) {
                editorOpener.focus();
            }
        });

        rows.addEventListener('click', function (event) {
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
                startEditing(book, button);
                return;
            }

            selectedDeleteBook = book;
            deleteOpener = button;
            deleteDescription.textContent = '“' + book.title +
                '” will be removed from the catalog. Books with borrowing history cannot be deleted.';
            deleteError.hidden = true;
            deleteError.textContent = '';
            deleteDialog.showModal();
            document.getElementById('close-book-delete').focus();
        });

        deleteDialog.addEventListener('close', function () {
            selectedDeleteBook = null;
            if (deleteOpener && deleteOpener.isConnected) {
                deleteOpener.focus();
            }
        });

        confirmDelete.addEventListener('click', async function () {
            if (!selectedDeleteBook) {
                return;
            }
            confirmDelete.disabled = true;
            deleteError.hidden = true;
            try {
                var response = await request({
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': token
                    },
                    body: JSON.stringify({
                        action: 'delete',
                        bookID: selectedDeleteBook.bookID
                    })
                });
                deleteDialog.close();
                if (await loadBooks()) {
                    showMessage(response.message, 'success');
                }
            } catch (error) {
                deleteError.textContent = error.message;
                deleteError.hidden = false;
            } finally {
                confirmDelete.disabled = false;
            }
        });

        document.querySelectorAll('[data-close-book-dialog]').forEach(function (button) {
            button.addEventListener('click', function () {
                var dialog = button.closest('dialog');
                if (dialog && dialog.open) {
                    dialog.close();
                }
            });
        });

        [editorDialog, deleteDialog].forEach(function (dialog) {
            dialog.addEventListener('click', function (event) {
                if (event.target === dialog) {
                    dialog.close();
                }
            });
            dialog.addEventListener('keydown', function (event) {
                if (event.key === 'Escape') {
                    event.preventDefault();
                    dialog.close();
                }
            });
        });

        search.addEventListener('input', function () {
            currentPage = 0;
            renderBooks();
        });
        categoryFilter.addEventListener('change', function () {
            currentPage = 0;
            renderBooks();
        });
        clearFilters.addEventListener('click', function () {
            search.value = '';
            categoryFilter.value = '';
            currentPage = 0;
            renderBooks();
            search.focus();
        });
        pagination.addEventListener('click', function (event) {
            var button = event.target.closest('button[data-page]');
            if (!button || button.disabled) {
                return;
            }
            currentPage = Number(button.dataset.page);
            renderBooks();
        });

        loadBooks();
    };

    window.ManageBooks = {
        init: init
    };
}());

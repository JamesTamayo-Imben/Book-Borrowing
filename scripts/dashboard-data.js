(function () {
    'use strict';

    var escapeHtml = function (value) {
        return String(value == null ? '' : value).replace(/[&<>"']/g, function (character) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[character];
        });
    };

    var renderBooks = function (books, container) {
        if (!Array.isArray(books) || books.length === 0) {
            container.innerHTML = '<p class="library-empty">No books have been added to the catalog yet</p>';
            return;
        }

        container.innerHTML = books.map(function (book) {
            var cover = escapeHtml(book.image || 'publics/img/default.jpg');
            var title = escapeHtml(book.title);
            var author = escapeHtml(book.author || 'Author not listed');
            var stock = Number(book.availableStock) || 0;
            var status = stock > 0 ? stock + (stock === 1 ? ' copy available' : ' copies available') : 'Currently unavailable';
            return '<article class="library-book">' +
                '<img src="' + cover + '" alt="Cover of ' + title + '" loading="lazy">' +
                '<div class="library-book-copy"><h3>' + title + '</h3>' +
                '<p>' + author + '</p><span>' + status + '</span></div></article>';
        }).join('');

        container.querySelectorAll('img').forEach(function (image) {
            image.addEventListener('error', function () {
                image.src = 'publics/img/default.jpg';
            }, { once: true });
        });
    };

    var loadCatalog = function (container) {
        fetch('catalog.php', { credentials: 'same-origin' })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Unable to load books (' + response.status + ').');
                }
                return response.json();
            })
            .then(function (response) {
                renderBooks(response.value, container);
                container.removeAttribute('aria-busy');
            })
            .catch(function (error) {
                console.error('Catalog request failed:', error);
                container.removeAttribute('aria-busy');
                container.innerHTML = '<p class="library-error" role="alert">The catalog could not be loaded. Refresh to try again</p>';
            });
    };

    var loadOverview = function () {
        var root = document.getElementById('library-overview');
        if (!root) {
            return;
        }

        fetch('dashboardOverview.php', { credentials: 'same-origin' })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Unable to load dashboard (' + response.status + ').');
                }
                return response.json();
            })
            .then(function (data) {
                var stats = data.stats;
                var totalCopies = Number(stats.totalCopies) || 0;
                var availableCopies = Number(stats.availableCopies) || 0;
                var borrowedCopies = Math.max(0, totalCopies - availableCopies);
                var availablePercent = totalCopies > 0 ? Math.round((availableCopies / totalCopies) * 100) : 0;

                root.querySelectorAll('[data-stat="titles"]').forEach(function (element) {
                    element.textContent = Number(stats.titleCount) || 0;
                });
                root.querySelectorAll('[data-stat="available"]').forEach(function (element) {
                    element.textContent = availableCopies;
                });
                root.querySelectorAll('[data-stat="loans"]').forEach(function (element) {
                    element.textContent = Number(stats.activeLoans) || 0;
                });
                root.querySelectorAll('[data-stat="students"]').forEach(function (element) {
                    element.textContent = Number(stats.studentCount) || 0;
                });
                root.querySelectorAll('[data-stat="overdue"]').forEach(function (element) {
                    element.textContent = Number(stats.overdueLoans) || 0;
                });
                root.querySelectorAll('[data-stat="availability-percent"]').forEach(function (element) {
                    element.textContent = availablePercent + '%';
                });
                root.querySelectorAll('[data-stat="availability-bar"]').forEach(function (element) {
                    element.style.transform = 'scaleX(' + (availablePercent / 100) + ')';
                    element.parentElement.setAttribute('aria-valuemax', totalCopies);
                    element.parentElement.setAttribute('aria-valuenow', availableCopies);
                });

                var categoryList = root.querySelector('#category-breakdown');
                if (!data.categories.length) {
                    categoryList.innerHTML = '<p class="library-empty">Add books to see collection availability</p>';
                } else {
                    categoryList.innerHTML = data.categories.map(function (category) {
                        var total = Number(category.totalCopies) || 0;
                        var available = Number(category.availableCopies) || 0;
                        var percent = total > 0 ? Math.round((available / total) * 100) : 0;
                        return '<div class="category-row">' +
                            '<div class="category-heading"><span>' + escapeHtml(category.categoryName) +
                            '</span><span>' + available + ' of ' + total + ' copies</span></div>' +
                            '<div class="category-track" role="progressbar" aria-label="' +
                            escapeHtml(category.categoryName) + ' available copies" aria-valuemin="0" ' +
                            'aria-valuemax="' + total + '" aria-valuenow="' + available + '">' +
                            '<span style="width:' + percent + '%"></span></div></div>';
                    }).join('');
                }

                renderBooks(data.books, root.querySelector('#dashboard-books'));

                var profileName = (data.profile.name || data.profile.username).trim();
                document.querySelectorAll('.js-profile-name').forEach(function (element) {
                    element.textContent = profileName;
                });
                root.removeAttribute('aria-busy');
            })
            .catch(function (error) {
                console.error('Dashboard request failed:', error);
                root.removeAttribute('aria-busy');
                var message = root.querySelector('#dashboard-error');
                if (message) {
                    message.hidden = false;
                    message.textContent = 'Dashboard data could not be loaded. Refresh to try again';
                }
            });
    };

    document.addEventListener('DOMContentLoaded', function () {
        var overview = document.getElementById('library-overview');
        if (overview) {
            overview.setAttribute('aria-busy', 'true');
            loadOverview();
        }

        var catalog = document.getElementById('user-book-catalog');
        if (catalog) {
            loadCatalog(catalog);
        }
    });
}());

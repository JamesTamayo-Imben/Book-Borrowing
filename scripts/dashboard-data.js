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

    var researchedBookDetails = {
        'the pragmatic programmer: your journey to mastery': {
            firstPublished: '1999',
            summary: 'The Open Library record describes this as a work on programming practice, problem solving, and professional software development.',
            source: 'https://openlibrary.org/works/OL5748544W'
        },
        'c# game programming cookbook for unity 3d': {
            summary: 'The Open Library record groups this work with Unity, C#, and game programming.',
            source: 'https://openlibrary.org/works/OL19547573W'
        },
        'clean code': {
            firstPublished: '2008',
            summary: 'The Open Library record identifies this work with computer software and software craftsmanship.',
            source: 'https://openlibrary.org/works/OL17618370W'
        },
        'introduction to algorithms': {
            summary: 'The Open Library record describes a reference focused on algorithms and computer programming.',
            source: 'https://openlibrary.org/works/OL4781294W'
        },
        'forty studies that changed psychology': {
            firstPublished: '1992',
            summary: 'The Open Library record covers influential psychology studies and their methods and findings.',
            source: 'https://openlibrary.org/works/OL1845342W'
        },
        'exploring psychology': {
            firstPublished: '1990',
            summary: 'The Open Library record classifies this work as an introductory psychology textbook.',
            source: 'https://openlibrary.org/works/OL14859349W'
        },
        'abnormal psychology': {
            firstPublished: '1992',
            summary: 'The Open Library record identifies this work with pathological psychology and textbook study.',
            source: 'https://openlibrary.org/works/OL2035675W'
        },
        'civil engineering formulas': {
            firstPublished: '2001',
            summary: 'The Open Library record lists this as a civil engineering reference work.',
            source: 'https://openlibrary.org/works/OL280480W'
        },
        'the tower and the bridge': {
            firstPublished: '1983',
            summary: 'The Open Library record covers structural engineering, bridge and tower design, and their aesthetics.',
            source: 'https://openlibrary.org/works/OL15840572W'
        },
        'why buildings fall down': {
            firstPublished: '1992',
            summary: 'This work examines historical structural failures and the engineering lessons they reveal.',
            source: 'https://openlibrary.org/works/OL3350803W'
        }
    };

    var categoryNames = {
        KLDIS001: 'Information systems',
        KLDPS002: 'Psychology',
        KLDCE003: 'Engineering',
        KLDNS004: 'Nursing',
        KLDMW005: 'Midwifery'
    };

    var fillBookDetails = function (book) {
        var dialog = document.getElementById('library-book-dialog');
        if (!dialog) {
            return;
        }

        var title = String(book.title || 'Untitled book');
        var author = String(book.author || 'Author not listed');
        var available = Number(book.availableStock) || 0;
        var total = Number(book.totalStock) || 0;
        var researched = researchedBookDetails[title.trim().toLocaleLowerCase()];
        var cover = document.getElementById('library-book-dialog-cover');
        var description = document.getElementById('library-book-dialog-description');
        var context = document.getElementById('library-book-dialog-context');
        var source = document.getElementById('library-book-dialog-source');
        var availability = document.getElementById('library-book-dialog-availability');
        var details = document.getElementById('library-book-dialog-details');

        document.getElementById('library-book-dialog-title').textContent = title;
        document.getElementById('library-book-dialog-author').textContent = author;
        cover.src = book.image || 'publics/img/default.jpg';
        cover.alt = 'Cover of ' + title;
        cover.onerror = function () {
            cover.src = 'publics/img/default.jpg';
            cover.onerror = null;
        };
        availability.textContent = available > 0
            ? available + (available === 1 ? ' copy available' : ' copies available')
            : 'Currently unavailable';
        availability.classList.toggle('is-unavailable', available === 0);
        description.textContent = book.description || 'No description is available in the catalog.';
        context.hidden = !researched;
        context.textContent = researched ? researched.summary : '';
        source.hidden = !researched;
        source.href = researched ? researched.source : '#';

        var rows = [
            ['Book ID', book.bookID || 'Not listed'],
            ['Collection', categoryNames[book.categoryID] || book.categoryID || 'Not listed'],
            ['Publication date', book.publishedDate || 'Not listed in the catalog'],
            ['Available copies', available],
            ['Total copies', total]
        ];
        if (researched && researched.firstPublished) {
            rows.push(['Work first published', researched.firstPublished]);
        }
        details.replaceChildren();
        rows.forEach(function (row) {
            var term = document.createElement('dt');
            var value = document.createElement('dd');
            term.textContent = row[0];
            value.textContent = String(row[1]);
            details.append(term, value);
        });

        dialog.showModal();
    };

    var renderBooks = function (books, container) {
        if (!Array.isArray(books) || books.length === 0) {
            container.innerHTML = '<p class="library-empty">No books have been added to the catalog yet</p>';
            return;
        }

        container.replaceChildren();
        books.forEach(function (book) {
            var cover = book.image || 'publics/img/default.jpg';
            var title = String(book.title || 'Untitled book');
            var author = String(book.author || 'Author not listed');
            var stock = Number(book.availableStock) || 0;
            var status = stock > 0 ? stock + (stock === 1 ? ' copy available' : ' copies available') : 'Currently unavailable';
            var card = document.createElement('button');
            var image = document.createElement('img');
            var copy = document.createElement('span');
            var heading = document.createElement('span');
            var authorLine = document.createElement('span');
            var availabilityLine = document.createElement('span');

            card.type = 'button';
            card.className = 'library-book library-book-trigger';
            card.setAttribute('aria-label', 'View details for ' + title);
            image.src = cover;
            image.alt = 'Cover of ' + title;
            image.loading = 'lazy';
            copy.className = 'library-book-copy';
            heading.className = 'library-book-title';
            heading.textContent = title;
            authorLine.className = 'library-book-author';
            authorLine.textContent = author;
            availabilityLine.className = 'library-book-availability';
            availabilityLine.textContent = status;
            copy.append(heading, authorLine, availabilityLine);
            card.append(image, copy);
            card.addEventListener('click', function () {
                fillBookDetails(book);
            });
            container.append(card);

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

    var loadNotificationCount = function () {
        var badges = document.querySelectorAll('[data-notification-count]');
        if (!badges.length) {
            return;
        }

        fetch('notificationCount.php', { credentials: 'same-origin' })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Unable to load notification count (' + response.status + ').');
                }
                return response.json();
            })
            .then(function (data) {
                var count = Number(data.count);
                if (!Number.isInteger(count) || count < 0) {
                    throw new Error('Notification count response was invalid.');
                }
                badges.forEach(function (badge) {
                    badge.textContent = String(count);
                    badge.setAttribute('aria-label', count + (count === 1 ? ' notification' : ' notifications'));
                    badge.hidden = count === 0;
                });
            })
            .catch(function (error) {
                console.error('Notification count request failed:', error);
                badges.forEach(function (badge) {
                    badge.textContent = '!';
                    badge.title = 'Notification count unavailable';
                    badge.setAttribute('aria-label', 'Notification count unavailable');
                    badge.hidden = false;
                });
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
        loadNotificationCount();
        window.addEventListener('notifications:changed', loadNotificationCount);

        var bookDialog = document.getElementById('library-book-dialog');
        if (bookDialog) {
            bookDialog.querySelector('[data-close-book-dialog]').addEventListener('click', function () {
                bookDialog.close();
            });
            bookDialog.addEventListener('click', function (event) {
                if (event.target === bookDialog) {
                    bookDialog.close();
                }
            });
        }

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

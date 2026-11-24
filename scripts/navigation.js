(function ($) {
    'use strict';

    var routes = {
        offdashboard: { page: 'dashboard.html', reload: true },
        dashboard: { page: 'dashboard.html', reload: true },
        offdashboardUser: { page: 'dashboardUser.html', reload: true },
        dashboardUser: { page: 'dashboardUser.html', reload: true },
        userList: { page: 'userList.html', admin: true },
        offuserList: { page: 'userList.html', admin: true },
        shortcutUser: { page: 'userList.html', admin: true },
        userRegistration: { page: 'userRegistration.html', admin: true },
        offuserRegistration: { page: 'userRegistration.html', admin: true },
        registeruser: { page: 'userRegistration.html', admin: true },
        offregisteruser: { page: 'userRegistration.html', admin: true },
        'student-register-link': { page: 'userRegistration.html', admin: true },
        bookList: { page: 'bookCards.html' },
        bookListUser: { page: 'bookCardsUser.html' },
        shortcutBook: { page: 'bookCards.html' },
        manageBooks: { page: 'manageBooks.html', admin: true },
        offmanageBooks: { page: 'manageBooks.html', admin: true },
        shortcutManageBooks: { page: 'manageBooks.html', admin: true },
        borrowedBook: { page: 'borrowedBook.html' },
        offborrowedBook: { page: 'borrowedBook.html' },
        borrowedBookUser: { page: 'borrowedBookUser.html' },
        'borrowedBook-User': { page: 'borrowedBookUser.html' },
        'offborrowedBook-User': { page: 'borrowedBookUser.html' },
        overdueBook: { page: 'overdueBook.html' },
        offoverdueBook: { page: 'overdueBook.html' },
        logs: { page: 'history.html' },
        offlogs: { page: 'history.html' },
        notification: { page: 'notif.html' },
        offnotification: { page: 'notif.html' },
        studentInfo: { page: 'personalInfo.html' },
        offstudentInfo: { page: 'personalInfo.html' },
        'shortcut-book': { page: 'bookCards.html' },
        'shortcut-user': { page: 'userList.html', admin: true }
    };

    var sessionRole = null;
    var dataTablesLoad = null;
    var manageBooksLoad = null;
    var catalogObservers = [];

    var loadScript = function (source) {
        return new Promise(function (resolve, reject) {
            var script = document.createElement('script');
            script.src = source;
            script.onload = resolve;
            script.onerror = function () {
                reject(new Error('Unable to load ' + source));
            };
            document.head.appendChild(script);
        });
    };

    var ensureDataTables = function () {
        if ($.fn.DataTable) {
            return Promise.resolve();
        }
        if (!dataTablesLoad) {
            dataTablesLoad = loadScript('publics/plugins/datatable/js/jquery.dataTables.js')
                .then(function () {
                    return loadScript('publics/plugins/datatable/js/dataTables.bootstrap.js');
                });
        }
        return dataTablesLoad;
    };

    var ensureManageBooks = function () {
        if (window.ManageBooks) {
            return Promise.resolve();
        }
        if (!manageBooksLoad) {
            manageBooksLoad = loadScript('scripts/manageBooks.js');
        }
        return manageBooksLoad;
    };

    var initializeBookCards = function () {
        ['bookCardInfo1', 'bookCardInfo2', 'bookCardInfo3', 'bookCardInfo4', 'bookCardInfo5']
            .forEach(function (name) {
                var bookCard = window[name];
                if (!bookCard || typeof bookCard.init !== 'function') {
                    throw new Error('Book list component ' + name + ' could not be initialized.');
                }
                bookCard.init();
            });
    };

    var initializeCatalogFilters = function (content) {
        disconnectCatalogObservers();

        var catalog = content.querySelector('.library-catalog');
        if (!catalog) {
            return;
        }

        var search = catalog.querySelector('#catalog-search');
        var categoryFilter = catalog.querySelector('#catalog-category');
        var availabilityFilter = catalog.querySelector('#catalog-availability');
        var result = catalog.querySelector('#catalog-result');
        var emptyState = catalog.querySelector('#catalog-no-results');
        var sections = Array.from(catalog.querySelectorAll('.library-catalog-section'));

        var applyFilters = function () {
            var query = search.value.trim().toLocaleLowerCase();
            var category = categoryFilter.value;
            var availability = availabilityFilter.value;
            var filtering = Boolean(query || category || availability);
            var matchedBooks = 0;

            sections.forEach(function (section) {
                var sectionMatches = 0;
                var sectionCategory = section.dataset.categoryId;
                var cards = section.querySelectorAll('.book-cards > .col-lg-6');

                cards.forEach(function (card) {
                    var title = card.querySelector('h4')?.textContent || '';
                    var details = card.querySelector('.borrow-card');
                    var author = details?.querySelector('h6')?.textContent || '';
                    var description = card.querySelector('.text-multiline-ellipsis')?.textContent || '';
                    var availableLabel = Array.from(details?.querySelectorAll('h6') || [])
                        .find(function (heading) {
                            return /available copies/i.test(heading.textContent);
                        });
                    var copies = Number(availableLabel?.querySelector('strong')?.textContent || 0);
                    var searchable = [title, author, description].join(' ').toLocaleLowerCase();
                    var matches = (!query || searchable.includes(query)) &&
                        (!category || category === sectionCategory) &&
                        (!availability || (availability === 'available' ? copies > 0 : copies === 0));

                    card.hidden = !matches;
                    if (matches) {
                        sectionMatches += 1;
                        matchedBooks += 1;
                    }
                });

                if (filtering) {
                    section.hidden = sectionMatches === 0;
                    if (sectionMatches > 0) {
                        var box = section.querySelector('.category-box');
                        var toggle = section.querySelector('.category-toggle');
                        box.hidden = false;
                        toggle.setAttribute('aria-expanded', 'true');
                        toggle.setAttribute(
                            'aria-label',
                            'Hide ' + section.querySelector('.library-category-heading h2').textContent.trim()
                        );
                        toggle.querySelector('i').className = 'bi bi-arrow-down-square';
                    }
                } else {
                    section.hidden = false;
                    cards.forEach(function (card) {
                        card.hidden = false;
                    });
                }
            });

            result.textContent = filtering
                ? matchedBooks + (matchedBooks === 1 ? ' book matches' : ' books match') + ' your filters'
                : matchedBooks + (matchedBooks === 1 ? ' book in the catalog' : ' books in the catalog');
            emptyState.hidden = !filtering || matchedBooks > 0;
        };

        search.addEventListener('input', applyFilters);
        categoryFilter.addEventListener('change', applyFilters);
        availabilityFilter.addEventListener('change', applyFilters);
        catalog.querySelector('#clear-catalog-filters').addEventListener('click', function () {
            search.value = '';
            categoryFilter.value = '';
            availabilityFilter.value = '';
            applyFilters();
            search.focus();
        });

        sections.forEach(function (section) {
            var container = section.querySelector('.book-cards');
            var observer = new MutationObserver(applyFilters);
            observer.observe(container, { childList: true, subtree: true });
            catalogObservers.push(observer);
        });
        applyFilters();
    };

    var disconnectCatalogObservers = function () {
        catalogObservers.forEach(function (observer) {
            observer.disconnect();
        });
        catalogObservers = [];
    };

    var loadPage = function (page) {
        disconnectCatalogObservers();
        var content = $('#main-content');
        if (!content.length) {
            window.location.href = page;
            return;
        }

        var renderPage = function () {
            content.attr('aria-busy', 'true').load(page, function (response, status) {
                content.removeAttr('aria-busy');
                if (status === 'error') {
                    content.html(
                        '<section class="library-error" role="alert">' +
                        '<h1>Page unavailable</h1>' +
                        '<p>This page could not be loaded. Check the server and try again.</p>' +
                        '</section>'
                    );
                    return;
                }

                if (page === 'bookCards.html' || page === 'bookCardsUser.html') {
                    try {
                        initializeBookCards();
                        initializeCatalogFilters(content[0]);
                    } catch (error) {
                        console.error('Book list initialization failed:', error);
                        content.html(
                            '<section class="library-error" role="alert">' +
                            '<h1>Books unavailable</h1>' +
                            '<p>The book list could not be initialized. Refresh and try again.</p>' +
                            '</section>'
                        );
                        return;
                    }
                }

                if (page === 'manageBooks.html' && window.ManageBooks) {
                    window.ManageBooks.init();
                }

                var offcanvas = document.getElementById('offcanvasExample');
                if (offcanvas && window.bootstrap && window.bootstrap.Offcanvas) {
                    var instance = window.bootstrap.Offcanvas.getInstance(offcanvas);
                    if (instance) {
                        instance.hide();
                    }
                }
            });
        };

        if (page === 'manageBooks.html') {
            ensureManageBooks().then(renderPage).catch(function (error) {
                console.error('Book management could not be loaded:', error);
                content.removeAttr('aria-busy').html(
                    '<section class="library-error" role="alert">' +
                    '<h1>Book management unavailable</h1>' +
                    '<p>The book management tools could not be loaded. Refresh and try again.</p>' +
                    '</section>'
                );
            });
            return;
        }

        if (['userList.html', 'borrowedBook.html', 'overdueBook.html', 'history.html'].indexOf(page) === -1) {
            renderPage();
            return;
        }

        ensureDataTables().then(renderPage).catch(function (error) {
            console.error('Table support could not be loaded:', error);
            content.removeAttr('aria-busy').html(
                '<section class="library-error" role="alert">' +
                '<h1>Page unavailable</h1>' +
                '<p>Table support could not be loaded. Refresh and try again.</p>' +
                '</section>'
            );
        });
    };

    var syncActiveNavigation = function (page) {
        document.querySelectorAll('.sidebar-nav .sidebar-link[id]').forEach(function (link) {
            var route = routes[link.id];
            if (link.id === 'bookList' || link.id === 'offbookList') {
                route = { page: sessionRole === 'admin' ? 'bookCards.html' : 'bookCardsUser.html' };
            }

            var isActive = Boolean(route && route.page === page);
            if (isActive) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }

            var dropdown = link.closest('.sidebar-dropdown');
            if (isActive && dropdown) {
                dropdown.classList.add('show');
                document.querySelectorAll('[data-bs-target="#' + dropdown.id + '"]').forEach(function (toggle) {
                    toggle.setAttribute('aria-expanded', 'true');
                    toggle.classList.remove('collapsed');
                });
            }
        });
    };

    $(document).on('click', 'a[id], button[id]', function (event) {
        var id = this.id;
        if (id === 'logout' || id === 'offlogout') {
            event.preventDefault();
            window.location.href = 'logout.php';
            return;
        }

        var currentRole = sessionRole ||
            (window.location.pathname.endsWith('/dashboard.html') ? 'admin' : 'user');
        var route = id === 'offbookList'
            ? { page: currentRole === 'admin' ? 'bookCards.html' : 'bookCardsUser.html' }
            : routes[id];
        if (!route) {
            return;
        }

        event.preventDefault();
        if (route.admin && currentRole !== 'admin') {
            window.location.replace('dashboardUser.html');
            return;
        }
        syncActiveNavigation(route.page);
        if (route.reload) {
            window.location.href = route.page;
        } else {
            loadPage(route.page);
        }
    });

    $(document).on('click', '.category-toggle', function () {
        var panel = document.getElementById(this.getAttribute('aria-controls'));
        if (!panel) {
            return;
        }

        var expanded = this.getAttribute('aria-expanded') === 'true';
        var sectionTitle = this.closest('.library-catalog-section')
            .querySelector('.library-category-heading h2').textContent.trim();
        this.setAttribute('aria-expanded', String(!expanded));
        this.setAttribute('aria-label', (expanded ? 'Show ' : 'Hide ') + sectionTitle);
        panel.hidden = expanded;
        this.querySelector('i').className = expanded
            ? 'bi bi-arrow-right-square'
            : 'bi bi-arrow-down-square';
    });

    $(document).on('click', '.book-cover-button', function () {
        var dialog = document.getElementById('book-cover-dialog');
        var cover = this.querySelector('img');
        if (!dialog || !cover) {
            console.error('Book cover preview could not be opened.');
            return;
        }

        var preview = dialog.querySelector('img');
        var title = dialog.querySelector('p');
        preview.src = cover.currentSrc || cover.src;
        preview.alt = cover.alt;
        title.textContent = cover.alt.replace(/^Cover of\s*/i, '');
        dialog.showModal();
    });

    $(document).on('click', '.book-cover-dialog', function (event) {
        if (event.target === this) {
            this.close();
        }
    });

    $(function () {
        $.getJSON('checkSession.php')
            .done(function (session) {
                if (!session.isSuccess) {
                    window.location.replace('logIn.html');
                    return;
                }

                sessionRole = session.role;
                syncActiveNavigation(
                    window.location.pathname.endsWith('/dashboardUser.html')
                        ? 'dashboardUser.html'
                        : 'dashboard.html'
                );
                var isAdminPage = window.location.pathname.endsWith('/dashboard.html');
                if (isAdminPage && session.role !== 'admin') {
                    window.location.replace('dashboardUser.html');
                } else if (!isAdminPage && window.location.pathname.endsWith('/dashboardUser.html') &&
                    session.role === 'admin') {
                    window.location.replace('dashboard.html');
                }

                var profileName = [session.firstName, session.lastName]
                    .filter(Boolean)
                    .join(' ') || session.username;
                document.querySelectorAll('.js-profile-name').forEach(function (element) {
                    element.textContent = profileName;
                });
                document.querySelectorAll('[data-session-student-id]').forEach(function (element) {
                    element.textContent = session.studentID || '';
                });
                ['studentID', 'studentID1'].forEach(function (id) {
                    var element = document.getElementById(id);
                    if (element) {
                        element.textContent = session.studentID || '';
                    }
                });
                ['studentEmail', 'studentEmail1'].forEach(function (id) {
                    var element = document.getElementById(id);
                    if (element) {
                        element.textContent = session.email || '';
                    }
                });
            })
            .fail(function () {
                window.location.replace('logIn.html');
            });
    });
}(jQuery));

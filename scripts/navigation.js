(function ($) {
    'use strict';

    var routes = {
        offdashboard: { page: 'dashboard.html', reload: true },
        dashboard: { page: 'dashboard.html', reload: true },
        offdashboardUser: { page: 'dashboardUser.html', reload: true },
        dashboardUser: { page: 'dashboardUser.html', reload: true },
        userList: { page: 'userList.html' },
        offuserList: { page: 'userList.html' },
        shortcutUser: { page: 'userList.html' },
        userRegistration: { page: 'userRegistration.html' },
        offuserRegistration: { page: 'userRegistration.html' },
        registeruser: { page: 'userRegistration.html' },
        offregisteruser: { page: 'userRegistration.html' },
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
        'shortcut-user': { page: 'userList.html' }
    };

    var sessionRole = null;
    var dataTablesLoad = null;
    var manageBooksLoad = null;

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

    var loadPage = function (page) {
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

'use strict';

var loadBorrowTab = function(page, initialize) {
    var container = $('#borrow-types');
    container
        .attr('aria-busy', 'true')
        .html('<p class="borrow-results-state">Loading the selected books...</p>');

    $.get(page)
        .done(function(data) {
            container.html(data).attr('aria-busy', 'false');
            $('#viewstitle').empty();

            if (typeof initialize !== 'function') {
                console.error('Borrowed-book filter has no initializer:', page);
                container.html(
                    '<p class="borrow-results-state borrow-results-state--error" role="alert">' +
                    'This borrowed-book filter could not be initialized. Refresh and try again.' +
                    '</p>'
                );
                return;
            }

            if (initialize() === false) {
                container.html(
                    '<p class="borrow-results-state borrow-results-state--error" role="alert">' +
                    'This borrowed-book filter could not be initialized. Refresh and try again.' +
                    '</p>'
                );
            }
        })
        .fail(function(xhr, status, error) {
            console.error('Borrowed-book filter request failed:', page, error);
            container
                .attr('aria-busy', 'false')
                .html(
                    '<p class="borrow-results-state borrow-results-state--error" role="alert">' +
                    'This borrowed-book filter could not be loaded. Refresh and try again.' +
                    '</p>'
                );
        });
};

var initializeBorrowLists = function(names) {
    for (var index = 0; index < names.length; index += 1) {
        var name = names[index];
        var list = window[name];
        if (!list || typeof list.init !== 'function') {
            console.error('Borrowed-book list component could not be initialized:', name);
            return false;
        }
        list.init();
    }
    return true;
};

$('#borrow-all').on('click', function() {
    loadBorrowTab('borrowAll.html', function() {
        return initializeBorrowLists(['returnUpdate1', 'returnUpdate1B']);
    });
});

$('#borrow-is').on('click', function() {
    loadBorrowTab('borrowIS.html', function() {
        return initializeBorrowLists(['returnUpdate2']);
    });
});

$('#borrow-psy').on('click', function() {
    loadBorrowTab('borrowPsy.html', function() {
        return initializeBorrowLists(['returnUpdate3']);
    });
});

$('#borrow-ce').on('click', function() {
    loadBorrowTab('borrowCE.html', function() {
        return initializeBorrowLists(['returnUpdate4']);
    });
});

$('#borrow-ns').on('click', function() {
    loadBorrowTab('borrowNS.html', function() {
        return initializeBorrowLists(['returnUpdate5']);
    });
});

$('#borrow-mw').on('click', function() {
    loadBorrowTab('borrowMW.html', function() {
        return initializeBorrowLists(['returnUpdate6']);
    });
});

$('#borrow-over').on('click', function() {
    loadBorrowTab('borrowOver.html', function() {
        return initializeBorrowLists(['returnUpdate7']);
    });
});

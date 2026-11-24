(function ($) {
    'use strict';

    $(function () {
        var page = document.querySelector('[data-record-view]');
        if (!page) {
            return;
        }

        if (!$.fn.DataTable || !$.fn.DataTable.isDataTable('#encounter')) {
            console.error('Record filters could not be initialized: record table is unavailable.');
            return;
        }

        var table = $('#encounter').DataTable();
        var controls = page.querySelectorAll('[data-record-filter]');
        var transactionFilter = page.querySelector('[data-transaction-filter]');

        var applyFilters = function () {
            controls.forEach(function (control) {
                var columnIndex = Number(control.getAttribute('data-record-filter'));
                var value = control.value.trim();
                if (control.hasAttribute('data-exact-match') && value) {
                    value = '^' + $.fn.dataTable.util.escapeRegex(value) + '$';
                    table.column(columnIndex).search(value, true, false);
                } else {
                    table.column(columnIndex).search(value, false, false);
                }
            });

            if (transactionFilter) {
                var transaction = transactionFilter.value;
                var match = transaction
                    ? '^' + $.fn.dataTable.util.escapeRegex(transaction) + '$'
                    : '';
                table.column(Number(transactionFilter.getAttribute('data-transaction-filter')))
                    .search(match, Boolean(transaction), false);
            }
            table.draw();
        };

        controls.forEach(function (control) {
            control.addEventListener(
                control.tagName === 'SELECT' || control.type === 'date' ? 'change' : 'input',
                applyFilters
            );
        });
        if (transactionFilter) {
            transactionFilter.addEventListener('change', applyFilters);
        }

        var clearButton = page.querySelector('[data-clear-record-filters]');
        if (clearButton) {
            clearButton.addEventListener('click', function () {
                controls.forEach(function (control) {
                    control.value = '';
                });
                if (transactionFilter) {
                    transactionFilter.value = '';
                }
                applyFilters();
            });
        }

        if (transactionFilter) {
            var populateTransactions = function () {
                var selectedValue = transactionFilter.value;
                var columnIndex = Number(transactionFilter.getAttribute('data-transaction-filter'));
                var values = table.column(columnIndex, { search: 'none' }).data().unique().sort().toArray();
                transactionFilter.replaceChildren(new Option('All transaction types', ''));
                values.forEach(function (value) {
                    var label = String(value).trim();
                    if (label) {
                        transactionFilter.add(new Option(label, label));
                    }
                });
                transactionFilter.value = selectedValue;
            };

            table.off('draw.dt.recordFilters').on('draw.dt.recordFilters', populateTransactions);
            populateTransactions();
        }
    });
}(jQuery));
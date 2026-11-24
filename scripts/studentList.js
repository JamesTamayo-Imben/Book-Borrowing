(function ($) {
    'use strict';

    var table;
    var page = document.querySelector('.student-list-page');
    var dialog = document.getElementById('student-edit-dialog');
    var message = document.getElementById('student-list-message');

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

    var showMessage = function (text, kind) {
        message.textContent = text;
        message.className = 'account-message' + (text ? ' account-message--' + kind : '');
    };

    var sendAction = function (payload) {
        return $.ajax({
            url: 'studentList.php',
            method: 'POST',
            data: payload,
            dataType: 'json'
        });
    };

    var clearDialogError = function () {
        var existingError = dialog.querySelector('.student-dialog-error');
        if (existingError) {
            existingError.remove();
        }
    };

    var showDialogError = function (text) {
        clearDialogError();
        var error = document.createElement('p');
        error.className = 'student-dialog-error';
        error.setAttribute('role', 'alert');
        error.textContent = text;
        dialog.querySelector('form').prepend(error);
    };

    var openEditDialog = function (student) {
        clearDialogError();
        document.getElementById('edit-student-id').value = student.studentID;
        document.getElementById('edit-student-gender').value = student.gender.toLowerCase();
        document.getElementById('edit-student-contact').value = student.contactNumber;
        document.getElementById('edit-student-email').value = student.email;
        document.getElementById('edit-student-institution').value = student.institution;
        dialog.showModal();
        document.getElementById('edit-student-gender').focus();
    };

    var initialize = function () {
        if (!page || !dialog) {
            return;
        }
        if (!$.fn.DataTable) {
            showMessage('The student table could not be initialized. Refresh and try again.', 'error');
            console.error('Student list initialization failed: DataTables is unavailable.');
            return;
        }

        table = $('#encounter').DataTable({
            ajax: {
                url: 'studentList.php',
                dataSrc: function (response) {
                    if (!response || !response.isSuccess || !Array.isArray(response.value)) {
                        showMessage(response && response.msg ? response.msg : 'Student records could not be loaded.', 'error');
                        return [];
                    }
                    return response.value;
                },
                error: function () {
                    showMessage('Student records could not be loaded. Check your connection and try again.', 'error');
                }
            },
            dom: 'rt<"record-table-footer"ip>',
            pageLength: 10,
            lengthChange: false,
            order: [[0, 'asc']],
            language: {
                emptyTable: 'No students have been registered yet.',
                zeroRecords: 'No students match these filters.',
                loadingRecords: 'Loading student records…',
                info: 'Showing _START_ to _END_ of _TOTAL_ students',
                infoEmpty: 'No students to show',
                paginate: {
                    previous: 'Previous',
                    next: 'Next'
                }
            },
            columns: [
                { data: 'studentID', render: escapeHtml },
                {
                    data: 'gender',
                    render: function (value) {
                        var label = String(value || '');
                        return escapeHtml(label.charAt(0).toUpperCase() + label.slice(1).toLowerCase());
                    }
                },
                { data: 'contactNumber', render: escapeHtml },
                { data: 'email', render: escapeHtml },
                { data: 'institution', render: escapeHtml },
                {
                    data: null,
                    orderable: false,
                    searchable: false,
                    render: function (value, type, student) {
                        var id = escapeHtml(student.studentID);
                        return '<div class="student-row-actions">' +
                            '<button type="button" class="student-action-button student-action-edit" data-student-action="edit" data-student-id="' + id + '">Edit</button>' +
                            '<button type="button" class="student-action-button student-action-delete" data-student-action="delete" data-student-id="' + id + '">Delete</button>' +
                            '</div>';
                    }
                }
            ]
        });

        $('#student-search').on('input.studentList', function () {
            table.search(this.value).draw();
        });
        $('#student-gender-filter').on('change.studentList', function () {
            table.column(1).search(this.value ? '^' + $.fn.dataTable.util.escapeRegex(this.value) + '$' : '', true, false).draw();
        });
        $('#student-institution-filter').on('change.studentList', function () {
            table.column(4).search(this.value ? '^' + $.fn.dataTable.util.escapeRegex(this.value) + '$' : '', true, false).draw();
        });
        $('#clear-student-filters').on('click.studentList', function () {
            $('#student-search, #student-gender-filter, #student-institution-filter').val('');
            table.search('').columns([1, 4]).search('').draw();
        });

        $('#encounter').on('click.studentList', '[data-student-action]', function () {
            var studentID = this.getAttribute('data-student-id');
            var student = table.rows().data().toArray().find(function (record) {
                return record.studentID === studentID;
            });
            if (!student) {
                showMessage('That student record is no longer available. Reload the list and try again.', 'error');
                return;
            }

            if (this.getAttribute('data-student-action') === 'edit') {
                openEditDialog(student);
                return;
            }

            if (!window.confirm('Delete the account for student ' + studentID + '? This cannot be undone.')) {
                return;
            }

            this.disabled = true;
            sendAction({ action: 'deleteStudent', studentID: studentID })
                .done(function (response) {
                    if (!response.isSuccess) {
                        showMessage(response.msg || 'The student account could not be deleted.', 'error');
                        return;
                    }
                    showMessage(response.msg, 'success');
                    table.ajax.reload(null, false);
                })
                .fail(function (request) {
                    var response = request.responseJSON;
                    showMessage(response && response.msg ? response.msg : 'The student account could not be deleted. Try again.', 'error');
                })
                .always(function () {
                    if (document.body.contains(this)) {
                        this.disabled = false;
                    }
                }.bind(this));
        });

        $('#student-edit-form').on('submit.studentList', function (event) {
            event.preventDefault();
            clearDialogError();
            var saveButton = document.getElementById('save-student-button');
            saveButton.disabled = true;

            sendAction({
                action: 'updateStudent',
                studentID: document.getElementById('edit-student-id').value,
                gender: document.getElementById('edit-student-gender').value,
                institution: document.getElementById('edit-student-institution').value,
                contactNumber: document.getElementById('edit-student-contact').value.trim(),
                email: document.getElementById('edit-student-email').value.trim()
            }).done(function (response) {
                if (!response.isSuccess) {
                    showDialogError(response.msg || 'The student details could not be saved.');
                    return;
                }
                dialog.close();
                showMessage(response.msg, 'success');
                table.ajax.reload(null, false);
            }).fail(function (request) {
                var response = request.responseJSON;
                showDialogError(response && response.msg ? response.msg : 'The student details could not be saved. Try again.');
            }).always(function () {
                saveButton.disabled = false;
            });
        });

        dialog.querySelectorAll('[data-close-student-dialog]').forEach(function (button) {
            button.addEventListener('click', function () {
                dialog.close();
            });
        });
        dialog.addEventListener('click', function (event) {
            if (event.target === dialog) {
                dialog.close();
            }
        });
    };

    window.Encounter = {
        init: initialize
    };
}(jQuery));

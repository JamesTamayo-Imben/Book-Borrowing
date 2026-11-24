var bookCardInfo5 = function() {
    "use strict";

    // Function to create a card element
    var createCard5 = function(book) {
        return `
          <div class="col-lg-6">
<div class="row p-4">
  <div class="col-2"></div>
  <div class="basta-card col-8 p-3 ps-4 d-flex justify-content-center align-items-center" id="borrow-this-${book.bookID}">
    <div class="row">
      <div class="col-4 p-4 d-flex align-items-center">
        <img src="${book.image}" alt="Cover of ${book.title}">
      </div>
      <div class="col-8 p-2 ps-3 pt-4 borrow-card">
        <h4 class="h-light mb-3">${book.title}</h4>
        <h6>Author: <span class="h-light h6 mb-3">${book.author}</span></h6>
        <h6>Publish Date: <strong>${book.publishedDate || "N/A"}</strong></h6>
        <p class="text-multiline-ellipsis" style="max-width: 290px;">Description: <br> ${book.description || "No description available."}</p>
      </div>
    </div>

    <div class="labas-hover text-dark">
      <div id="borrow-msg-${book.bookID}" class="ms-2"></div>
      <form class="col-8 p-3" id="form-borrow-${book.bookID}" method="POST">
        
        <div class="row">
          <div class="col-md-12">
            <input type="hidden" name="bookIDD-${book.bookID}" id="bookIDD-${book.bookID}" value="${book.bookID}">

            <input type="hidden" name="borrowedDT-${book.bookID}" id="borrowedDT-${book.bookID}" value="">

            <input type="hidden" name="adminID-${book.bookID}" id="adminID-${book.bookID}" value="${book.adminID}">

            <label for="sid-${book.bookID}">Enter Student ID</label>
            <input type="text" name="sid-${book.bookID}" id="sid-${book.bookID}" placeholder="000-0000-0000" required="required" class="form-control"> 
            <div id="IDerror-${book.bookID}"></div>
          </div>
        </div>

        <div class="row mt-2">
          <div class="col-md-12">
            <label for="returnDate-${book.bookID}">Return Date</label>
            <input type="date" name="returnDate-${book.bookID}" id="returnDate-${book.bookID}" required="required" class="form-control" min="${getCurrentDate()}" max="${getAdd30daysDate()}"> 
            <div id="returnDaterror-${book.bookID}"></div>
          </div>

          <div class="col-md-12 mt-3 pt-1">
            <input type="hidden" name="action-${book.bookID}" value="toBorrowAction">
            <button class="btn borrow-this-btn px-4" type="submit" id="Borrow-${book.bookID}">Borrow This!</button>
          </div>
        </div>
        
      </form> 
    </div>
  </div>
</div>
</div>

        `;
    };

    // Function to fetch book data and render cards
    var loadBooks5 = function() {
        $.ajax({
            url: "bookCard5.php", // PHP file to fetch data
            method: "GET",
            dataType: "json",
            success: function(response) {
                var books = response.value; // Assuming `value` contains the array of books
                var container = $('#book-card-container5');
                container.empty(); // Clear existing cards

                if (books && books.length > 0) {
                    books.forEach(function(book) {
                        container.append(createCard5(book));
                    });
                } else {
                    container.html("<p>No books available.</p>");
                }


                // if (books && books.length > 0) {
                //     books.forEach(function(book) {
                //         container.append(createCard(book));
                //     });
                // } else {
                //     container.html("<p>No books available.</p>");
                // }
            },
            error: function() {
                alert("Failed to load book records.");
            }
        });
    };

    return {
        init: function() {
            loadBooks5(); // Load books on initialization
        }
    };
}();

$(document).ready(function() {
    bookCardInfo5.init();
});

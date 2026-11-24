var escapeBookHtml = function(value) {
    return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

var escapeBookFields = function(book) {
    var safeBook = Object.assign({}, book);
    ['bookID', 'title', 'author', 'image', 'description', 'publishedDate', 'adminID']
        .forEach(function(field) {
            safeBook[field] = escapeBookHtml(book[field]);
        });
    return safeBook;
};

var bookCardInfo1 = function() {
  "use strict";


  var createCard1 = function(book) {
      // counter++;//bookID
      return `
<!-- Book Cards 1-->
      <div class="col-lg-6">
<div class="row p-4">
  <div class="col-2"></div>
  <div class="basta-card col-8 p-3 ps-4 d-flex justify-content-center align-items-center" id="borrow-this-${book.bookID}">
    <div class="row">
      <div class="col-4 p-4 d-flex align-items-center">
        <button class="book-cover-button" type="button"><img src="${book.image}" alt="Cover of ${book.title}"></button>
      </div>
      <div class="col-8 p-2 ps-3 pt-4 borrow-card">
        <h4 class="h-light mb-3">${book.title}</h4>
        <h6>Author: <span class="h-light h6 mb-3">${book.author}</span></h6>
        <h6>Publish Date: <strong>${book.publishedDate || "N/A"}</strong></h6>
        <h6>Available copies: <strong>${Number(book.availableStock) || 0}</strong></h6>
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
            <button class="btn borrow-this-btn px-4" type="submit" id="Borrow-${book.bookID}" ${Number(book.availableStock) > 0 ? '' : 'disabled'}>Borrow This!</button>
          </div>
        </div>
        
      </form> 
    </div>
  </div>
</div>
</div>
      `;
  };
 // ${getCurrentDate()}
 //${new Date().toISOString().split('T')[0]}
  var loadBooks1 = function() {
      $.ajax({
          url: "bookCard1.php",
          method: "GET",
          dataType: "json",
          success: function(response) {
              var books = response.value; // Assuming `value` contains the array of books
              var container = $('#book-card-container1');
              container.empty(); // Clear existing cards

              if (books && books.length > 0) {
                  books.forEach(function(book) {
                      container.append(createCard1(escapeBookFields(book)));
                  });
              } else {
                  container.html("<p>No books available.</p>");
              }

          },
          error: function() {
              alert("Failed to load book records.");
          }
      });
  };

  return {
      init: function() {
          loadBooks1(); // Load books on initialization
      }
  };
}();





var bookCardInfo2 = function() {
  "use strict";


  var createCard2 = function(book) {
    
    return `
    <!-- Book Cards 2 -->
          <div class="col-lg-6">
    <div class="row p-4">
      <div class="col-2"></div>
      <div class="basta-card col-8 p-3 ps-4 d-flex justify-content-center align-items-center" id="borrow-this-${book.bookID}">
        <div class="row">
          <div class="col-4 p-4 d-flex align-items-center">
            <button class="book-cover-button" type="button"><img src="${book.image}" alt="Cover of ${book.title}"></button>
          </div>
          <div class="col-8 p-2 ps-3 pt-4 borrow-card">
            <h4 class="h-light mb-3">${book.title}</h4>
            <h6>Author: <span class="h-light h6 mb-3">${book.author}</span></h6>
            <h6>Publish Date: <strong>${book.publishedDate || "N/A"}</strong></h6>
            <h6>Available copies: <strong>${Number(book.availableStock) || 0}</strong></h6>
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
                <button class="btn borrow-this-btn px-4" type="submit" id="Borrow-${book.bookID}" ${Number(book.availableStock) > 0 ? '' : 'disabled'}>Borrow This!</button>
              </div>
            </div>
            
          </form> 
        </div>
      </div>
    </div>
    </div>
          `;
  };

  var loadBooks2 = function() {
      $.ajax({
          url: "bookCard2.php",
          method: "GET",
          dataType: "json",
          success: function(response) {
              var books = response.value; // Assuming `value` contains the array of books
              var container = $('#book-card-container2');
              container.empty(); // Clear existing cards

              if (books && books.length > 0) {
                  books.forEach(function(book) {
                      container.append(createCard2(escapeBookFields(book)));
                  });
              } else {
                  container.html("<p>No books available.</p>");
              }

          },
          error: function() {
              alert("Failed to load book records.");
          }
      });
  };

  return {
      init: function() {
          loadBooks2(); // Load books on initialization
      }
  };
}();



var bookCardInfo3 = function() {
  "use strict";

  // Function to create a card element
  var createCard3 = function(book) {
    return `
    <!-- Book Cards 3 -->
          <div class="col-lg-6">
    <div class="row p-4">
      <div class="col-2"></div>
      <div class="basta-card col-8 p-3 ps-4 d-flex justify-content-center align-items-center" id="borrow-this-${book.bookID}">
        <div class="row">
          <div class="col-4 p-4 d-flex align-items-center">
            <button class="book-cover-button" type="button"><img src="${book.image}" alt="Cover of ${book.title}"></button>
          </div>
          <div class="col-8 p-2 ps-3 pt-4 borrow-card">
            <h4 class="h-light mb-3">${book.title}</h4>
            <h6>Author: <span class="h-light h6 mb-3">${book.author}</span></h6>
            <h6>Publish Date: <strong>${book.publishedDate || "N/A"}</strong></h6>
            <h6>Available copies: <strong>${Number(book.availableStock) || 0}</strong></h6>
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
                <button class="btn borrow-this-btn px-4" type="submit" id="Borrow-${book.bookID}" ${Number(book.availableStock) > 0 ? '' : 'disabled'}>Borrow This!</button>
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
  var loadBooks3 = function() {
      $.ajax({
          url: "bookCard3.php", // PHP file to fetch data
          method: "GET",
          dataType: "json",
          success: function(response) {
              var books = response.value; // Assuming `value` contains the array of books
              var container = $('#book-card-container3');
              container.empty(); // Clear existing cards

              if (books && books.length > 0) {
                  books.forEach(function(book) {
                      container.append(createCard3(escapeBookFields(book)));
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
          loadBooks3(); // Load books on initialization
      }
  };
}();



var bookCardInfo4 = function() {
  "use strict";

  // Function to create a card element
  var createCard4 = function(book) {
    return `
    <!-- Book Cards 4 -->
          <div class="col-lg-6">
    <div class="row p-4">
      <div class="col-2"></div>
      <div class="basta-card col-8 p-3 ps-4 d-flex justify-content-center align-items-center" id="borrow-this-${book.bookID}">
        <div class="row">
          <div class="col-4 p-4 d-flex align-items-center">
            <button class="book-cover-button" type="button"><img src="${book.image}" alt="Cover of ${book.title}"></button>
          </div>
          <div class="col-8 p-2 ps-3 pt-4 borrow-card">
            <h4 class="h-light mb-3">${book.title}</h4>
            <h6>Author: <span class="h-light h6 mb-3">${book.author}</span></h6>
            <h6>Publish Date: <strong>${book.publishedDate || "N/A"}</strong></h6>
            <h6>Available copies: <strong>${Number(book.availableStock) || 0}</strong></h6>
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
                <button class="btn borrow-this-btn px-4" type="submit" id="Borrow-${book.bookID}" ${Number(book.availableStock) > 0 ? '' : 'disabled'}>Borrow This!</button>
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
  var loadBooks4 = function() {
      $.ajax({
          url: "bookCard4.php", // PHP file to fetch data
          method: "GET",
          dataType: "json",
          success: function(response) {
              var books = response.value; // Assuming `value` contains the array of books
              var container = $('#book-card-container4');
              container.empty(); // Clear existing cards

              if (books && books.length > 0) {
                  books.forEach(function(book) {
                      container.append(createCard4(escapeBookFields(book)));
                  });
              } else {
                  container.html("<p>No books available.</p>");
              }

          },
          error: function() {
              alert("Failed to load book records.");
          }
      });
  };

  return {
      init: function() {
          loadBooks4(); // Load books on initialization
      }
  };
}();




var bookCardInfo5 = function() {
  "use strict";

  // Function to create a card element
  var createCard5 = function(book) {
    return `
    <!-- Book Cards 5 -->
          <div class="col-lg-6">
    <div class="row p-4">
      <div class="col-2"></div>
      <div class="basta-card col-8 p-3 ps-4 d-flex justify-content-center align-items-center" id="borrow-this-${book.bookID}">
        <div class="row">
          <div class="col-4 p-4 d-flex align-items-center">
            <button class="book-cover-button" type="button"><img src="${book.image}" alt="Cover of ${book.title}"></button>
          </div>
          <div class="col-8 p-2 ps-3 pt-4 borrow-card">
            <h4 class="h-light mb-3">${book.title}</h4>
            <h6>Author: <span class="h-light h6 mb-3">${book.author}</span></h6>
            <h6>Publish Date: <strong>${book.publishedDate || "N/A"}</strong></h6>
            <h6>Available copies: <strong>${Number(book.availableStock) || 0}</strong></h6>
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
                <button class="btn borrow-this-btn px-4" type="submit" id="Borrow-${book.bookID}" ${Number(book.availableStock) > 0 ? '' : 'disabled'}>Borrow This!</button>
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
          url: "bookCard5.php", 
          method: "GET",
          dataType: "json",
          success: function(response) {
              var books = response.value; 
              var container = $('#book-card-container5');
              container.empty();

              if (books && books.length > 0) {
                  books.forEach(function(book) {
                      container.append(createCard5(escapeBookFields(book)));
                  });
              } else {
                  container.html("<p>No books available.</p>");
              }
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
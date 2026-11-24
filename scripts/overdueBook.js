var formatBlock = function() {
    return {
        message: 'Please Wait <img style="display:inline;width:20px;height:20px;" src="public/img/loader.gif"/>',
        css: {
            border: 'none',
            padding: '15px',
            backgroundColor: '#000',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: .5,
            color: '#fff'
        }
    };
}


      var userrecords = $('#encounter').DataTable({
      
        "sAjaxSource":  "overdueBook.php",
        "sAjaxDataProp": "value",
        "dom": 'rt<"record-table-footer"ip>',
        "language": {
            "emptyTable": "There are no overdue books.",
            "zeroRecords": "No overdue books match your search.",
            "loadingRecords": "Loading overdue books…"
        },
        
             "aoColumns": [
                {
                "mDataProp": "bookID",
                },{
                "mDataProp": "borrowedID",
                 },{
                "mDataProp": "returnID",
                 },{
                "mDataProp": "studentID",
                 }
        ]
            });
            
          
            
            var register = function() {
                "use strict";
                
                return {
                    init: function() {
                       // onLogins(); // Initialize form submission handler
                    }
                };
            }();
            
            // Initialize the script
            $(document).ready(function() {
                register.init();
            });
             
            

var Encounter = function() {
    "use strict";
    
    return {
        init: function() {
       
        }
    }
}()
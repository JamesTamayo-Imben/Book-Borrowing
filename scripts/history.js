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
      
        "sAjaxSource":  "history.php",
        "sAjaxDataProp": "value",
        "dom": 'rt<"record-table-footer"ip>',
        "language": {
            "emptyTable": "No library transactions have been recorded yet.",
            "zeroRecords": "No transactions match your search.",
            "loadingRecords": "Loading transaction history…"
        },
        
             "aoColumns": [
                {
                "mDataProp": "date",
                },{
                "mDataProp": "bookID",
                 },{
                "mDataProp": "studentID",
                 },{
                "mDataProp": "type",
                 }
        ]
            });
            
          
            
            var register = function() {
                "use strict";
                
                return {
                    init: function() {
                     //   onLogins(); // Initialize form submission handler
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

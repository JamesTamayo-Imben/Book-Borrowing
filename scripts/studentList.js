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
      
        "sAjaxSource":  "studentList.php",
        "sAjaxDataProp": "value",
        "language": {
            "emptyTable": "No students have been registered yet.",
            "zeroRecords": "No students match your search.",
            "loadingRecords": "Loading students…"
        },
        
             "aoColumns": [
                {
                "mDataProp": "studentID",
                },{
                "mDataProp": "gender",
                 },{
                "mDataProp": "contactNumber",
                 },{
                "mDataProp": "email",
                 },{
                "mDataProp": "institution",
                 },
        ]
            });

var Encounter = function() {
    "use strict";
    
    return {
        init: function() {
       
        }
    }
}()
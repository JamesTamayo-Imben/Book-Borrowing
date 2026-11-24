
var formatBlock = function(blockmsg) {
    return {
        message: blockmsg,
        css: {
            border: 'none',
            padding: '15px',
            backgroundColor: '#000',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: .5,
            color: '#fff',
            width: '200px'
        }
    };
}


var loadFirst = function() {
    setTimeout(function() {
        $('#core').removeClass('hidden');
        // $('#loader').addClass('hidden');
    }, 1000);
};




$("#borrow-all").click(function(){
    var blockmsg = 'Please wait <img style="display:inline;width:20px;height:20px;" src="public/img/loader.gif"/>';

    $('#borrow-types').block(formatBlock(blockmsg));
    $('#borrow-types').fadeOut('500', function() {
        
        $.get('borrowAll.html', function(data) {
            $('#borrow-types').html(data);
            $('#viewstitle').html('');

            //  $('#borrow-types').fadeIn(300, function () {
            //     $('#borrow-types').unblock();
            
            //     returnUpdate1.init();
            //     returnUpdate1B.init();
            // });
           
            $('#borrow-types').fadeIn(400, function () {
                $('#borrow-types').unblock();
            var returnUpdates = {
                returnUpdate1: returnUpdate1,
                returnUpdate1B: returnUpdate1B,
            };
            Object.keys(returnUpdates).forEach(function (key) {
                var returnUpdate = returnUpdates[key];
                if (typeof returnUpdate !== "undefined" && typeof returnUpdate.init === "function") {
                    console.log(`Reinitializing ${key}`);
                    returnUpdate.init();
                } else {
                    console.error(`${key} is not defined or does not have an init method.`);
                }
            });
            });


        });   
    });
});



$("#borrow-is").click(function(){
    var blockmsg = 'Please wait <img style="display:inline;width:20px;height:20px;" src="public/img/loader.gif"/>';

    $('#borrow-types').block(formatBlock(blockmsg));
    $('#borrow-types').fadeOut('500', function() {
        
        $.get('borrowIS.html', function(data) {
            $('#borrow-types').html(data);
            $('#viewstitle').html('');

             $('#borrow-types').fadeIn(300, function () {
                $('#borrow-types').unblock();
            
                returnUpdate2.init();
            });
           
        });   
    });
});



$("#borrow-psy").click(function(){
    var blockmsg = 'Please wait <img style="display:inline;width:20px;height:20px;" src="public/img/loader.gif"/>';

    $('#borrow-types').block(formatBlock(blockmsg));
    $('#borrow-types').fadeOut('500', function() {
        
        $.get('borrowPsy.html', function(data) {
            $('#borrow-types').html(data);
            $('#viewstitle').html('');

             $('#borrow-types').fadeIn(300, function () {
                $('#borrow-types').unblock();
            
                returnUpdate3.init();
            });
           
        });   
    });
});



$("#borrow-ce").click(function(){
    var blockmsg = 'Please wait <img style="display:inline;width:20px;height:20px;" src="public/img/loader.gif"/>';

    $('#borrow-types').block(formatBlock(blockmsg));
    $('#borrow-types').fadeOut('500', function() {
        
        $.get('borrowCE.html', function(data) {
            $('#borrow-types').html(data);
            $('#viewstitle').html('');

             $('#borrow-types').fadeIn(300, function () {
                $('#borrow-types').unblock();
            
                returnUpdate4.init();
            });
           
        });   
    });
});



$("#borrow-ns").click(function(){
    var blockmsg = 'Please wait <img style="display:inline;width:20px;height:20px;" src="public/img/loader.gif"/>';

    $('#borrow-types').block(formatBlock(blockmsg));
    $('#borrow-types').fadeOut('500', function() {
        
        $.get('borrowNS.html', function(data) {
            $('#borrow-types').html(data);
            $('#viewstitle').html('');

             $('#borrow-types').fadeIn(300, function () {
                $('#borrow-types').unblock();
            
                returnUpdate5.init();
            });
           
        });   
    });
});


$("#borrow-mw").click(function(){
    var blockmsg = 'Please wait <img style="display:inline;width:20px;height:20px;" src="public/img/loader.gif"/>';

    $('#borrow-types').block(formatBlock(blockmsg));
    $('#borrow-types').fadeOut('500', function() {
        
        $.get('borrowMW.html', function(data) {
            $('#borrow-types').html(data);
            $('#viewstitle').html('');

             $('#borrow-types').fadeIn(300, function () {
                $('#borrow-types').unblock();
            
                returnUpdate6.init();
            });
           
        });   
    });
});


$("#borrow-over").click(function(){
    var blockmsg = 'Please wait <img style="display:inline;width:20px;height:20px;" src="public/img/loader.gif"/>';

    $('#borrow-types').block(formatBlock(blockmsg));
    $('#borrow-types').fadeOut('500', function() {
        
        $.get('borrowOver.html', function(data) {
            $('#borrow-types').html(data);
            $('#viewstitle').html('');

             $('#borrow-types').fadeIn(300, function () {
                $('#borrow-types').unblock();
            
                returnUpdate7.init();
            });
           
        });   
    });
});



var Index = function() {
    "use strict";
    
    return {
        init: function() {
            checkSession()
             

        }
    }
}();

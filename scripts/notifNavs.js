
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




$("#notif-all").click(function(){
    var blockmsg = 'Please wait <img style="display:inline;width:20px;height:20px;" src="public/img/loader.gif"/>';

    $('#notif-types').block(formatBlock(blockmsg));
    $('#notif-types').fadeOut('500', function() {
        
        $.get('notif-all.html', function(data) {
            $('#notif-types').html(data);
            $('#viewstitle').html('');

             $('#notif-types').fadeIn(300, function () {
                $('#notif-types').unblock();
            
               notifBoxJs1.init();
            });
           
        });   
    });
});



$("#notif-warning").click(function(){
    var blockmsg = 'Please wait <img style="display:inline;width:20px;height:20px;" src="public/img/loader.gif"/>';

    $('#notif-types').block(formatBlock(blockmsg));
    $('#notif-types').fadeOut('500', function() {
        
        $.get('notif-warning.html', function(data) {
            $('#notif-types').html(data);
            $('#viewstitle').html('');

             $('#notif-types').fadeIn(300, function () {
                $('#notif-types').unblock();
            
               notifBoxJs2.init();
            });
           
        });   
    });
});



$("#notif-return").click(function(){
    var blockmsg = 'Please wait <img style="display:inline;width:20px;height:20px;" src="public/img/loader.gif"/>';

    $('#notif-types').block(formatBlock(blockmsg));
    $('#notif-types').fadeOut('500', function() {
        
        $.get('notif-return.html', function(data) {
            $('#notif-types').html(data);
            $('#viewstitle').html('');

             $('#notif-types').fadeIn(300, function () {
                $('#notif-types').unblock();
            
               notifBoxJs3.init();
            });
           
        });   
    });
});



$("#notif-borrow").click(function(){
    var blockmsg = 'Please wait <img style="display:inline;width:20px;height:20px;" src="public/img/loader.gif"/>';

    $('#notif-types').block(formatBlock(blockmsg));
    $('#notif-types').fadeOut('500', function() {
        
        $.get('notif-borrow.html', function(data) {
            $('#notif-types').html(data);
            $('#viewstitle').html('');

             $('#notif-types').fadeIn(300, function () {
                $('#notif-types').unblock();
            
               notifBoxJs4.init();
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

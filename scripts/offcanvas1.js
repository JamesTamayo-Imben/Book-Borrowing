
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

var checkSession = function() {
    $.get('checkSession.php', function(data) {
        var sessiondata = $.parseJSON(data);
        if(!sessiondata.isSuccess) {
            $(location).attr('href','dashboard.html');
        } else {
                loadFirst();
        }
    });
};


var loadFirst = function() {
    setTimeout(function() {
        $('#core').removeClass('hidden');
        // $('#loader').addClass('hidden');
    }, 1000);
};

    // off canvas id's

    $("#offdashboard").click(function(){
        var blockmsg = 'Please wait <img style="display:inline;width:20px;height:20px;" src="public/img/loader.gif"/>';

        $('#main-content').block(formatBlock(blockmsg));
        $('#main-content').fadeOut('400', function() {
            
            
            $.get('graph.html', function(data) {
                $('#main-content').html(data);
                $('#viewstitle').html('');
                $('#main-content').fadeIn('400');
                $('#main-content').unblock();
            });   
        });
    });

     
    $('#offlogout').click(function(){
        $.get('logout.php', function(data) {
            checkSession();
        });    
    });
    
   

    $("#offuserList").click(function(){
        var blockmsg = 'Please wait <img style="display:inline;width:20px;height:20px;" src="public/img/loader.gif"/>';
        $('#main-content').block(formatBlock(blockmsg));
        $('#main-content').fadeOut('400', function() {
            
            
            $.get('userList.html', function(data) {
                $('#main-content').html(data);
                $('#viewstitle').html('');
                $('#main-content').fadeIn('400');
                $('#main-content').unblock();
            });   
        });
    });

    $("#offuserRegistration").click(function(){
        var blockmsg = 'Please wait <img style="display:inline;width:20px;height:20px;" src="public/img/loader.gif"/>';
        $('#main-content').block(formatBlock(blockmsg));
        $('#main-content').fadeOut('400', function() {
            
            
            $.get('userRegistration.html', function(data) {
                $('#main-content').html(data);
                $('#viewstitle').html('');
                $('#main-content').fadeIn('400');
                $('#main-content').unblock();
            });   
        });
    });



    $("#offregisteruser").click(function(){
        var blockmsg = 'Please wait <img style="display:inline;width:20px;height:20px;" src="public/img/loader.gif"/>';

        $('#main-content').block(formatBlock(blockmsg));
        $('#main-content').fadeOut('400', function() {
            
            
            $.get('resgiterUser.html', function(data) {
                $('#main-content').html(data);
                $('#viewstitle').html('');
                $('#main-content').fadeIn('400');
                $('#main-content').unblock();
            });   
        });
    });

    $("#offbookList").click(function(){
        var blockmsg = 'Please wait <img style="display:inline;width:20px;height:20px;" src="public/img/loader.gif"/>';

        $('#main-content').block(formatBlock(blockmsg));
        $('#main-content').fadeOut('400', function() {
            
            $.get('bookCards.html', function(data) {
                $('#main-content').html(data);
                $('#viewstitle').html('');
                $('#main-content').fadeIn('400');
                $('#main-content').unblock();
            });   
        });
    });


    $("#offborrowedBook").click(function(){
        var blockmsg = 'Please wait <img style="display:inline;width:20px;height:20px;" src="public/img/loader.gif"/>';

        $('#main-content').block(formatBlock(blockmsg));
        $('#main-content').fadeOut('400', function() {
            
            $.get('borrowedBook.html', function(data) {
                $('#main-content').html(data);
                $('#viewstitle').html('');
                $('#main-content').fadeIn('400');
                $('#main-content').unblock();
            });   
        });
    });

    $("#offoverdueBook").click(function(){
        var blockmsg = 'Please wait <img style="display:inline;width:20px;height:20px;" src="public/img/loader.gif"/>';

        $('#main-content').block(formatBlock(blockmsg));
        $('#main-content').fadeOut('400', function() {
            
            $.get('overdueBook.html', function(data) {
                $('#main-content').html(data);
                $('#viewstitle').html('');
                $('#main-content').fadeIn('400');
                $('#main-content').unblock();
            });   
        });
    });

    $("#offlogs").click(function(){
        var blockmsg = 'Please wait <img style="display:inline;width:20px;height:20px;" src="public/img/loader.gif"/>';

        $('#main-content').block(formatBlock(blockmsg));
        $('#main-content').fadeOut('400', function() {
            
            $.get('history.html', function(data) {
                $('#main-content').html(data);
                $('#viewstitle').html('');
                $('#main-content').fadeIn('400');
                $('#main-content').unblock();
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
}()

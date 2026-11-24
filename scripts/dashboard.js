
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
            $(location).attr('href','logIn.html');
            console.log("ito");
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


    $("#dashboard").click(function(){
        var blockmsg = 'Please wait <img style="display:inline;width:20px;height:20px;" src="loader.gif"/>';

        $('#main-content').block(formatBlock(blockmsg));
        $('#main-content').fadeOut('400', function() {
            
            $.get('graph.html', function(data) {
                $('#main-content').html(data);
                $('#viewstitle').html('');

                $('#main-content').fadeIn(300, function () {
                    $('#main-content').unblock();
                
                    initrylng.init();
                });
                // $('#main-content').fadeIn('400');
                // $('#main-content').unblock();

                // initrylng.init();
            });   
        });
    });


    $("#dashboardUser").click(function(){
        var blockmsg = 'Please wait <img style="display:inline;width:20px;height:20px;" src="public/img/loader.gif"/>';

        $('#main-content').block(formatBlock(blockmsg));
        $('#main-content').fadeOut('400', function() {
            
            
            $.get('dashboardUserLipat.html', function(data) {
                $('#main-content').html(data);
                $('#viewstitle').html('');
                $('#main-content').fadeIn('400');
                $('#main-content').unblock();
            });   
        });
    });


    $("#offdashboardUser").click(function(){
        var blockmsg = 'Please wait <img style="display:inline;width:20px;height:20px;" src="public/img/loader.gif"/>';

        $('#main-content').block(formatBlock(blockmsg));
        $('#main-content').fadeOut('400', function() {
            
            
            $.get('dashboardUserLipat.html', function(data) {
                $('#main-content').html(data);
                $('#viewstitle').html('');
                $('#main-content').fadeIn('400');
                $('#main-content').unblock();
            });   
        });
    });

     
    $('#logout').click(function(){
        $.get('logout.php', function(data) {
            checkSession();
        });    
    });
    
    $("#studentInfo").click(function(){
        var blockmsg = 'Please wait <img style="display:inline;width:20px;height:20px;" src="public/img/loader.gif"/>';
        $('#main-content').block(formatBlock(blockmsg));
        $('#main-content').fadeOut('400', function() {
            
            
            $.get('studentInfo.html', function(data) {
                $('#main-content').html(data);
                $('#viewstitle').html('');
                $('#main-content').fadeIn('400');
                $('#main-content').unblock();
            });   
        });
    });
//shortcut-user
    $("#userList").click(function(){
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

    $("#shortcut-user").click(function(){
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

    $("#userRegistration").click(function(){
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



    $("#registeruser").click(function(){
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
//shortcut-book
    $("#bookList").click(function(){
        var blockmsg = 'Please wait <img style="display:inline;width:20px;height:20px;" src="public/img/loader.gif"/>';

        $('#main-content').block(formatBlock(blockmsg));
        $('#main-content').fadeOut('400', function() {
            
            $.get('bookCards.html', function(data) {
                $('#main-content').html(data);
                $('#viewstitle').html('');
                // $('#main-content').fadeIn('400');
                // $('#main-content').unblock();bookCardInfo.init();

                 $('#main-content').fadeIn(400, function () {
                    $('#main-content').unblock();
                var bookCardInfos = {
                    bookCardInfo1: bookCardInfo1,
                    bookCardInfo2: bookCardInfo2,
                    bookCardInfo3: bookCardInfo3,
                    bookCardInfo4: bookCardInfo4,
                    bookCardInfo5: bookCardInfo5
                };
                Object.keys(bookCardInfos).forEach(function (key) {
                    var bookCardInfo = bookCardInfos[key];
                    if (typeof bookCardInfo !== "undefined" && typeof bookCardInfo.init === "function") {
                        console.log(`Reinitializing ${key}`);
                        bookCardInfo.init();
                    } else {
                        console.error(`${key} is not defined or does not have an init method.`);
                    }
                });
                });
               
            });   
        });
    });

    $("#shortcut-book").click(function(){
        var blockmsg = 'Please wait <img style="display:inline;width:20px;height:20px;" src="public/img/loader.gif"/>';

        $('#main-content').block(formatBlock(blockmsg));
        $('#main-content').fadeOut('400', function() {
            
            $.get('bookCards.html', function(data) {
                $('#main-content').html(data);
                $('#viewstitle').html('');
                // $('#main-content').fadeIn('400');
                // $('#main-content').unblock();bookCardInfo.init();

                 $('#main-content').fadeIn(400, function () {
                    $('#main-content').unblock();
                var bookCardInfos = {
                    bookCardInfo1: bookCardInfo1,
                    bookCardInfo2: bookCardInfo2,
                    bookCardInfo3: bookCardInfo3,
                    bookCardInfo4: bookCardInfo4,
                    bookCardInfo5: bookCardInfo5
                };
                Object.keys(bookCardInfos).forEach(function (key) {
                    var bookCardInfo = bookCardInfos[key];
                    if (typeof bookCardInfo !== "undefined" && typeof bookCardInfo.init === "function") {
                        console.log(`Reinitializing ${key}`);
                        bookCardInfo.init();
                    } else {
                        console.error(`${key} is not defined or does not have an init method.`);
                    }
                });
                });
               
            });   
        });
    });


    $("#bookListUser").click(function(){
        var blockmsg = 'Please wait <img style="display:inline;width:20px;height:20px;" src="public/img/loader.gif"/>';

        $('#main-content').block(formatBlock(blockmsg));
        $('#main-content').fadeOut('400', function() {
            
            $.get('bookCardsUser.html', function(data) {
                $('#main-content').html(data);
                $('#viewstitle').html('');
                // $('#main-content').fadeIn('400');
                // $('#main-content').unblock();bookCardInfo.init();

                 $('#main-content').fadeIn(400, function () {
                    $('#main-content').unblock();
                var bookCardInfos = {
                    bookCardInfo1: bookCardInfo1,
                    bookCardInfo2: bookCardInfo2,
                    bookCardInfo3: bookCardInfo3,
                    bookCardInfo4: bookCardInfo4,
                    bookCardInfo5: bookCardInfo5
                };
                Object.keys(bookCardInfos).forEach(function (key) {
                    var bookCardInfo = bookCardInfos[key];
                    if (typeof bookCardInfo !== "undefined" && typeof bookCardInfo.init === "function") {
                        console.log(`Reinitializing ${key}`);
                        bookCardInfo.init();
                    } else {
                        console.error(`${key} is not defined or does not have an init method.`);
                    }
                });
                });
               
            });   
        });
    });





    $("#borrowedBook").click(function(){
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

    $("#overdueBook").click(function(){
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

    $("#logs").click(function(){
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


    $("#notification").click(function(){
        var blockmsg = 'Please wait <img style="display:inline;width:20px;height:20px;" src="public/img/loader.gif"/>';

        $('#main-content').block(formatBlock(blockmsg));
        $('#main-content').fadeOut('400', function() {
            
            $.get('notif.html', function(data) {
                $('#main-content').html(data);
                $('#viewstitle').html('');
                $('#main-content').fadeIn('400');
                $('#main-content').unblock();
            });   
        });
    });


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
    
    $("#offstudentInfo").click(function(){
        var blockmsg = 'Please wait <img style="display:inline;width:20px;height:20px;" src="public/img/loader.gif"/>';
        $('#main-content').block(formatBlock(blockmsg));
        $('#main-content').fadeOut('400', function() {
            
            
            $.get('studentInfo.html', function(data) {
                $('#main-content').html(data);
                $('#viewstitle').html('');
                $('#main-content').fadeIn('400');
                $('#main-content').unblock();
            });   
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
            
            // $.get('bookCards.html', function(data) {
            //     $('#main-content').html(data);
            //     $('#viewstitle').html('');
            //     $('#main-content').fadeIn('400');
            //     $('#main-content').unblock();
            // });   


            $.get('bookCards.html', function(data) {
                $('#main-content').html(data);
                $('#viewstitle').html('');

                 $('#main-content').fadeIn(400, function () {
                    $('#main-content').unblock();
                var bookCardInfos = {
                    bookCardInfo1: bookCardInfo1,
                    bookCardInfo2: bookCardInfo2,
                    bookCardInfo3: bookCardInfo3,
                    bookCardInfo4: bookCardInfo4,
                    bookCardInfo5: bookCardInfo5
                };
                Object.keys(bookCardInfos).forEach(function (key) {
                    var bookCardInfo = bookCardInfos[key];
                    if (typeof bookCardInfo !== "undefined" && typeof bookCardInfo.init === "function") {
                        console.log(`Reinitializing ${key}`);
                        bookCardInfo.init();
                    } else {
                        console.error(`${key} is not defined or does not have an init method.`);
                    }
                });
                });
               
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

    $("#offnotification").click(function(){
        var blockmsg = 'Please wait <img style="display:inline;width:20px;height:20px;" src="public/img/loader.gif"/>';

        $('#main-content').block(formatBlock(blockmsg));
        $('#main-content').fadeOut('400', function() {
            
            $.get('notif.html', function(data) {
                $('#main-content').html(data);
                $('#viewstitle').html('');
                $('#main-content').fadeIn('400');
                $('#main-content').unblock();
            });   
        });
    });

    // offcanvas nav borrowedBook-User

    $("#borrowedBook-User").click(function(){
        var blockmsg = 'Please wait <img style="display:inline;width:20px;height:20px;" src="public/img/loader.gif"/>';

        $('#main-content').block(formatBlock(blockmsg));
        $('#main-content').fadeOut('400', function() {
            
            $.get('borrowedBookUser.html', function(data) {
                $('#main-content').html(data);
                $('#viewstitle').html('');
                $('#main-content').fadeIn('400');
                $('#main-content').unblock();
            });   
        });
    });


    $("#offborrowedBook-User").click(function(){
        var blockmsg = 'Please wait <img style="display:inline;width:20px;height:20px;" src="public/img/loader.gif"/>';

        $('#main-content').block(formatBlock(blockmsg));
        $('#main-content').fadeOut('400', function() {
            
            $.get('borrowedBookUser.html', function(data) {
                $('#main-content').html(data);
                $('#viewstitle').html('');
                $('#main-content').fadeIn('400');
                $('#main-content').unblock();
            });   
        });
    });

// toBorrowPage

var Index = function() {
    "use strict";
    
    return {
        init: function() {
            checkSession()
             

        }
    }
}()

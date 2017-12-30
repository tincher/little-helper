$(document).ready(function() {

    $("#button-newest").click(function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            // url: "http://localhost:3000/copyNewest",
            // url: "http://85.214.100.20:3000/copyNewest",
            url: "http://192.168.2.124:3000/copyNewest",
            data: {
                id: $(this).val(), // < note use of 'this' here
                access_token: $("#access_token").val()
            },
            success: function(result) {
                alert('ok');
            },
            error: function(result) {
                alert('error');
            }
        });
    });
    $("#button-timeroom").click(function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            // url: "http://localhost:3000/copyTimeroom",
            // url: "http://85.214.100.20:3000/copyTimeroom",
            url: "http://192.168.2.124:3000/copyNewest",
            data: {
                id: $(this).val(), // < note use of 'this' here
                access_token: $("#access_token").val()
            },
            success: function(result) {
                alert('ok');
            },
            error: function(result) {
                alert('error');
            }
        });
    });
});
$(document).ready(function () {

    $("button").click(function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "http://85.214.100.20:3000/copyFile",
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

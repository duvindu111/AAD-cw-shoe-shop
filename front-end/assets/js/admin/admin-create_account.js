$(document).ready(function () {
    $("#new_account_modal").modal('show');
});

$(".btn_create_account").on("click", function (){
   let email = $("#user_email").val();
   let password = $("#user_password").val();
   let confirm_password = $("#confirm_user_password").val();

    if (!email || !password || !confirm_password) {
         alert("Please enter all fields.");
         return;
    }
    if (password !== confirm_password) {
        alert("Passwords do not match.");
        return;
    }

    $.ajax({
        url: 'http://localhost:8080/hello_shoes/api/v1/auth/signup',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({"email": email, "password": password}),
        success: function (response) {
            console.log(response);
            alert("User registered successfully!");
            $("#new_account_modal").modal('hide');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR);
            alert(jqXHR.responseJSON.message);
            // alert("Account creation failed! Please check your input and try again.");
        }
    });
});

$("#closeIcon").on("click", function (){
    window.location.href = '../../pages/admin/admin-dashboard.html';
});
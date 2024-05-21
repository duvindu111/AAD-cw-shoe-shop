$("#btnLogin").click(function (){
   let email = $("#inputEmail").val();
   let password = $("#inputPassword").val();

   console.log(email, password);
    if (!email || !password) {
         alert("Please enter both email and password.");
         return;
    }

    $.ajax({
        url: 'http://localhost:8080/hello_shoes/api/v1/auth/signin',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({"email": email, "password": password}),
        success: async function (response) {
            console.log(response);
            let token = response.token;
            alert("Login Successful!");

            localStorage.setItem("hs_token", token);

            try {
                await sendBirthdayWishes();

                if (response.role == "ADMIN") {
                    window.location.href = 'pages/admin/admin-dashboard.html';
                } else if (response.role == "USER") {
                    window.location.href = 'pages/admin-place-order.html';
                }
            } catch (error) {
                console.error("Error sending birthday wishes:", error);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Login Failed! Please check your credentials. Also, there might be an issue with the server.");
            console.error(jqXHR.responseText);
        }
    });
});

function sendBirthdayWishes() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'http://localhost:8080/hello_shoes/api/v1/auth/send_wishes',
            method: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
                console.log(response);

                if(response.length != 0){
                    alert("Birthday wishes sent successfully!\nThese customers celebrate their birthdays today.\n" + response);
                }
                resolve(response);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(jqXHR.responseText);
                reject(errorThrown);
                alert("Failed to send birthday wishes to the customers.");
            }
        });
    });
}

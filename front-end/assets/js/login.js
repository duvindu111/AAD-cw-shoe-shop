let employeeAvailable;

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
            localStorage.setItem("hs_token", token);

            try{
                await getEmployee(email);
            }catch (error){
                console.error("Error getting employee details:", error);
            }

            if(employeeAvailable){
                alert("Login Successful!");
                try {
                    await sendBirthdayWishes();

                    if (response.role == "ADMIN") {
                        window.location.href = 'pages/admin/admin-dashboard.html';
                    } else if (response.role == "USER") {
                        window.location.href = 'pages/user/user-place-order.html';
                    }
                } catch (error) {
                    console.error("Error sending birthday wishes:", error);
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Login Failed! Please check your credentials. Also, there might be an issue with the server.");
            console.error(jqXHR.responseText);
        }
    });
});

function getEmployee(email) {
    return new Promise((resolve, reject) => {
        localStorage.setItem("hs_user_email", email);
        $.ajax({
            url: 'http://localhost:8080/hello_shoes/api/v1/employee/getEmployeeByEmail/' + email,
            headers: {"Authorization": "Bearer " + localStorage.getItem("hs_token")},
            method: 'GET',
            contentType: 'application/json',
            success: function (response) {
                console.log("employee details at login")
                console.log(response);
                localStorage.setItem("hs_user_code", response.data.code);
                localStorage.setItem("hs_user_name", response.data.name);
                localStorage.setItem(("hs_user_picture"), response.data.profilePic);
                employeeAvailable = true;
                resolve(response);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(jqXHR);
                employeeAvailable = false;
                alert(jqXHR.responseJSON.message);
                reject(new Error(jqXHR.responseJSON ? jqXHR.responseJSON.message : 'An error occurred'));
            }
        });
    });
}

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
                alert("Failed to send birthday wishes to the customers.");
                reject(errorThrown);
            }
        });
    });
}

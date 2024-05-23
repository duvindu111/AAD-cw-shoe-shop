$(document).ready(function () {
    // Checking if user is logged in or not
    if (localStorage.getItem("hs_user_email") === null) {
        window.location.href = "../../login.html";
    }

    $("#code_of_employee").text(localStorage.getItem("hs_user_code"));
    $("#name_of_user").text(localStorage.getItem("hs_user_name"));
    $("#topbar_user_img").attr("src", "data:image/png;base64," + localStorage.getItem("hs_user_picture"));

});

function displaySelectedFile(element) {
    const selectedFile = element.files[0];
    const selectedFileContainer = $(element).next('input');
    selectedFileContainer.val(selectedFile.name);
}

// Function to convert File to Base64 string
function fileToBase64(file, callback) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        let base64ProfilePic = reader.result.split(',')[1];
        callback(base64ProfilePic);
    };
    reader.onerror = function (error) {
        console.error('Error occurred while reading the file:', error);
    };
}

$("#modalLogoutBtn").onclick(function (){
   localStorage.removeItem("hs_user_email");
   localStorage.removeItem("hs_user_code");
   localStorage.removeItem("hs_user_name");
   localStorage.removeItem("hs_user_picture");
});

// function getEmployee() {
//     let employeeEmail = localStorage.getItem("hs_user_email");
//     $.ajax({
//         url: 'http://localhost:8080/hello_shoes/api/v1/employee/getEmployeeByEmail/' + employeeEmail,
//         headers: { "Authorization": "Bearer " + localStorage.getItem("hs_token") },
//         method: 'GET',
//         contentType: 'application/json',
//         success: function (response) {
//             console.log("employee details at ")
//             console.log(response);
//             $("#code_of_employee").text(response.data.code);
//             $("#name_of_user").text(response.data.name);
//         },
//         error: function (jqXHR, textStatus, errorThrown) {
//             alert(jqXHR.responseJSON.message);
//             console.error(jqXHR);
//         }
//     });
// }
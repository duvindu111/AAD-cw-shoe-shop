$(document).ready(function () {
    generateNextEmployeeId();
    getAllEmployees();
});

$("#btnAdd").click(function (){
    let validated = validateFields();
    if(validated){
        let code = $("#emp_code").val();
        let name = $("#emp_name").val();
        let profile_pic = $("#emp_profile_pic_hidden")[0].files[0];
        let gender = $("#emp_gender").val()
        let status = $("#emp_status").val()
        let designation = $("#emp_designation").val()
        let access_role = $("#emp_role").val()
        let dob = $("#emp_dob").val();
        let date_of_join = $("#emp_date_of_join").val();
        let attached_branch = $("#emp_branch").val();
        let add_line_1 = $("#add_line_1").val();
        let add_line_2 = $("#add_line_2").val();
        let add_line_3 = $("#add_line_3").val();
        let add_line_4 = $("#add_line_4").val();
        let add_line_5 = $("#add_line_5").val();
        let contact = $("#emp_contact").val();
        let email = $("#emp_email").val();
        let guardian_name = $("#emp_guardian_name").val();
        let guardian_contact = $("#emp_guardian_contact").val();

        console.log(profile_pic);

        let formData = new FormData();
        formData.append("code", code);
        formData.append("name", name);
        formData.append("profilePic", profile_pic);
        formData.append("gender", gender);
        formData.append("civilStatus", status);
        formData.append("designation", designation);
        formData.append("role", access_role);
        formData.append("dob", dob);
        formData.append("joinDate", date_of_join);
        formData.append("branch", attached_branch);
        formData.append("addressLine1", add_line_1);
        formData.append("addressLine2", add_line_2);
        formData.append("addressLine3", add_line_3);
        formData.append("addressLine4", add_line_4);
        formData.append("addressLine5", add_line_5);
        formData.append("contact", contact);
        formData.append("email", email);
        formData.append("guardianName", guardian_name);
        formData.append("guardianContact", guardian_contact);

        $.ajax({
            url: 'http://localhost:8080/hello_shoes/api/v1/employee/save',
            method: 'POST',
            processData: false,
            contentType: false,
            headers: { "Authorization": "Bearer " + localStorage.getItem("hs_token") },
            data: formData,
            success: function (response) {
                alert("Employee details saved successfully");
                clearFields();

                $("#btnUpdate").prop("disabled", true);
                $("#btnDelete").prop("disabled", true);
                $("#btnAdd").prop("disabled", false);

                getAllEmployees();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(jqXHR);
                alert(jqXHR.responseJSON.message);
            }
        });
    }
})

$("#btnUpdate").click(function (){
    let validated = validateFields();
    if(validated){
        let code = $("#emp_code").val();
        let name = $("#emp_name").val();
        let profile_pic = $("#emp_profile_pic_hidden")[0].files[0];
        let gender = $("#emp_gender").val()
        let status = $("#emp_status").val()
        let designation = $("#emp_designation").val()
        let access_role = $("#emp_role").val()
        let dob = $("#emp_dob").val();
        let date_of_join = $("#emp_date_of_join").val();
        let attached_branch = $("#emp_branch").val();
        let add_line_1 = $("#add_line_1").val();
        let add_line_2 = $("#add_line_2").val();
        let add_line_3 = $("#add_line_3").val();
        let add_line_4 = $("#add_line_4").val();
        let add_line_5 = $("#add_line_5").val();
        let contact = $("#emp_contact").val();
        let email = $("#emp_email").val();
        let guardian_name = $("#emp_guardian_name").val();
        let guardian_contact = $("#emp_guardian_contact").val();

        let formData = new FormData();
        formData.append("code", code);
        formData.append("name", name);
        formData.append("profilePic", profile_pic);
        formData.append("gender", gender);
        formData.append("civilStatus", status);
        formData.append("designation", designation);
        formData.append("role", access_role);
        formData.append("dob", dob);
        formData.append("joinDate", date_of_join);
        formData.append("branch", attached_branch);
        formData.append("addressLine1", add_line_1);
        formData.append("addressLine2", add_line_2);
        formData.append("addressLine3", add_line_3);
        formData.append("addressLine4", add_line_4);
        formData.append("addressLine5", add_line_5);
        formData.append("contact", contact);
        formData.append("email", email);
        formData.append("guardianName", guardian_name);
        formData.append("guardianContact", guardian_contact);

        $.ajax({
            url: 'http://localhost:8080/hello_shoes/api/v1/employee/update',
            method: 'PATCH',
            processData: false,
            contentType: false,
            headers: { "Authorization": "Bearer " + localStorage.getItem("hs_token") },
            data: formData,
            success: function (response) {
                alert("Employee details updated successfully");
                clearFields();

                $("#btnUpdate").prop("disabled", true);
                $("#btnDelete").prop("disabled", true);
                $("#btnAdd").prop("disabled", false);

                getAllEmployees();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(jqXHR);
                alert(jqXHR.responseJSON.message);
            }
        });
    }
})

$("#btnDelete").click(function (){
    let code = $("#emp_code").val();

    let result = window.confirm("Do you want to proceed?");
    if (result) {
        $.ajax({
            url: 'http://localhost:8080/hello_shoes/api/v1/employee/delete/' + code,
            method: 'DELETE',
            contentType: 'application/json',
            headers: { "Authorization": "Bearer " + localStorage.getItem("hs_token") },
            success: function (response) {
                alert("Employee deleted successfully");
                clearFields();

                $("#btnUpdate").prop("disabled", true);
                $("#btnDelete").prop("disabled", true);
                $("#btnAdd").prop("disabled", false);

                getAllEmployees();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseJSON.message);
                console.error(jqXHR);
            }
        });
    }
})

$("#btnReset").click(function (){
    clearFields();

    $("#btnAdd").prop("disabled", false);
    $("#btnUpdate").prop("disabled", true);
    $("#btnDelete").prop("disabled", true);
})

$("#searchField").keyup(function (){
    let prefix = $("#searchField").val();

    if(prefix == ""){
        getAllEmployees();
        return;
    }

    $.ajax({
        url: "http://localhost:8080/hello_shoes/api/v1/employee/search/" + prefix,
        headers: { "Authorization": "Bearer " + localStorage.getItem("hs_token") },
        method: "GET",
        success: function (response) {
            console.log(response);

            if(response.data.length == 0){
                $("#tableEmployeeBody").empty();
                let row = `<tr>
                    <td class="py-5" colspan="11">No Result Found</td>                                       
                    </tr>`;
                $('#tableEmployeeBody').append(row);
                return;
            }

            $("#tableEmployeeBody").empty();
            $.each(response.data, function (index, employee) {
                let row = `<tr>
                    <td>${employee.code}</td>  
                    <td>${employee.name}</td>  
                    <td>
                        <input class="d-none" disabled value="${employee.profilePic}">
                        <div class="profile-pic" style="width: 60px; height: 60px; border-radius: 50%; 
                        background-size: cover;
                        background-image: url(data:image;base64,${employee.profilePic});"></div>
                    </td>

                    <td>${employee.gender}</td>
                    <td>${employee.civilStatus}</td>
                    <td>${employee.designation}</td>
                    <td>${employee.role}</td>
                    <td>${employee.dob}</td>
                    <td>${employee.joinDate}</td>
                    <td>${employee.branch}</td>
                    <td class="td-address"></td>  
                    <td>${employee.contact}</td>
                    <td>${employee.email}</td>
                    <td>${employee.guardianName}</td>
                    <td>${employee.guardianContact}</td>                   
                    </tr>`;
                $('#tableEmployeeBody').append(row);

                // address
                if(employee.addressLine1 != ""){
                    let line1 = `<span id="span_add_1">${employee.addressLine1}</span>, `;
                    $(".td-address:last").append(line1);
                }
                if(employee.addressLine2 != ""){
                    let line2 = `<span id="span_add_2">${employee.addressLine2}</span>, `;
                    $(".td-address:last").append(line2);
                }
                let line3 = `<span id="span_add_3">${employee.addressLine3}</span>, `;
                let line4 = `<span id="span_add_4">${employee.addressLine4}</span>, `;
                let line5 = `<span id="span_add_5">${employee.addressLine5}</span>. `;
                $(".td-address:last").append(line3);
                $(".td-address:last").append(line4);
                $(".td-address:last").append(line5);
            });

            onTableRowClicked();
        },
        error: function (jqxhr, textStatus, error) {
            alert("searching employees failed.")
            console.log(jqxhr);
        }
    })
})

$("#btnGetAll").click(function (){
    getAllEmployees();
    $("#searchField").val("");
})

$(document).ajaxError(function(event, jqxhr, settings, thrownError) {
    console.log(event);
    if (jqxhr.status === 401) {
        window.location.href = '../../login.html';
    }
});

function onTableRowClicked() {
    $("#tableEmployeeBody>tr").click(function (){
        let row = $(this);

        let code = row.children().eq(0).text();
        let name = row.children().eq(1).text();
        let profile_pic = row.children().eq(2).children("input").val();
        let gender = row.children().eq(3).text();
        let status = row.children().eq(4).text();
        let designation = row.children().eq(5).text();
        let access_role = row.children().eq(6).text();
        let dob = row.children().eq(7).text();
        let date_of_join = row.children().eq(8).text();
        let attached_branch = row.children().eq(9).text();
        let address_line_1 = row.find("#span_add_1").text();
        let address_line_2 = row.find("#span_add_2").text();
        let address_line_3 = row.find("#span_add_3").text();
        let address_line_4 = row.find("#span_add_4").text();
        let address_line_5 = row.find("#span_add_5").text();
        let contact = row.children().eq(11).text();
        let email = row.children().eq(12).text();
        let guardian_name = row.children().eq(13).text();
        let guardian_contact = row.children().eq(14).text();

        // setting the value to the file picker
        let byteCharacters = atob(profile_pic);
        let byteNumbers = new Array(byteCharacters.length);
        for (var i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);
        let blob = new Blob([byteArray], { type: 'image/png' });

        // Create a file from the blob
        let file = new File([blob], 'image.png', { type: 'image/png' });
        console.log(file)

        let dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        let fileInput = document.getElementById('emp_profile_pic_hidden');
        fileInput.files = dataTransfer.files;
        $("#emp_profile_pic_visible").val("Previously Selected.");
        //end of setting the value to the file picker

        $("#emp_code").val(code);
        $("#emp_name").val(name);
        $("#emp_gender").val(gender);
        $("#emp_status").val(status);
        $("#emp_designation").val(designation);
        $("#emp_role").val(access_role);
        $("#emp_dob").val(dob);
        $("#emp_date_of_join").val(date_of_join);
        $("#emp_branch").val(attached_branch);
        $("#add_line_1").val(address_line_1);
        $("#add_line_2").val(address_line_2);
        $("#add_line_3").val(address_line_3);
        $("#add_line_4").val(address_line_4);
        $("#add_line_5").val(address_line_5);
        $("#emp_contact").val(contact);
        $("#emp_email").val(email);
        $("#emp_guardian_name").val(guardian_name);
        $("#emp_guardian_contact").val(guardian_contact);

        $("#btnUpdate").prop("disabled", false);
        $("#btnDelete").prop("disabled", false);
        $("#btnAdd").prop("disabled", true);
    });
}

function getAllEmployees(){
    $.ajax({
        url: "http://localhost:8080/hello_shoes/api/v1/employee/getall",
        headers: { "Authorization": "Bearer " + localStorage.getItem("hs_token") },
        method: "GET",
        success: function (response) {
            console.log(response);

            $("#tableEmployeeBody").empty();
            $.each(response.data, function (index, employee) {

                let row = `<tr>
                    <td>${employee.code}</td>  
                    <td>${employee.name}</td>  
                    <td>
                        <input class="d-none" disabled value="${employee.profilePic}">
                        <div class="profile-pic" style="width: 60px; height: 60px; border-radius: 50%; 
                        background-size: cover;
                        background-image: url(data:image;base64,${employee.profilePic});"></div>
                    </td>

                    <td>${employee.gender}</td>
                    <td>${employee.civilStatus}</td>
                    <td>${employee.designation}</td>
                    <td>${employee.role}</td>
                    <td>${employee.dob}</td>
                    <td>${employee.joinDate}</td>
                    <td>${employee.branch}</td>
                    <td class="td-address"></td>  
                    <td>${employee.contact}</td>
                    <td>${employee.email}</td>
                    <td>${employee.guardianName}</td>
                    <td>${employee.guardianContact}</td>                   
                    </tr>`;
                $('#tableEmployeeBody').append(row);

                // address
                if(employee.addressLine1 != ""){
                    let line1 = `<span id="span_add_1">${employee.addressLine1}</span>, `;
                    $(".td-address:last").append(line1);
                }
                if(employee.addressLine2 != ""){
                    let line2 = `<span id="span_add_2">${employee.addressLine2}</span>, `;
                    $(".td-address:last").append(line2);
                }
                let line3 = `<span id="span_add_3">${employee.addressLine3}</span>, `;
                let line4 = `<span id="span_add_4">${employee.addressLine4}</span>, `;
                let line5 = `<span id="span_add_5">${employee.addressLine5}</span>. `;
                $(".td-address:last").append(line3);
                $(".td-address:last").append(line4);
                $(".td-address:last").append(line5);
            });

            onTableRowClicked();
        },
        error: function (jqxhr, textStatus, error) {
            alert("retrieving employees failed.")
            console.log(jqxhr);
        }
    })
}

function generateNextEmployeeId() {
    $.ajax({
        url: "http://localhost:8080/hello_shoes/api/v1/employee/getlastid",
        method: "GET",
        contentType: "application/json",
        headers: { "Authorization": "Bearer " + localStorage.getItem("hs_token") },
        success: function (response) {
            if(response == ""){
                $("#emp_code").val("EMP-001");
            }else{
                let numericPart = parseInt(response.split('-')[1]);
                let nextNumericPart = numericPart + 1;
                let nextId = `EMP-${String(nextNumericPart).padStart(3, '0')}`;
                $("#emp_code").val(nextId);
            }
        },
        error: function (jqxhr, textStatus, error) {
            console.log(jqxhr);
        }
    })
}

function clearFields() {
    generateNextEmployeeId();

    $("#emp_code").val("");
    $("#emp_name").val("");
    $("#emp_gender").val("");
    $("#emp_profile_pic_hidden").val("");
    $("#emp_profile_pic_visible").val("");
    $("#emp_status").val("");
    $("#emp_designation").val("");
    $("#emp_role").val("");
    $("#emp_dob").val("");
    $("#emp_date_of_join").val("");
    $("#emp_branch").val("");
    $("#add_line_1").val("");
    $("#add_line_2").val("");
    $("#add_line_3").val("");
    $("#add_line_4").val("");
    $("#add_line_5").val("");
    $("#emp_contact").val("");
    $("#emp_email").val("");
    $("#emp_guardian_name").val("");
    $("#emp_guardian_contact").val("");
}

function validateFields(){
    let requiredFieldsAreFilled = checkRequiredFields();

    if(!requiredFieldsAreFilled){
        return false;
    }

    let code = $("#emp_code").val();
    let name = $("#emp_name").val()
    let status = $("#emp_status").val()
    let email = $("#emp_email").val();
    let contact = $("#emp_contact").val();
    let guardian_contact = $("#emp_guardian_contact").val();
    let guardian_name = $("#emp_guardian_name").val();
    let designation = $("#emp_designation").val();

    let validated = true;
    if (!validate(code, /^EMP-\d+$/)) {
        $("#el_emp_code").css("display", "block");
        clearErrorLabel("#emp_code");
        validated = false;
    }
    if (!validate(name, /^[A-Za-z\s]+$/)) {
        $("#el_emp_name").css("display", "block");
        clearErrorLabel("#emp_name");
        validated = false;
    }
    if (!validate(status, /^[A-Za-z\s]+$/)) {
        $("#el_emp_status").css("display", "block");
        clearErrorLabel("#emp_status");
        validated = false;
    }
    if (!validate(email, /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
        $("#el_emp_email").css("display", "block");
        clearErrorLabel("#emp_email");
        validated = false;
    }
    if (!validate(contact, /^(\+ ?)?(?:[0-9] ?){6,14}[0-9]$|^$/)) {
        $("#el_emp_contact").css("display", "block");
        clearErrorLabel("#emp_contact");
        validated = false;
    }
    if (!validate(guardian_contact, /^(\+ ?)?(?:[0-9] ?){6,14}[0-9]$|^$/)) {
        $("#el_emp_guardian_contact").css("display", "block");
        clearErrorLabel("#emp_guardian_contact");
        validated = false;
    }
    if (!validate(designation, /^[A-Za-z\s]+$/)) {
        $("#el_emp_designation").css("display", "block");
        clearErrorLabel("#emp_designation");
        validated = false;
    }
    if (!validate(guardian_name, /^[A-Za-z\s]+$|^$/)) {
        $("#el_emp_guardian_name").css("display", "block");
        clearErrorLabel("#emp_guardian_name");
        validated = false;
    }

    return validated;
}

function checkRequiredFields() {
    if(
        $("#emp_code").val() == "" || $("#emp_name").val() == "" || $("#emp_profile_pic_hidden").val() == "" ||
        $("#emp_gender").val() == null || $("#emp_status").val() == "" || $("#emp_designation").val() == "" ||
        $("#emp_role").val() == null || $("#emp_dob").val() == "" || $("#emp_date_of_join").val() == "" ||
        $("#emp_branch").val() == "" || $("#add_line_3").val() == "" || $("#add_line_4").val() == "" ||
        $("#add_line_5").val() == "" || $("#emp_contact").val() == "" || $("#emp_email").val() == ""
    ){
        if ($("#emp_code").val() == "") alert("Employee Code is empty");
        else if ($("#emp_name").val() == "") alert("Employee Name is empty");
        else if ($("#emp_profile_pic_hidden").val() == "") alert("No profile picture selected");
        else if ($("#emp_gender").val() == null) alert("Gender is not selected");
        else if ($("#emp_status").val() == "") alert("Status is empty");
        else if ($("#emp_designation").val() == "") alert("Designation is empty");
        else if ($("#emp_role").val() == null) alert("Access Role is not selected");
        else if ($("#emp_dob").val() == "") alert("Date Of Birth is empty");
        else if ($("#emp_date_of_join").val() == "") alert("Date Of Join is empty");
        else if ($("#emp_branch").val() == null) alert("Branch is not selected");
        else if ($("#add_line_3").val() == "") alert("Main City is empty");
        else if ($("#add_line_4").val() == "") alert("Main State is empty");
        else if ($("#add_line_5").val() == "") alert("Postal Code is empty");
        else if ($("#emp_contact").val() == "") alert("Employee Contact is empty");
        else if ($("#emp_email").val() == "") alert("Email is empty");

        return false;
    }else{
        return true;
    }
}

function validate(value, regex){
    if(regex.test(value)){
        return true;
    }else{
        return false;
    }
}

function clearErrorLabel(elementId) {
    $(elementId).on("keyup", function(){
        $(elementId + "+ label").css("display", "none");
    })
}

$(document).ready(function () {
    generateNextCustomerId();
    getAllCustomers();

    var currentDate = new Date().toISOString().slice(0,10);
    $('#cust_loyalty_join_date').val(currentDate);
});

$("#btnAdd").click(function (){
    let validated = validateFields();
    if(validated){
        let code = $("#cust_code").val();
        let name = $("#cust_name").val();
        let gender = $("#cust_gender").val();
        let loyalty_joined_date = $("#cust_loyalty_join_date").val();
        let loyalty_points = $("#cust_points").val();

        let loyalty_level;
        if(loyalty_points < 50){
            loyalty_level = "NEW";
        }else if(loyalty_points >= 50 && loyalty_points < 100){
            loyalty_level = "BRONZE";
        }else if(loyalty_points >= 100 && loyalty_points < 200){
            loyalty_level = "SILVER";
        }else if(loyalty_points >= 200){
            loyalty_level = "GOLD";
        }

        let dob = $("#cust_dob").val();
        let add_line_1 = $("#add_line_1").val();
        let add_line_2 = $("#add_line_2").val();
        let add_line_3 = $("#add_line_3").val();
        let add_line_4 = $("#add_line_4").val();
        let add_line_5 = $("#add_line_5").val();
        let contact = $("#cust_contact").val();
        let email = $("#cust_email").val();

        $.ajax({
            url: 'http://localhost:8080/hello_shoes/api/v1/customer/save',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({"code": code, "name": name, "gender": gender,"loyaltyJoinedDate": loyalty_joined_date,
                "loyaltyLevel": loyalty_level, "loyaltyPoints": loyalty_points, "dob": dob, "addressLine1": add_line_1,
                "addressLine2": add_line_2, "addressLine3": add_line_3, "addressLine4": add_line_4,
                "addressLine5": add_line_5, "contact": contact, "email": email}),
            success: function (response) {
                alert("Customer details saved successfully");
                clearFields();

                $("#btnUpdate").prop("disabled", true);
                $("#btnDelete").prop("disabled", true);
                $("#btnAdd").prop("disabled", false);

                getAllCustomers();
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
        let code = $("#cust_code").val();
        let name = $("#cust_name").val()
        let gender = $("#cust_gender").val();
        let loyalty_joined_date = $("#cust_loyalty_join_date").val();
        let loyalty_points = $("#cust_points").val();

        let loyalty_level;
        if(loyalty_points < 50){
            loyalty_level = "NEW";
        }else if(loyalty_points >= 50 && loyalty_points < 100){
            loyalty_level = "BRONZE";
        }else if(loyalty_points >= 100 && loyalty_points < 200){
            loyalty_level = "SILVER";
        }else if(loyalty_points >= 200){
            loyalty_level = "GOLD";
        }

        let dob = $("#cust_dob").val();
        let add_line_1 = $("#add_line_1").val();
        let add_line_2 = $("#add_line_2").val();
        let add_line_3 = $("#add_line_3").val();
        let add_line_4 = $("#add_line_4").val();
        let add_line_5 = $("#add_line_5").val();
        let contact = $("#cust_contact").val();
        let email = $("#cust_email").val();
        let last_purchase = $("#cust_last_purchase").val();

        $.ajax({
            url: 'http://localhost:8080/hello_shoes/api/v1/customer/update',
            method: 'PATCH',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({"code": code, "name": name, "gender": gender,"loyaltyJoinedDate": loyalty_joined_date,
                "loyaltyLevel": loyalty_level, "loyaltyPoints": loyalty_points, "dob": dob, "addressLine1": add_line_1,
                "addressLine2": add_line_2, "addressLine3": add_line_3, "addressLine4": add_line_4,
                "addressLine5": add_line_5, "contact": contact, "email": email, "recentPurchaseDate": last_purchase}),
            success: function (response) {
                alert("Customer details updated successfully");
                clearFields();

                $("#btnUpdate").prop("disabled", true);
                $("#btnDelete").prop("disabled", true);
                $("#btnAdd").prop("disabled", false);

                getAllCustomers();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseJSON.message);
                console.error(jqXHR);
            }
        });
    }
})

$("#btnDelete").click(function (){
    let code = $("#cust_code").val();

    let result = window.confirm("Do you want to proceed?");
    if (result) {
        $.ajax({
            url: 'http://localhost:8080/hello_shoes/api/v1/customer/delete/' + code,
            method: 'DELETE',
            contentType: 'application/json',
            success: function (response) {
                alert("Customer deleted successfully");
                clearFields();

                $("#btnUpdate").prop("disabled", true);
                $("#btnDelete").prop("disabled", true);
                $("#btnAdd").prop("disabled", false);

                getAllCustomers();
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
        getAllCustomers();
        return;
    }

    $.ajax({
        url: "http://localhost:8080/hello_shoes/api/v1/customer/search/" + prefix,
        method: "GET",
        contentType: "application/json",
        success: function (response) {
            console.log(response);

            if(response.data.length == 0){
                $("#tableCustomerBody").empty();
                let row = `<tr>
                    <td class="py-5" colspan="11">No Result Found</td>                                       
                    </tr>`;
                $('#tableCustomerBody').append(row);
                return;
            }

            $("#tableCustomerBody").empty();
            $.each(response.data, function (index, customer) {
                // recent purchase date
                if(customer.recentPurchaseDate == null){
                    customer.recentPurchaseDate = "No purchases yet.";
                }

                let row = `<tr>
                    <td>${customer.code}</td>  
                    <td>${customer.name}</td>  
                    <td>${customer.gender}</td> 
                    <td>${customer.loyaltyJoinedDate}</td>  
                    <td>${customer.loyaltyLevel}</td>  
                    <td>${customer.loyaltyPoints}</td> 
                    <td>${customer.dob}</td>  
                    <td class="td-address">                     
                    </td>  
                    <td>${customer.contact}</td> 
                    <td>${customer.email}</td>  
                    <td>${customer.recentPurchaseDate}</td>                                        
                    </tr>`;
                $('#tableCustomerBody').append(row);

                // address
                if(customer.addressLine1 != ""){
                    let line1 = `<span id="span_add_1">${customer.addressLine1}</span>, `;
                    $(".td-address:last").append(line1);
                }
                if(customer.addressLine2 != ""){
                    let line2 = `<span id="span_add_2">${customer.addressLine2}</span>, `;
                    $(".td-address:last").append(line2);
                }

                let line3 = `<span id="span_add_3">${customer.addressLine3}</span>, `;
                let line4 = `<span id="span_add_4">${customer.addressLine4}</span>, `;
                let line5 = `<span id="span_add_5">${customer.addressLine5}</span>.`;

                $(".td-address:last").append(line3);
                $(".td-address:last").append(line4);
                $(".td-address:last").append(line5);
            });

            onTableRowClicked();
        },
        error: function (jqxhr, textStatus, error) {
            alert("searching customers failed.")
            console.log(jqxhr);
        }
    })
})

$("#btnGetAll").click(function (){
    getAllCustomers();
    $("#searchField").val("");
})

function getAllCustomers(){
    $.ajax({
        url: "http://localhost:8080/hello_shoes/api/v1/customer/getall",
        method: "GET",
        contentType: "application/json",
        success: function (response) {
            console.log(response);

            $("#tableCustomerBody").empty();
            $.each(response.data, function (index, customer) {

                // recent purchase date
                if(customer.recentPurchaseDate == null){
                    customer.recentPurchaseDate = "No purchases yet.";
                }

                let row = `<tr>
                    <td>${customer.code}</td>  
                    <td>${customer.name}</td>  
                    <td>${customer.gender}</td> 
                    <td>${customer.loyaltyJoinedDate}</td>  
                    <td>${customer.loyaltyLevel}</td>  
                    <td>${customer.loyaltyPoints}</td> 
                    <td>${customer.dob}</td>  
                    <td class="td-address">                     
                    </td>  
                    <td>${customer.contact}</td> 
                    <td>${customer.email}</td>  
                    <td>${customer.recentPurchaseDate}</td>                                        
                    </tr>`;
                $('#tableCustomerBody').append(row);

                // address
                if(customer.addressLine1 != ""){
                    let line1 = `<span id="span_add_1">${customer.addressLine1}</span>, `;
                    $(".td-address:last").append(line1);
                }
                if(customer.addressLine2 != ""){
                    let line2 = `<span id="span_add_2">${customer.addressLine2}</span>, `;
                    $(".td-address:last").append(line2);
                }

                let line3 = `<span id="span_add_3">${customer.addressLine3}</span>, `;
                let line4 = `<span id="span_add_4">${customer.addressLine4}</span>, `;
                let line5 = `<span id="span_add_5">${customer.addressLine5}</span>.`;

                $(".td-address:last").append(line3);
                $(".td-address:last").append(line4);
                $(".td-address:last").append(line5);
            });

            onTableRowClicked();
        },
        error: function (jqxhr, textStatus, error) {
            alert("retrieving customers failed.")
            console.log(jqxhr);
        }
    })
}

function generateNextCustomerId() {
    $.ajax({
        url: "http://localhost:8080/hello_shoes/api/v1/customer/getlastid",
        method: "GET",
        contentType: "application/json",
        success: function (response) {
            if(response == ""){
                $("#cust_code").val("CUS-001");
            }else{
                let numericPart = parseInt(response.split('-')[1]);
                let nextNumericPart = numericPart + 1;
                let nextId = `CUS-${String(nextNumericPart).padStart(3, '0')}`;
                $("#cust_code").val(nextId);
            }
        },
        error: function (jqxhr, textStatus, error) {
            console.log(jqxhr);
        }
    })
}

function onTableRowClicked() {
    $("#tableCustomerBody>tr").click(function (){
        let row = $(this);

        let code = row.children().eq(0).text();
        let name = row.children().eq(1).text();
        let gender = row.children().eq(2).text();
        let loyalty_membership_date = row.children().eq(3).text();
        let loyalty_points = row.children().eq(5).text();
        let dob = row.children().eq(6).text();
        let address_line_1 = row.find("#span_add_1").text();
        let address_line_2 = row.find("#span_add_2").text();
        let address_line_3 = row.find("#span_add_3").text();
        let address_line_4 = row.find("#span_add_4").text();
        let address_line_5 = row.find("#span_add_5").text();
        let contact = row.children().eq(8).text();
        let email = row.children().eq(9).text();
        let last_purchase = row.children().eq(10).text();

        if(last_purchase == "No purchases yet."){
            last_purchase = "";
        }

        $("#cust_code").val(code);
        $("#cust_name").val(name);
        $("#cust_gender").val(gender);
        $("#cust_loyalty_join_date").val(loyalty_membership_date);
        $("#cust_points").val(loyalty_points);
        $("#cust_dob").val(dob);
        $("#add_line_1").val(address_line_1);
        $("#add_line_2").val(address_line_2);
        $("#add_line_3").val(address_line_3);
        $("#add_line_4").val(address_line_4);
        $("#add_line_5").val(address_line_5);
        $("#cust_contact").val(contact);
        $("#cust_email").val(email);
        $("#cust_last_purchase").val(last_purchase);

        $("#btnUpdate").prop("disabled", false);
        $("#btnDelete").prop("disabled", false);
        $("#btnAdd").prop("disabled", true);
    });
}

function clearFields() {
    generateNextCustomerId();

    $("#cust_name").val("");
    $("#cust_gender").val("");
    $("#cust_dob").val("");
    $("#add_line_1").val("");
    $("#add_line_2").val("");
    $("#add_line_3").val("");
    $("#add_line_4").val("");
    $("#add_line_5").val("");
    $("#cust_contact").val("");
    $("#cust_email").val("");

    $("#cust_points").val(0);

    var currentDate = new Date().toISOString().slice(0,10);
    $('#cust_loyalty_join_date').val(currentDate);
}

function checkRequiredFields() {
    if(
        $("#cust_code").val() == "" || $("#cust_name").val() == "" || $("#cust_gender").val() == null ||
        $("#cust_loyalty_join_date").val() == "" || $("#cust_points").val() == "" || $("#cust_dob").val() == "" ||
        $("#add_line_3").val() == "" || $("#add_line_4").val() == "" || $("#add_line_5").val() == "" ||
        $("#cust_contact").val() == "" || $("#cust_email").val() == ""
    ){
        if ($("#cust_code").val() == "") alert("Customer Code is empty");
        else if ($("#cust_name").val() == "") alert("Customer Name is empty");
        else if ($("#cust_gender").val() == null) alert("Gender is not selected");
        else if ($("#cust_loyalty_join_date").val() == "") alert("Joined date as a loyalty customer is not selected");
        else if ($("#cust_points").val() == "") alert("Total Points is empty");
        else if ($("#cust_dob").val() == "") alert("Date Of Birth is empty");
        else if ($("#add_line_3").val() == "") alert("Main City is empty");
        else if ($("#add_line_4").val() == "") alert("Main State is empty");
        else if ($("#add_line_5").val() == "") alert("Postal Code is empty");
        else if ($("#cust_contact").val() == "") alert("Contact Number is empty");
        else if ($("#cust_email").val() == "") alert("Email is empty");

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

function validateFields(){
    let requiredFieldsAreFilled = checkRequiredFields();

    if(!requiredFieldsAreFilled){
        return false;
    }

    let code = $("#cust_code").val();
    let name = $("#cust_name").val()
    let contact = $("#cust_contact").val();
    let email = $("#cust_email").val();
    // let add_line_1 = $("#add_line_1").val();
    // let add_line_2 = $("#add_line_2").val();
    // let add_line_3 = $("#add_line_3").val();
    // let add_line_4 = $("#add_line_4").val();
    // let add_line_5 = $("#add_line_5").val();

    let validated = true;
    if (!validate(code, /^CUS-\d+$/)) {
        $("#el_cust_code").css("display", "block");
        clearErrorLabel("#cust_code");
        validated = false;
    }
    if (!validate(name, /^[A-Za-z\s]+$/)) {
        $("#el_cust_name").css("display", "block");
        clearErrorLabel("#cust_name");
        validated = false;
    }
    if (!validate(contact, /^\+94\d{9}$|^0\d{9}$|^0\d{2}-\d{7}$/)) {
        $("#el_cust_contact").css("display", "block");
        clearErrorLabel("#cust_contact");
        validated = false;
    }
    if (!validate(email, /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
        $("#el_cust_email").css("display", "block");
        clearErrorLabel("#cust_email");
        validated = false;
    }
    // if (!validate(add_line_1, /^[a-zA-Z0-9\s.,-]*$/  )) {
    //     $("#el_add_line_1").css("display", "block");
    //     clearErrorLabel("#cust_email");
    //     validated = false;
    // }
    // if (!validate(add_line_2, /^[a-zA-Z0-9\s.,-]*$/  )) {
    //     $("#el_add_line_2").css("display", "block");
    //     clearErrorLabel("#cust_email");
    //     validated = false;
    // }
    // if (!validate(add_line_3, /^[a-zA-Z0-9\s.,-]*$/  )) {
    //     $("#el_add_line_3").css("display", "block");
    //     clearErrorLabel("#cust_email");
    //     validated = false;
    // }
    // if (!validate(add_line_4, /^[a-zA-Z0-9\s.,-]*$/  )) {
    //     $("#el_add_line_4").css("display", "block");
    //     clearErrorLabel("#cust_email");
    //     validated = false;
    // }
    // if (!validate(add_line_5, /^[a-zA-Z0-9\s.,-]*$/  )) {
    //     $("#el_add_line_5").css("display", "block");
    //     clearErrorLabel("#cust_email");
    //     validated = false;
    // }

    return validated;
}

function clearErrorLabel(elementId) {
    $(elementId).on("keyup", function(){
        $(elementId + "+ label").css("display", "none");
    })
}
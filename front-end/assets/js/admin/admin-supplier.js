$(document).ready(function () {
    generateNextSupplierId();
    getAllSuppliers();
});

$("#btnAdd").click(function (){
    let validated = validateFields();
    if(validated){
        let code = $("#supp_code").val();
        let name = $("#supp_name").val();
        let category = $("#supp_category").val();
        let add_line_1 = $("#add_line_1").val();
        let add_line_2 = $("#add_line_2").val();
        let add_line_3 = $("#add_line_3").val();
        let add_line_4 = $("#add_line_4").val();
        let add_line_5 = $("#add_line_5").val();
        let add_line_6 = $("#add_line_6").val();
        let mobile_contact = $("#supp_contact_mobile").val();
        let landline_contact = $("#supp_contact_landline").val();
        let email = $("#supp_email").val();

        $.ajax({
            url: 'http://localhost:8080/hello_shoes/api/v1/supplier/save',
            headers: { "Authorization": "Bearer " + localStorage.getItem("hs_token") },
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({"code": code, "name": name, "category": category, "addressLine1": add_line_1,
                "addressLine2": add_line_2, "addressLine3": add_line_3, "addressLine4": add_line_4,
                "addressLine5": add_line_5, "addressLine6": add_line_6, "mobile_contact": mobile_contact,
                "landline_contact": landline_contact, "email": email}),
            success: function (response) {
                alert("Supplier details saved successfully");
                clearFields();

                $("#btnUpdate").prop("disabled", true);
                $("#btnDelete").prop("disabled", true);
                $("#btnAdd").prop("disabled", false);

                getAllSuppliers();
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
        let code = $("#supp_code").val();
        let name = $("#supp_name").val();
        let category = $("#supp_category").val();
        let add_line_1 = $("#add_line_1").val();
        let add_line_2 = $("#add_line_2").val();
        let add_line_3 = $("#add_line_3").val();
        let add_line_4 = $("#add_line_4").val();
        let add_line_5 = $("#add_line_5").val();
        let add_line_6 = $("#add_line_6").val();
        let mobile_contact = $("#supp_contact_mobile").val();
        let landline_contact = $("#supp_contact_landline").val();
        let email = $("#supp_email").val();

        $.ajax({
            url: 'http://localhost:8080/hello_shoes/api/v1/supplier/update',
            headers: { "Authorization": "Bearer " + localStorage.getItem("hs_token") },
            method: 'PATCH',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({"code": code, "name": name, "category": category, "addressLine1": add_line_1,
                "addressLine2": add_line_2, "addressLine3": add_line_3, "addressLine4": add_line_4,
                "addressLine5": add_line_5, "addressLine6": add_line_6, "mobile_contact": mobile_contact,
                "landline_contact": landline_contact, "email": email}),
            success: function (response) {
                alert("Supplier details updated successfully");
                clearFields();

                $("#btnUpdate").prop("disabled", true);
                $("#btnDelete").prop("disabled", true);
                $("#btnAdd").prop("disabled", false);

                getAllSuppliers();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseJSON.message);
                console.error(jqXHR);
            }
        });
    }
})

$("#btnDelete").click(function (){
    let code = $("#supp_code").val();

    let result = window.confirm("Do you want to proceed?");
    if (result) {
        $.ajax({
            url: 'http://localhost:8080/hello_shoes/api/v1/supplier/delete/' + code,
            headers: { "Authorization": "Bearer " + localStorage.getItem("hs_token") },
            method: 'DELETE',
            contentType: 'application/json',
            success: function (response) {
                alert("Supplier deleted successfully");
                clearFields();

                $("#btnUpdate").prop("disabled", true);
                $("#btnDelete").prop("disabled", true);
                $("#btnAdd").prop("disabled", false);

                getAllSuppliers();
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
        getAllSuppliers();
        return;
    }

    $.ajax({
        url: "http://localhost:8080/hello_shoes/api/v1/supplier/search/" + prefix,
        headers: { "Authorization": "Bearer " + localStorage.getItem("hs_token") },
        method: "GET",
        contentType: "application/json",
        success: function (response) {
            console.log(response);

            if(response.data.length == 0){
                $("#tableSupplierBody").empty();
                let row = `<tr>
                    <td class="py-5" colspan="7">No Result Found</td>                                       
                    </tr>`;
                $('#tableSupplierBody').append(row);
                return;
            }

            $("#tableSupplierBody").empty();
            $.each(response.data, function (index, supplier) {

                let row = `<tr>
                    <td>${supplier.code}</td>  
                    <td>${supplier.name}</td>  
                    <td>${supplier.category}</td> 
                    <td class="td-address">                     
                    </td>  
                    <td>${supplier.mobile_contact}</td> 
                    <td>${supplier.landline_contact}</td> 
                    <td>${supplier.email}</td>  
                    </tr>`;
                $('#tableSupplierBody').append(row);

                // address
                if(supplier.addressLine1 != ""){
                    let line1 = `<span id="span_add_1">${supplier.addressLine1}</span>, `;
                    $(".td-address:last").append(line1);
                }
                if(supplier.addressLine2 != ""){
                    let line2 = `<span id="span_add_2">${supplier.addressLine2}</span>, `;
                    $(".td-address:last").append(line2);
                }

                let line3 = `<span id="span_add_3">${supplier.addressLine3}</span>, `;
                let line4 = `<span id="span_add_4">${supplier.addressLine4}</span>, `;
                let line5 = `<span id="span_add_5">${supplier.addressLine5}</span>.`;
                let line6 = `<span id="span_add_6">${supplier.addressLine6}</span>.`;

                $(".td-address:last").append(line3);
                $(".td-address:last").append(line4);
                $(".td-address:last").append(line5);
                $(".td-address:last").append(line6);
            });

            onTableRowClicked();
        },
        error: function (jqxhr, textStatus, error) {
            alert("searching suppliers failed.")
            console.log(jqxhr);
        }
    })
})

$("#btnGetAll").click(function (){
    getAllSuppliers();
    $("#searchField").val("");
})

$(document).ajaxError(function(event, jqxhr, settings, thrownError) {
    console.log(event);
    if (jqxhr.status === 401) {
        window.location.href = '../../login.html';
    }
});

function getAllSuppliers(){
    $.ajax({
        url: "http://localhost:8080/hello_shoes/api/v1/supplier/getall",
        headers: { "Authorization": "Bearer " + localStorage.getItem("hs_token") },
        method: "GET",
        contentType: "application/json",
        success: function (response) {
            console.log(response);

            $("#tableSupplierBody").empty();
            $.each(response.data, function (index, supplier) {

                let row = `<tr>
                    <td>${supplier.code}</td>  
                    <td>${supplier.name}</td>  
                    <td>${supplier.category}</td> 
                    <td class="td-address">                     
                    </td>  
                    <td>${supplier.mobile_contact}</td> 
                      <td>${supplier.landline_contact}</td> 
                    <td>${supplier.email}</td>  
                    </tr>`;
                $('#tableSupplierBody').append(row);

                // address
                if(supplier.addressLine1 != ""){
                    let line1 = `<span id="span_add_1">${supplier.addressLine1}</span>, `;
                    $(".td-address:last").append(line1);
                }
                if(supplier.addressLine2 != ""){
                    let line2 = `<span id="span_add_2">${supplier.addressLine2}</span>, `;
                    $(".td-address:last").append(line2);
                }

                let line3 = `<span id="span_add_3">${supplier.addressLine3}</span>, `;
                let line4 = `<span id="span_add_4">${supplier.addressLine4}</span>, `;
                let line5 = `<span id="span_add_5">${supplier.addressLine5}</span>, `;
                let line6 = `<span id="span_add_6">${supplier.addressLine6}</span>.`;

                $(".td-address:last").append(line3);
                $(".td-address:last").append(line4);
                $(".td-address:last").append(line5);
                $(".td-address:last").append(line6);
            });

            onTableRowClicked();
        },
        error: function (jqxhr, textStatus, error) {
            alert("retrieving suppliers failed.")
            console.log(jqxhr);
        }
    })
}

function generateNextSupplierId() {
    $.ajax({
        url: "http://localhost:8080/hello_shoes/api/v1/supplier/getlastid",
        headers: { "Authorization": "Bearer " + localStorage.getItem("hs_token") },
        method: "GET",
        contentType: "application/json",
        success: function (response) {
            if(response == ""){
                $("#supp_code").val("SUP-001");
            }else{
                let numericPart = parseInt(response.split('-')[1]);
                let nextNumericPart = numericPart + 1;
                let nextId = `SUP-${String(nextNumericPart).padStart(3, '0')}`;
                $("#supp_code").val(nextId);
            }
        },
        error: function (jqxhr, textStatus, error) {
            console.log(jqxhr);
        }
    })
}

function onTableRowClicked() {
    $("#tableSupplierBody>tr").click(function (){
        let row = $(this);

        let code = row.children().eq(0).text();
        let name = row.children().eq(1).text();
        let category = row.children().eq(2).text();
        let address_line_1 = row.find("#span_add_1").text();
        let address_line_2 = row.find("#span_add_2").text();
        let address_line_3 = row.find("#span_add_3").text();
        let address_line_4 = row.find("#span_add_4").text();
        let address_line_5 = row.find("#span_add_5").text();
        let address_line_6 = row.find("#span_add_6").text();
        let mobile_contact = row.children().eq(4).text();
        let landline_contact = row.children().eq(5).text();
        let email = row.children().eq(6).text();

        $("#supp_code").val(code);
        $("#supp_name").val(name);
        $("#supp_category").val(category);
        $("#add_line_1").val(address_line_1);
        $("#add_line_2").val(address_line_2);
        $("#add_line_3").val(address_line_3);
        $("#add_line_4").val(address_line_4);
        $("#add_line_5").val(address_line_5);
        $("#add_line_6").val(address_line_6);
        $("#supp_contact_mobile").val(mobile_contact);
        $("#supp_contact_landline").val(landline_contact);
        $("#supp_email").val(email);

        $("#btnUpdate").prop("disabled", false);
        $("#btnDelete").prop("disabled", false);
        $("#btnAdd").prop("disabled", true);
    });
}

function clearFields() {
    generateNextSupplierId();

    $("#supp_name").val("");
    $("#supp_category").val("");
    $("#add_line_1").val("");
    $("#add_line_2").val("");
    $("#add_line_3").val("");
    $("#add_line_4").val("");
    $("#add_line_5").val("");
    $("#add_line_6").val("");
    $("#supp_contact_mobile").val("");
    $("#supp_contact_landline").val("");
    $("#supp_email").val("");
}

function checkRequiredFields() {
    if(
        $("#supp_code").val() == "" || $("#supp_name").val() == "" || $("#supp_category").val() == null ||
        $("#add_line_3").val() == "" || $("#add_line_4").val() == "" || $("#add_line_5").val() == "" ||
        $("#add_line_5").val() == "" || $("#supp_contact_mobile").val() == "" &&
        $("#supp_contact_landline").val() == "" || $("#supp_email").val() == ""
    ){
        if ($("#supp_code").val() == "") alert("Supplier Code is empty");
        else if ($("#supp_name").val() == "") alert("Supplier Name is empty");
        else if ($("#supp_category").val() == null) alert("Category is not selected");
        else if ($("#add_line_3").val() == "") alert("Main City is empty");
        else if ($("#add_line_4").val() == "") alert("Main State is empty");
        else if ($("#add_line_5").val() == "") alert("Postal Code is empty");
        else if ($("#add_line_6").val() == "") alert("Origin Country is empty");
        else if ($("#supp_contact_mobile").val() == "" && $("#supp_contact_landline").val() == "")
            alert("At least one contact number is required");
        else if ($("#supp_email").val() == "") alert("Email is empty");

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

    let code = $("#supp_code").val();
    let name = $("#supp_name").val()
    let email = $("#supp_email").val();

    let validated = true;
    if (!validate(code, /^SUP-\d+$/)) {
        $("#el_supp_code").css("display", "block");
        clearErrorLabel("#supp_code");
        validated = false;
    }
    if (!validate(name, /^[A-Za-z\s]+$/)) {
        $("#el_supp_name").css("display", "block");
        clearErrorLabel("#supp_name");
        validated = false;
    }
    if (!validate(email, /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
        $("#el_supp_email").css("display", "block");
        clearErrorLabel("#supp_email");
        validated = false;
    }

    let mobile_contact = $("#supp_contact_mobile").val();
    if(mobile_contact != ""){
        if (!validate(mobile_contact, /^(\+ ?)?(?:[0-9] ?){6,14}[0-9]$|^$/)) {
            $("#el_supp_contact_mobile").css("display", "block");
            clearErrorLabel("#supp_contact_mobile");
            validated = false;
        }
    }
    let landline_contact = $("#supp_contact_landline").val();
    if(landline_contact != ""){
        if (!validate(landline_contact, /^(\+ ?)?(?:[0-9] ?){6,14}[0-9]$|^$/)) {
            $("#el_supp_contact_landline").css("display", "block");
            clearErrorLabel("#supp_contact_landline");
            validated = false;
        }
    }

    return validated;
}

function clearErrorLabel(elementId) {
    $(elementId).on("keyup", function(){
        $(elementId + "+ label").css("display", "none");
    })
}
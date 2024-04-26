$(document).ready(function () {
    generateNextCustomerId();
    getAllCustomers();
});

$("#btnAdd").click(function (){
    let code = $("#cust_code").val();
    let name = $("#cust_name").val();
    let gender = $("#cust_gender").val();
    let loyalty_joined_date = $("#cust_loyalty_join_date").val();
    let loyalty_level = "NEW";
    let loyalty_points = 0;
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
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({"code": code, "name": name, "gender": gender,"loyaltyJoinedDate": loyalty_joined_date,
            "loyaltyLevel": loyalty_level, "loyaltyPoints": loyalty_points, "dob": dob, "addressLine1": add_line_1,
            "addressLine2": add_line_2, "addressLine3": add_line_3, "addressLine4": add_line_4,
            "addressLine5": add_line_5, "contact": contact, "email": email}),
        success: function (response) {
            console.log(response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Customer saving process failed.");
            console.error(jqXHR);
        }
    });
})

function getAllCustomers(){
    $.ajax({
        url: "http://localhost:8080/hello_shoes/api/v1/customer/getall",
        method: "GET",
        contentType: "application/json",
        success: function (response) {
            console.log(response);

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
    });
}

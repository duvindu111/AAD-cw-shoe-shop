$(document).ready(function () {
    generateNextOrderId();

    loadItemCodes().then(function() {
        loadCustomerCodes();
    });
});

$("#item_code").change(function () {
    let itemCode = $(this).val();

    $.ajax({
        url: 'http://localhost:8080/hello_shoes/api/v1/place_order/getItemByCode/' + itemCode,
        headers: { "Authorization": "Bearer " + localStorage.getItem("hs_token") },
        method: 'GET',
        contentType: 'application/json',
        success: function (response) {
            console.log(response);

            $("#product_img").attr("src", `data:image;base64,${response.data.itemPicture}`);
            $("#item_name").text(response.data.itemName);
            $("#unit_price").text(response.data.priceSale);

            getSizesByItemCode(itemCode);

            $(".item-related-block").css("display", "block");
            $(".item-related-flex").css("display", "flex");

        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR.responseJSON.message);
            console.error(jqXHR);
        }
    });
});

$("#item_size").change(function () {
    let size = $(this).val();
    let itemCode = $("#item_code").val();
    $("#buying_qty").val("");

    $.ajax({
        url: 'http://localhost:8080/hello_shoes/api/v1/place_order/getQtyByItemCodeAndSize/' + itemCode + '/' + size,
        headers: { "Authorization": "Bearer " + localStorage.getItem("hs_token") },
        method: 'GET',
        contentType: 'application/json',
        success: function (response) {
            console.log(response);

            $("#available_qty").text(response);
            $("#buying_qty").attr("max", response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR.responseJSON.message);
            console.error(jqXHR);
        }
    });
});

$("#cust_code").change(function () {
    let custCode = $(this).val();

    if(custCode != ""){
        $.ajax({
            url: 'http://localhost:8080/hello_shoes/api/v1/place_order/getCustomerByCode/' + custCode,
            headers: { "Authorization": "Bearer " + localStorage.getItem("hs_token") },
            method: 'GET',
            contentType: 'application/json',
            success: function (response) {
                console.log(response);

                $("#cust_name").text(response.data.name);
                $("#cust_email").text(response.data.email);
                $("#cust_contact").text(response.data.contact);
                $("#cust_level").text(response.data.loyaltyLevel);
                $("#cust_points").text(response.data.loyaltyPoints);

                $("#added_points").prop("disabled", false);
                $("#added_points").attr("max", response.data.loyaltyPoints);

                $(".cust-related-flex").css("display", "flex");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseJSON.message);
                console.error(jqXHR);
            }
        });
    }else {
        $(".cust-related-flex").css("display", "none");
    }

});

$("#btn_add_cart").click(function (){
    let itemCode = $("#item_code").val();
    let itemName = $("#item_name").text();
    let size = $("#item_size").val();
    let unitPrice =  $("#unit_price").text();
    let buying_qty = $("#buying_qty").val();

    if(itemCode != null){
        if(size==null || buying_qty == ""){
            alert("Size and quantity are required.");
        }else{
            let available_qty = $("#available_qty").text();
            let tableCheck = "notFound";
            $("#tableCartBody tr").each(function() {
                let tableItemCode = $(this).find("td:eq(0)").text();
                let tableSize = $(this).find("td:eq(2)").text();
                if(itemCode == tableItemCode && size == tableSize){     //if the itemCode and size is already in the table
                    tableCheck= "found";

                    let current_qty = $(this).find("td:eq(4)").text();
                    let new_qty = parseInt(current_qty) + parseInt(buying_qty);
                    console.log(new_qty);

                    if(parseInt(new_qty) > parseInt(available_qty)){
                        alert("insufficient item amount. Please order less than the available amount.");
                    }else{
                        $(this).find("td:eq(4)").text(new_qty);
                        // let newTotal = unitPrice * new_qty;
                        // $(this).find("td:eq(4)").text(newTotal);
                    }
                }
            });

            //if the itemCode is not already in the table
            if(tableCheck == "notFound"){
                if(parseInt(buying_qty) > parseInt(available_qty)){
                    alert(`insufficient item amount. Please enter an amount less than ${available_qty}.`);
                }else{
                    let row = `<tr>
                   <td>${itemCode}</td>
                   <td>${itemName}</td>
                   <td>${size}</td>
                   <td>${unitPrice}</td>
                   <td>${buying_qty}</td>
                   <td class="round-td">
                        <i class="fa-solid fa-xmark cart-remove-btn"></i>
                   </td>
                </tr>`;

                    $("#tableCartBody").append(row);
                    removeIconOnClicked();
                }
            }
        }
    }else{
        alert("Please select an item first")
    }

    let finalTotal = getTotalAfterDiscount();
    $("#total_price").text(finalTotal);
});

$("#btn_confirm").click(function(){
   if($("#tableCartBody tr").length > 0){
       if($("#payment_method").val() != null){
           if($("#name_of_user").text() != ""){
               if($("#code_of_employee").text() != ""){
                   //////////////////////////////////////////////
                   if($("#payment_method").val() == "CARD"){
                              $("#pm_card_modal").modal('show');
                   }else if($("#payment_method").val() == "CASH"){
                          $("#pm_cash_modal").modal('show');
                   }
                   //////////////////////////////////////////////
               }else{
                   alert("Seems to be a problem with the user account. Please check again.")
               }
           }else{
               alert("Seems to be a problem with the user account. Please check again.")
           }
       }else{
           alert("Please select a payment method");
       }
   }else{
       alert("Please add items to the cart first");
   }
});

$(".btn_place_order").click(function (){
    if($("#payment_method").val() == "CASH" || $("#payment_method").val() == "CARD" && paymentCardValidation){
        let order_id = $("#order_id").text();
        let order_date = new Date();
        let cust_code = $("#cust_code").val();
        let cust_name = $("#cust_name").text();
        let total = $("#total_price").text();
        let added_points = $("#added_points").val();
        let payment_method = $("#payment_method").val();
        let employee_code = $("#code_of_employee").text();
        let cashier_name = $("#name_of_user").text();

        console.log(order_date);

        let orderDetails = [];
        $("#tableCartBody tr").each(function() {
            let orderDetail = {
                orderId: order_id,
                itemCode: $(this).find("td:eq(0)").text(),
                itemName: $(this).find("td:eq(1)").text(),
                unitPrice: $(this).find("td:eq(3)").text(),
                size: $(this).find("td:eq(2)").text(),
                qty: $(this).find("td:eq(4)").text()
            }
            orderDetails.push(orderDetail);
        });

        $.ajax({
            url: 'http://localhost:8080/hello_shoes/api/v1/place_order/placeOrder',
            headers: { "Authorization": "Bearer " + localStorage.getItem("hs_token") },
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({"orderId": order_id, "orderDate": order_date, "customer": cust_code, "customerName": cust_name, "totalPrice": total,
                "addedPoints": added_points, "paymentMethod": payment_method, "employee": employee_code, "cashierName": cashier_name, "orderDetailList": orderDetails
            }),
            success: function (response) {
                alert("Order placed successfully.")
                resetPlaceOrderPage();
                $("#pm_card_modal").modal('hide');
                $("#pm_cash_modal").modal('hide');
                $(".cash-details").css("display", "none");
                $(".cash-details input").val("");
                $(".admin-details").css("display", "flex");
                $(".admin-details input").val("");
                console.log(response);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Order not placed. Please check again.")
                console.error(jqXHR);
            }
        });
    }
});

$("#added_points").keyup(function (){
   $("#total_price").text(getTotalAfterDiscount());
});

$(".btn_next").click(function (){
   let admin_email = $("#admin_email").val();
   let admin_password = $("#admin_password").val();

   if(admin_email == "" || admin_password == ""){
       alert("Please fill in all the fields");
   }else{
       $.ajax({
           url: 'http://localhost:8080/hello_shoes/api/v1/auth/check_credentials',
           headers: { "Authorization": "Bearer " + localStorage.getItem("hs_token") },
           method: 'POST',
           dataType: 'json',
           contentType: 'application/json',
           data: JSON.stringify({"email": admin_email, "password": admin_password}),
           success: function (response) {
               console.log(response);

               if(response == true){
                   $("#cash_header").text("Order ID: " + $("#order_id").text());
                   $(".admin-details").css("display", "none");
                   $("#cash_total").val($("#total_price").text());
                   $(".cash-details").css("display", "flex");
               }else{
                     alert("Invalid credentials. Please check again.");
               }
           },
           error: function (jqXHR, textStatus, errorThrown) {
               console.error(jqXHR);
               alert(jqXHR.responseJSON.message);
           }
       });
   }
});

$("#paid_amount").keyup(function(){
    let total = $("#cash_total").val();
    let paid_amount = $("#paid_amount").val();
    let balance = paid_amount - total;
    $("#balance").val(balance);

    console.log(balance);
    if(balance >= 0){
        $(".cash-details .btn_place_order").prop("disabled", false);
    }else{
        $(".cash-details .btn_place_order").prop("disabled", true);
    }
});

$(document).ajaxError(function(event, jqxhr, settings, thrownError) {
    console.log(event);
    if (jqxhr.status === 401) {
        window.location.href = '../../../login.html';
    }
});

function resetPlaceOrderPage(){
    generateNextOrderId();
    $("#item_code").val("");
    $("#item_size").val("");
    $("#buying_qty").val("");
    $("#available_qty").text("");
    $("#product_img").attr("src", "");
    $("#item_name").text("");
    $("#unit_price").text("");
    $("#added_points").val("");
    $("#total_price").text("");
    $("#cust_code").val("");
    $("#cust_name").text("");
    $("#cust_email").text("");
    $("#cust_contact").text("");
    $("#cust_level").text("");
    $("#cust_points").text("");
    $("#payment_method").val("");
    $("#tableCartBody").empty();
    $(".item-related-block").css("display", "none");
    $(".item-related-flex").css("display", "none");
    $(".cust-related-flex").css("display", "none");

}

function paymentCardValidation(){
    let card_no = $("#pm_card_no").val();
    let card_num = $("#card_num").val();
    let bank_name = $("#bank_name").val();
    let exp_date = $("#exp_date").val();
    let cvv = $("#cvv").val();
    let name_on_card = $("#name_on_card").val();

    if(card_num == "" || bank_name == "" || exp_date == "" || cvv == "" || name_on_card == ""){
        alert("Please fill in all the fields");
        return false;
    }else{
        let card_no_regex = new RegExp("^[0-9]{3,4}$");
        let cvv_regex = new RegExp("^[0-9]{3,4}$");
        let name_on_card_regex = new RegExp("^^[a-zA-Z ]{2,30}$");

        if(!card_no_regex.test(card_num)){
            alert("Invalid card number");
            return false;
        }else if(!cvv_regex.test(cvv)){
            alert("Invalid card cvc");
            return false;
        }else if(!name_on_card_regex.test(name_on_card)){
            alert("Invalid name");
            return false;
        }else{
            return true;
        }
    }
}

function getTotalAfterDiscount(){
    let total = 0;
    $("#tableCartBody tr").each(function() {
        let row_unit_price = parseFloat($(this).find("td:eq(3)").text());
        let row_qty = parseInt($(this).find("td:eq(4)").text());
        let row_total = row_unit_price * row_qty;
        total = total + row_total;
    });
    let added_points = $("#added_points").val();
    console.log(added_points);
    if(added_points == "" ){
        return total;
    }else{
        added_points = parseInt(added_points);
        let discount = (total/100) * added_points;
        let new_total = total - discount;
        new_total = new_total.toFixed(2);
        return new_total;
    }
}

function removeIconOnClicked(){
    $(".cart-remove-btn:last").click(function (){
        let result = confirm("are you sure to remove this item form the cart?")
        if(result){
            $(this).parent().parent().remove();

            let finalTotal = 0;
            $("#tableCartBody tr").each(function() {
                let row_unit_price = parseFloat($(this).find("td:eq(3)").text());
                let row_qty = parseInt($(this).find("td:eq(4)").text());
                let row_total = row_unit_price * row_qty;
                finalTotal = finalTotal + row_total;
            });
            $("#total_price").text(finalTotal);

            // let discount = $("#o_inputDiscount").val();
            // if(discount===""){
            //     subTotal = finalTotal;
            // }else{
            //     let reduced_amount = (finalTotal/100)*parseFloat(discount);
            //     subTotal = finalTotal-reduced_amount;
            // }
            // $("#o_lblSubTotal").html("&nbsp;" + subTotal + "/=");
        }
    });
}

function generateNextOrderId(){
    $.ajax({
        url: "http://localhost:8080/hello_shoes/api/v1/place_order/getlastid",
        headers: { "Authorization": "Bearer " + localStorage.getItem("hs_token") },
        method: "GET",
        contentType: "application/json",
        headers: { "Authorization": "Bearer " + localStorage.getItem("hs_token") },
        success: function (last_id) {
            if(last_id == ""){
                $("#order_id").text("ORD-001");
            }else{
                let numericPart = parseInt(last_id.split('-')[1]);
                let nextNumericPart = numericPart + 1;
                let nextId = `ORD-${String(nextNumericPart).padStart(3, '0')}`;
                $("#order_id").text(nextId);
            }
        },
        error: function (jqxhr, textStatus, error) {
            console.log(jqxhr);
        }
    })
}

function loadItemCodes(){
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: 'http://localhost:8080/hello_shoes/api/v1/place_order/getItemCodes',
            headers: { "Authorization": "Bearer " + localStorage.getItem("hs_token") },
            method: 'GET',
            contentType: 'application/json',
            success: function (response) {
                console.log(response);
                $.each(response.data, function (index, itemCode) {
                    $('#item_code').append(`<option>${itemCode}</option>`);
                });
                resolve(); // Resolve the promise when done
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseJSON.message);
                console.error(jqXHR);
                reject(); // Reject the promise on error
            }
        });
    });
}

function loadCustomerCodes(){
    $.ajax({
        url: 'http://localhost:8080/hello_shoes/api/v1/place_order/getCustomerCodes',
        headers: { "Authorization": "Bearer " + localStorage.getItem("hs_token") },
        method: 'GET',
        contentType: 'application/json',
        success: function (response) {
            console.log(response);

            $('#cust_code').append(`<option value="">None</option>`);
            $.each(response.data, function (index, custCode) {
                $('#cust_code').append(`<option>${custCode}</option>`);
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR.responseJSON.message);
            console.error(jqXHR);
        }
    });
}

function getSizesByItemCode(itemCode) {
    $.ajax({
        url: 'http://localhost:8080/hello_shoes/api/v1/place_order/getSizesByItemCode/' + itemCode,
        headers: { "Authorization": "Bearer " + localStorage.getItem("hs_token") },
        method: 'GET',
        contentType: 'application/json',
        success: function (response) {
            console.log(response);

            $('#item_size').empty();
            $("#item_size").append(`<option disabled selected>Select Shoe Size</option>`);
            $.each(response.data, function (index, size) {
                $('#item_size').append(`<option>${size}</option>`);
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR.responseJSON.message);
            console.error(jqXHR);
        }
    });
}
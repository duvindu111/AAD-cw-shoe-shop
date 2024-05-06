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
});

$("#btn_confirm").click(function(){
   if($("#tableCartBody tr").length > 0){
       if($("#payment_method").val() != null){
           if($("#name_of_user").text() != ""){
               if($("#code_of_employee").text() != ""){
                   ////////////////////////////////////////////////
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
   let order_id = $("#order_id").text();
   let order_date = new Date();
   let cust_code = $("#cust_code").val();
   let cust_name = $("#cust_name").val();
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
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({"orderId": order_id, "orderDate": order_date, "customer": cust_code, "customerName": cust_name, "totalPrice": total,
            "addedPoints": added_points, "paymentMethod": payment_method, "employee": employee_code, "cashierName": cashier_name, "orderDetailList": orderDetails
        }),
        success: function (response) {
            console.log(response);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR.responseJSON.message);
            console.error(jqXHR);
        }
    });
});

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
        method: "GET",
        contentType: "application/json",
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
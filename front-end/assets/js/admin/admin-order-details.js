$(document).ready(function () {
    getAllOrders();
});

function getAllOrders(){
    $.ajax({
        url: "http://localhost:8080/hello_shoes/api/v1/orderdetails/getall",
        headers: { "Authorization": "Bearer " + localStorage.getItem("hs_token") },
        method: "GET",
        contentType: "application/json",
        success: function (response) {
            console.log(response);

            $("#tableOrderBody").empty();
            $.each(response.data, function (index, order) {
                let row = `<tr>
                    <td>${order.orderId}</td>
                    <td>${order.orderDate}</td>
                    <td>${order.totalPrice}</td>
                    <td>${order.paymentMethod}</td>
                    <td>${order.addedPoints}</td>
                    <td>${order.customerName}</td>
                    <td>${order.cashierName}</td>  
                    <td class="d-none">${order.customer}</td> 
                    <td class="d-none">${order.employee}</td> 
                    <td class="order-details-button-td">
                        <div class="row mx-0" style="flex-wrap: nowrap">
                        <i class="fa-solid fa-binoculars" title="view" onclick="viewOrderDetails($(this))"></i>
                        <i class="fa-solid fa-arrow-rotate-left ml-3" title="refund" onclick="refundCompleteOrder($(this))"></i>
                        </div>                      
                    </td>
                    </tr>`;
                $('#tableOrderBody').append(row);
            });

            // onTableRowClicked();
        },
        error: function (jqxhr, textStatus, error) {
            alert("retrieving orders failed.")
            console.log(jqxhr);
        }
    })
}

$("#btnGetAll").click(function (){
    getAllOrders();
    $("#searchField").val("");
})

$("#searchField").keyup(function (){
    let prefix = $("#searchField").val();

    if(prefix == ""){
        getAllOrders();
        return;
    }

    $.ajax({
        url: "http://localhost:8080/hello_shoes/api/v1/orderdetails/searchByCode/" + prefix,
        headers: { "Authorization": "Bearer " + localStorage.getItem("hs_token") },
        method: "GET",
        contentType: "application/json",
        success: function (response) {
            console.log(response);

            if(response.data.length == 0){
                $("#tableOrderBody").empty();
                let row = `<tr>
                    <td class="py-5" colspan="8">No Result Found</td>                                       
                    </tr>`;
                $('#tableOrderBody').append(row);
                return;
            }

            $("#tableOrderBody").empty();
            $.each(response.data, function (index, order) {

                let row = `<tr>
                    <td>${order.orderId}</td>
                    <td>${order.orderDate}</td>
                    <td>${order.totalPrice}</td>
                    <td>${order.paymentMethod}</td>
                    <td>${order.addedPoints}</td>
                    <td>${order.customerName}</td>
                    <td>${order.cashierName}</td>  
                    <td class="d-none">${order.customer}</td>   
                    <td class="d-none">${order.employee}</td> 
                    <td class="order-details-button-td d-flex align-items-center">
                        <div class="d-flex">
                        <i class="fa-solid fa-binoculars" title="view" onclick="viewOrderDetails($(this))"></i>
                        <i class="fa-solid fa-arrow-rotate-left ml-3" title="refund" onclick="refundCompleteOrder($(this))"></i>
                        </div>                      
                    </td>
                    </tr>`;
                $('#tableOrderBody').append(row);
            });

            onTableRowClicked();
        },
        error: function (jqxhr, textStatus, error) {
            alert("searching orders failed.")
            console.log(jqxhr);
        }
    })
})

$(document).ajaxError(function(event, jqxhr, settings, thrownError) {
    console.log(event);
    if (jqxhr.status === 401) {
        window.location.href = '../../login.html';
    }
});

function viewOrderDetails(elm){
    $(".chosen").removeClass("chosen");
    elm.addClass("chosen");

    let orderId = elm.closest('tr').find('td:first').text();
    console.log(orderId);
    $("#popupOrderId").text(orderId);

    $.ajax({
        url: "http://localhost:8080/hello_shoes/api/v1/orderdetails/getOrderDetailsById/" + orderId,
        headers: { "Authorization": "Bearer " + localStorage.getItem("hs_token") },
        method: "GET",
        contentType: "application/json",
        success: function (response) {
            console.log(response);

            $("#tableOrderDetailBody").empty();
            $.each(response.data, function (index, order) {
                let row = `<tr>
                    <td>${order.itemCode}</td>
                    <td>${order.itemName}</td>
                    <td>${order.size}</td>
                    <td>${order.qty}</td>
                    <td>${order.unitPrice}</td>
                    <td class="order-details-button-td text-center">                  
                        <i class="fa-solid fa-arrow-rotate-left" title="refund only this item" onclick="refundOneItem($(this),$('.chosen'))"></i>
                    </td>
                    </tr>`
                $("#tableOrderDetailBody").append(row);
            });

            $("#detailModal").modal('show');
        },
        error: function (jqxhr, textStatus, error) {
            alert("retrieving order details failed.")
            console.log(jqxhr);
        }
    })
}

function refundOneItem(current_elm, elm){
    console.log(elm);
    if($("#tableOrderDetailBody tr").length == 1){
        refundCompleteOrder(elm);
    }else{
        let orderId = elm.closest('tr').find('td:first').text();
        let addedPoints = elm.closest('tr').find('td:eq(4)').text();
        let totalPrice = elm.closest('tr').find('td:eq(2)').text();
        let customer_code = elm.closest('tr').find('td:eq(7)').text();
        let cashier_name = elm.closest('tr').find('td:eq(6)').text();
        let paymentMethod = elm.closest('tr').find('td:eq(3)').text();
        let employee_code = elm.closest('tr').find('td:eq(8)').text();

        let orderTimestamp = elm.closest('tr').find('td:eq(1)').text();
        let datePart = new Date(orderTimestamp.split('T')[0]);
        let currentDate = new Date();
        const diffTime = currentDate - datePart;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        console.log("diffdays: ");
        console.log(diffDays);

        if (diffDays >= 3) {
            alert("The date is more than 3 days from the current date. You can't refund the order.")
        } else {
            let itemList = [];
            let item = {
                itemCode: current_elm.closest('tr').find('td:first').text(),
                size: current_elm.closest('tr').find('td:eq(2)').text(),
                qty: current_elm.closest('tr').find('td:eq(3)').text(),
                unitPrice: current_elm.closest('tr').find('td:eq(4)').text()
            }
            itemList.push(item);

            $.ajax({
                url: "http://localhost:8080/hello_shoes/api/v1/orderdetails/refundOne",
                headers: { "Authorization": "Bearer " + localStorage.getItem("hs_token") },
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({"orderId": orderId, "totalPrice": totalPrice, "addedPoints": addedPoints,
                    "employee": employee_code, "customer": customer_code, "orderDetailList": itemList, "cashierName": cashier_name,
                    "paymentMethod": paymentMethod
                }),
                success: function (response) {
                    console.log(response);
                    alert("Item refunded successfully");

                    $("#detailModal").modal('hide');
                    getAllOrders();
                },
                error: function (jqxhr, textStatus, error) {
                    alert("refunding item failed.")
                    console.log(jqxhr);
                }
            })
        }
    }
}

function refundCompleteOrder(elm){
    let orderTimestamp = elm.closest('tr').find('td:eq(1)').text();
    let datePart = new Date(orderTimestamp.split('T')[0]);
    let currentDate = new Date();
    const diffTime = currentDate - datePart;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    console.log("diffdays: ");
    console.log(diffDays);

    if (diffDays >= 3) {
        alert("The date is more than 3 days from the current date. You can't refund the order.")
    } else {
        let result = window.confirm("Do you want to refund the complete order?");
        if (result) {
            let orderId = elm.closest('tr').find('td:first').text();
            console.log(orderId);

            let itemList = [];
            $.ajax({
                url: "http://localhost:8080/hello_shoes/api/v1/orderdetails/getOrderDetailsById/" + orderId,
                headers: { "Authorization": "Bearer " + localStorage.getItem("hs_token") },
                method: "GET",
                contentType: "application/json",
                success: function (response) {
                    console.log(response);
                    $.each(response.data, function (index, order) {
                        let item = {
                            itemCode: order.itemCode,
                            size: order.size,
                            qty: order.qty
                        }
                        itemList.push(item);
                    });

                    let addedPoints = elm.closest('tr').find('td:eq(4)').text();
                    let totalPrice = elm.closest('tr').find('td:eq(2)').text();
                    let customer_code = elm.closest('tr').find('td:eq(7)').text();
                    let cashier_name = elm.closest('tr').find('td:eq(6)').text();
                    let paymentMethod = elm.closest('tr').find('td:eq(3)').text();
                    let employee_code = elm.closest('tr').find('td:eq(8)').text();

                    $.ajax({
                        url: "http://localhost:8080/hello_shoes/api/v1/orderdetails/refund",
                        headers: { "Authorization": "Bearer " + localStorage.getItem("hs_token") },
                        method: "POST",
                        contentType: "application/json",
                        data: JSON.stringify({"orderId": orderId, "totalPrice": totalPrice, "addedPoints": addedPoints,
                            "employee": employee_code, "customer": customer_code, "orderDetailList": itemList, "cashierName": cashier_name,
                            "paymentMethod": paymentMethod
                        }),
                        success: function (response) {
                            console.log(response);
                            alert("Order refunded successfully");

                            $("#detailModal").modal('hide');
                            getAllOrders();
                        },
                        error: function (jqxhr, textStatus, error) {
                            alert("refunding order failed.")
                            console.log(jqxhr);
                        }
                    })
                },
                error: function (jqxhr, textStatus, error) {
                    alert("retrieving order details failed. inside refund order.")
                    console.log(jqxhr);
                }
            })
        }
    }
}

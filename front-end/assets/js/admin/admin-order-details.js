$(document).ready(function () {
    getAllOrders();
});

function getAllOrders(){
    $.ajax({
        url: "http://localhost:8080/hello_shoes/api/v1/orderdetails/getall",
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
                    <td class="order-details-button-td d-flex align-items-center">
                        <div class="d-flex">
                        <i class="fa-solid fa-binoculars" title="view" onclick="viewOrderDetails($(this))"></i>
                        <i class="fa-solid fa-arrow-rotate-left ml-3" title="refund"></i>
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

function viewOrderDetails(elm){
    let orderId = elm.closest('tr').find('td:first').text();
    console.log(orderId);

    $.ajax({
        url: "http://localhost:8080/hello_shoes/api/v1/orderdetails/getOrderDetailsById/" + orderId,
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
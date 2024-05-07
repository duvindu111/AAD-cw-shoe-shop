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

            // $("#tableOrderDetailBody").empty();
            // $.each(response.data, function (index, order) {
            //     let row = `<tr>
            //         <td>${customer.code}</td>
            //         <td>${customer.name}</td>
            //         <td>${customer.gender}</td>
            //         <td>${customer.loyaltyJoinedDate}</td>
            //         <td>${customer.loyaltyLevel}</td>
            //         <td>${customer.loyaltyPoints}</td>
            //         <td>${customer.dob}</td>
            //         <td class="td-address">
            //         </td>
            //         <td>${customer.contact}</td>
            //         <td>${customer.email}</td>
            //         <td>${customer.recentPurchaseDate}</td>
            //         </tr>`;
            //     $('#tableOrderDetailBody').append(row);
            // });

            onTableRowClicked();
        },
        error: function (jqxhr, textStatus, error) {
            alert("retrieving orders failed.")
            console.log(jqxhr);
        }
    })
}
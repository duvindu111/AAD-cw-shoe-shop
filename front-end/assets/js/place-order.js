$(document).ready(function () {
    loadItemCodes().then(function() {
        loadCustomerCodes();
    });
});

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

    $.ajax({
        url: 'http://localhost:8080/hello_shoes/api/v1/place_order/getQtyByItemCodeAndSize/' + itemCode + '/' + size,
        method: 'GET',
        contentType: 'application/json',
        success: function (response) {
            console.log(response);

            $("#available_qty").text(response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR.responseJSON.message);
            console.error(jqXHR);
        }
    });
});

$("#cust_code").change(function () {
    let custCode = $(this).val();

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

            $("#added_points").attr("max", response.data.loyaltyPoints);

            $(".cust-related-flex").css("display", "flex");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR.responseJSON.message);
            console.error(jqXHR);
        }
    });
});

function getSizesByItemCode(itemCode) {
    $.ajax({
        url: 'http://localhost:8080/hello_shoes/api/v1/place_order/getSizesByItemCode/' + itemCode,
        method: 'GET',
        contentType: 'application/json',
        success: function (response) {
            console.log(response);

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
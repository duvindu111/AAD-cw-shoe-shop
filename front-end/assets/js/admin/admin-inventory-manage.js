$(document).ready(function () {
    loadSupplierCodes();
});

$("#item_category").on("change", function() {
    let value = $(this).val();
    generateNextItemId(value);
});

$("#item_supp_code").on("change", function() {
    let supp_code = $(this).val();
    getSuppName(supp_code);
});

$("#btnAdd").click(function (){

        let code = $("#item_code").val();
        let name = $("#item_name").val();
        let item_pic = $("#item_pic_hidden")[0].files[0];
        let category = $("#item_category").val();
        let size = $("#item_size").val();
        let qty = $("#item_quantity").val();
        let supp_code = $("#item_supp_code").val();
        let supp_name = $("#item_supp_name").val();
        let sale_price = $("#item_price_sale").val();
        let buy_price = $("#item_price_buy").val();

        // calculations
        let expected_profit = sale_price - buy_price;
        let profit_margin = (expected_profit / sale_price) * 100;

        let status;
        if(qty <= 0) {
            status = "Not Available";
        }else if(qty<10){
            status = "Low";
        }else{
            status = "Available";
        }
        // end of calculations

    console.log(item_pic);
        let base64_item_pic;
        fileToBase64(item_pic, function(base64String) {
            base64_item_pic = base64String;

            $.ajax({
                url: 'http://localhost:8080/hello_shoes/api/v1/inventory/save',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({"item_code": code, "item_name": name, "item_picture": base64_item_pic,
                    "category": category, "size": size, "supplier_code": supp_code,
                    "supplier_name": supp_name, "price_sale": sale_price, "price_buy": buy_price, "expected_profit": expected_profit,
                    "profit_margin": profit_margin, "status": status, "qty": qty}),
                success: function (response) {
                    alert("Item details saved successfully");
                    clearFields();

                    $("#btnUpdate").prop("disabled", true);
                    $("#btnDelete").prop("disabled", true);
                    $("#btnAdd").prop("disabled", false);

                    getAllItems();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error(jqXHR);
                    alert(jqXHR.responseJSON.message);
                }
            });
        });
})

function getSuppName(supp_code) {
    $.ajax({
        url: "http://localhost:8080/hello_shoes/api/v1/inventory/getSupplierName/" + supp_code,
        method: "GET",
        success: function (response) {
            console.log(response);
            $("#item_supp_name").val(response);
        },
        error: function (jqxhr, textStatus, error) {
            console.log(jqxhr);
        }
    })
}

function generateNextItemId(value) {
    $.ajax({
        url: "http://localhost:8080/hello_shoes/api/v1/inventory/getlastid/" + value,
        method: "GET",
        success: function (response) {
            console.log(response);
            if(response == ""){
                $("#item_code").val(`${value}-001`);
            }else{
                let numericPart = parseInt(response.split('-')[1]);
                let nextNumericPart = numericPart + 1;
                let nextId = `${value}-${String(nextNumericPart).padStart(3, '0')}`;
                $("#item_code").val(nextId);
            }
        },
        error: function (jqxhr, textStatus, error) {
            console.log(jqxhr);
        }
    })
}

function loadSupplierCodes() {
    $.ajax({
        url: "http://localhost:8080/hello_shoes/api/v1/inventory/getSupplierCodes",
        method: "GET",
        success: function (response) {
            response.forEach(supplier_code => {
                $("#item_supp_code").append(`<option value="${supplier_code}">${supplier_code}</option>`);
            });
        },
        error: function (jqxhr, textStatus, error) {
            console.log(jqxhr);
        }
    })
}
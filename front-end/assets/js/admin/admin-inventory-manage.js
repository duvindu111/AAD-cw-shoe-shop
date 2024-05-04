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
        let supp_code = $("#item_supp_code").val();
        let supp_name = $("#item_supp_name").val();
        let sale_price = $("#item_price_sale").val();
        let buy_price = $("#item_price_buy").val();

        // calculations
        let expected_profit = sale_price - buy_price;
        let profit_margin = (expected_profit / sale_price) * 100;
        // end of calculations

        let shoe_size_list = [];
        $(".size-qty-container").each(function (){
            let size = $(this).find("#item_size").val();
            let qty = $(this).find("#item_quantity").val();

            let status;
            if(qty <= 0) {
                status = "Not Available";
            }else if(qty<10){
                status = "Low";
            }else{
                status = "Available";
            }

            shoe_size_list.push({"item_code": code, "size": size, "quantity": qty, "status": status,});
        });

        let base64_item_pic;
        fileToBase64(item_pic, function(base64String) {
            base64_item_pic = base64String;

            $.ajax({
                url: 'http://localhost:8080/hello_shoes/api/v1/inventory/save',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({"item_code": code, "item_name": name, "item_picture": base64_item_pic,
                    "category": category, "supplier_code": supp_code, "supplier_name": supp_name, "price_sale": sale_price,
                    "price_buy": buy_price, "expected_profit": expected_profit,
                    "profit_margin": profit_margin, shoe_size_list: shoe_size_list}),
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

$("#btnAddSizeQty").click(function (){
    let element = ` <div class="size-qty-container w-100 d-flex flex-wrap py-1 mb-2">
                            <div class="col-12 col-sm-6 col-xl-4 mb-2">
                                <label for="item_size" class="form-label input-label">Size</label>
                                <select id="item_size" class="form-select form-control select-field">
                                    <option disabled selected>Select Size</option>
                                    <option class="shoe" value="3">3</option>
                                    <option class="shoe" value="4">4</option>
                                    <option class="shoe" value="5">5</option>
                                    <option class="shoe" value="6">6</option>
                                    <option class="shoe" value="7">7</option>
                                    <option class="shoe" value="8">8</option>
                                    <option class="shoe" value="9">9</option>
                                    <option class="shoe" value="10">10</option>
                                    <option class="shoe" value="11">11</option>
                                    <option class="shoe" value="12">12</option>
                                </select>
                            </div>
                            <div class="col-12 col-sm-6 col-xl-4 mb-2">
                                <label for="item_quantity" class="form-label input-label">Quantity</label>
                                <input type="number" class="form-control input-field" id="item_quantity">
                            </div>
                            <button type="button" class="btn-remove btn">
                                <i class="fa-regular fa-circle-xmark"></i></button>
                    </div>`

    $("#sizeQtyRow").append(element);
})

$(".btn-remove").click(function (){
    let removeBtn = $(this);

    let container = removeBtn.parent();
    container.remove();
});

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
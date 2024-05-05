$(document).ready(function () {
    loadSupplierCodes();
    getAllItems();
    btnCancelClick();
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
    let validated = validateFields();
    if(validated){
        let code = $("#item_code").val();
        let name = $("#item_name").val();
        let item_pic = $("#item_pic_hidden")[0].files[0];
        let category = $("#item_category option:selected").text();
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

            shoe_size_list.push({"itemCode": code, "size": size, "quantity": qty, "status": status,});
        });

        let base64_item_pic;
        fileToBase64(item_pic, function(base64String) {
            base64_item_pic = base64String;

            $.ajax({
                url: 'http://localhost:8080/hello_shoes/api/v1/inventory/save',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({"itemCode": code, "itemName": name, "itemPicture": base64_item_pic,
                    "category": category, "supplierCode": supp_code, "supplierName": supp_name, "priceSale": sale_price,
                    "priceBuy": buy_price, "expectedProfit": expected_profit,
                    "profitMargin": profit_margin, shoe_size_list: shoe_size_list}),
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
    }
})

$("#btnUpdate").click(function (){
    let validated = validateFields();
    if(validated){
        let code = $("#item_code").val();
        let name = $("#item_name").val();
        let item_pic = $("#item_pic_hidden")[0].files[0];
        let category = $("#item_category option:selected").text();
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

            console.log(base64_item_pic);
            $.ajax({
                url: 'http://localhost:8080/hello_shoes/api/v1/inventory/update',
                method: 'PATCH',
                contentType: 'application/json',
                data: JSON.stringify({"itemCode": code, "itemName": name, "itemPicture": base64_item_pic,
                    "category": category, "supplierCode": supp_code, "supplierName": supp_name, "priceSale": sale_price,
                    "priceBuy": buy_price, "expectedProfit": expected_profit,
                    "profitMargin": profit_margin, shoe_size_list: shoe_size_list}),
                success: function (response) {
                    alert("Item details updated successfully");
                    clearFields();

                    $("#btnUpdate").prop("disabled", true);
                    $("#btnDelete").prop("disabled", true);
                    $("#btnAdd").prop("disabled", false);
                    $("#item_category").prop("disabled", false);

                    getAllItems();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error(jqXHR);
                    alert(jqXHR.responseJSON.message);
                }
            });
        });
    }
})

$("#btnDelete").click(function (){
    let item_code = $("#item_code").val();

    let result = window.confirm("Do you want to proceed?");
    if (result) {
        $.ajax({
            url: 'http://localhost:8080/hello_shoes/api/v1/inventory/delete/' + item_code,
            method: 'DELETE',
            contentType: 'application/json',
            success: function (response) {
                alert("Item deleted successfully");
                clearFields();

                $("#btnUpdate").prop("disabled", true);
                $("#btnDelete").prop("disabled", true);
                $("#btnAdd").prop("disabled", false);
                $("#item_category").prop("disabled", false);

                getAllItems();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseJSON.message);
                console.error(jqXHR);
            }
        });
    }
})

$("#searchField").keyup(function (){
    let prefix = $("#searchField").val();

    if(prefix == ""){
        getAllItems();
        return;
    }

    $.ajax({
        url: "http://localhost:8080/hello_shoes/api/v1/inventory/search/" + prefix,
        method: "GET",
        contentType: "application/json",
        success: function (response) {
            console.log(response);

            if(response.data.length == 0){
                $("#tableInventoryBody").empty();
                let row = `<tr>
                    <td class="py-5" colspan="11">No Result Found</td>                                       
                    </tr>`;
                $('#tableInventoryBody').append(row);
                return;
            }

            $("#tableInventoryBody").empty();
            $.each(response.data, function (index, inventory) {
                let roundedNum = inventory.profitMargin.toFixed(2);

                let row = `<tr>
                    <td>${inventory.itemCode}</td>
                    <td>${inventory.itemName}</td>
                     <td>
                        <input class="d-none" disabled value="${inventory.itemPicture}">
                        <div class="profile-pic" style="width: 60px; height: 60px; border-radius: 50%; 
                        background-size: cover;
                        background-image: url(data:image;base64,${inventory.itemPicture});"></div>
                    </td>
                    <td>${inventory.category}</td>
                    <td>${inventory.supplierCode}</td>
                    <td>${inventory.supplierName}</td>
                    <td>${inventory.priceSale}</td>
                    <td>${inventory.priceBuy}</td>
                    <td>${inventory.expectedProfit}</td>                   
                    <td>${roundedNum}</td>
                    <td class="col-size">
                        <table>
                        <tbody class="small-tbl-body"></tbody>
                        </table> 
                    </td>
                    </tr>`;
                $('#tableInventoryBody').append(row);

                $.each(inventory.shoe_size_list, function (index, shoe_size) {
                    let tableBody = `<tr>
                        <td>${shoe_size.size}</td>
                        <td>${shoe_size.quantity}</td>
                        <td>${shoe_size.status}</td>
                    </tr>`
                    $(".small-tbl-body:last").append(tableBody);
                });
            });

            onTableRowClicked();
        },
        error: function (jqxhr, textStatus, error) {
            alert("searching customers failed.")
            console.log(jqxhr);
        }
    })
})

$("#btnAddSizeQty").click(function (){
    let lastContainer = $(".size-qty-container:last");
    var item_size = lastContainer.find("#item_size").val();
    var item_quantity = lastContainer.find("#item_quantity").val();
    if (item_size == null && lastContainer.length != 0){
        alert("Item Size is not selected");
    }else if ((item_quantity == "" || item_quantity < 0) && lastContainer.length !=0){
        alert("Item Quantity is empty or negative");
    }else{
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
                                <input type="number" class="form-control input-field" id="item_quantity" min="0" oninput="validity.valid||(value='');">
                            </div>
                            <button type="button" class="btn-remove btn">
                                <i class="fa-regular fa-circle-xmark"></i></button>
                    </div>`

        $("#sizeQtyRow").append(element);
        btnCancelClick();
    }
})

$("#btnGetAll").click(function (){
    getAllItems();
    $("#searchField").val("");
});

function btnCancelClick(){
    $(".btn-remove").click(function (){
        let removeBtn = $(this);

        let container = removeBtn.parent();
        container.remove();
    });
}

$("#btnReset").click(function (){
    clearFields();

    $("#btnAdd").prop("disabled", false);
    $("#btnUpdate").prop("disabled", true);
    $("#btnDelete").prop("disabled", true);
})

function getAllItems(){
    $.ajax({
        url: "http://localhost:8080/hello_shoes/api/v1/inventory/getall",
        method: "GET",
        contentType: "application/json",
        success: function (response) {
            console.log(response);

            $("#tableInventoryBody").empty();
            $.each(response.data, function (index, inventory) {
                let roundedNum = inventory.profitMargin.toFixed(2);

                let row = `<tr>
                    <td>${inventory.itemCode}</td>
                    <td>${inventory.itemName}</td>
                     <td>
                        <input class="d-none" disabled value="${inventory.itemPicture}">
                        <div class="profile-pic" style="width: 60px; height: 60px; border-radius: 50%; 
                        background-size: cover;
                        background-image: url(data:image;base64,${inventory.itemPicture});"></div>
                    </td>
                    <td>${inventory.category}</td>
                    <td>${inventory.supplierCode}</td>
                    <td>${inventory.supplierName}</td>
                    <td>${inventory.priceSale}</td>
                    <td>${inventory.priceBuy}</td>
                    <td>${inventory.expectedProfit}</td>                   
                    <td>${roundedNum}</td>
                    <td class="col-size">
                        <table>
                        <tbody class="small-tbl-body"></tbody>
                        </table> 
                    </td>
                    </tr>`;
                $('#tableInventoryBody').append(row);

                $.each(inventory.shoe_size_list, function (index, shoe_size) {
                    let tableBody = `<tr>
                        <td>${shoe_size.size}</td>
                        <td>${shoe_size.quantity}</td>
                        <td>${shoe_size.status}</td>
                    </tr>`
                    $(".small-tbl-body:last").append(tableBody);
                });
            });

            onTableRowClicked();
        },
        error: function (jqxhr, textStatus, error) {
            alert("retrieving items failed.")
            console.log(jqxhr);
        }
    })
}

function onTableRowClicked() {
    $("#tableInventoryBody>tr").click(function (){
        let row = $(this);

        let item_code = row.children().eq(0).text();
        let item_name = row.children().eq(1).text();
        let item_pic = row.children().eq(2).children("input").val();
        let category = row.children().eq(3).text();
        let supplier_code = row.children().eq(4).text();
        let supplier_name = row.children().eq(5).text();
        let sale_price = row.children().eq(6).text();
        let buy_price = row.children().eq(7).text();

        // getting value part from the category name
        let categoryValue = category.split("-")[0].trim();

        // setting the value to the file picker
        let byteCharacters = atob(item_pic);
        let byteNumbers = new Array(byteCharacters.length);
        for (var i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);
        let blob = new Blob([byteArray], { type: 'image/png' });
        // Create a file from the blob
        let file = new File([blob], 'image.png', { type: 'image/png' });

        let dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        let fileInput = document.getElementById('item_pic_hidden');
        fileInput.files = dataTransfer.files;
        $("#item_pic_visible").val("Previously Selected.");
        //end of setting the value to the file picker

        $("#item_code").val(item_code);
        $("#item_name").val(item_name);
        $("#item_category").val(categoryValue);
        $("#item_supp_code").val(supplier_code);
        $("#item_supp_name").val(supplier_name);
        $("#item_price_sale").val(sale_price);
        $("#item_price_buy").val(buy_price);

        $("#sizeQtyRow").empty();
        $.each(row.find(".small-tbl-body tr"), function (index, tr) {
            let size = $(tr).find("td:eq(0)").text();
            let qty = $(tr).find("td:eq(1)").text();

            let element = ` <div class="size-qty-container w-100 d-flex flex-wrap py-1 mb-2">
                            <div class="col-12 col-sm-6 col-xl-4 mb-2">
                                <label for="item_size" class="form-label input-label">Size</label>
                                <select disabled id="item_size" class="form-select form-control select-field">
                                    <option selected>${size}</option>
                                </select>
                            </div>
                            <div class="col-12 col-sm-6 col-xl-4 mb-2">
                                <label for="item_quantity" class="form-label input-label">Quantity</label>
                                <input value="${qty}" type="number" class="form-control input-field" id="item_quantity" min="0" oninput="validity.valid||(value='');">
                            </div>
                    </div>`
            $("#sizeQtyRow").append(element);
        });

        $("#btnUpdate").prop("disabled", false);
        $("#btnDelete").prop("disabled", false);
        $("#btnAdd").prop("disabled", true);
        $("#item_category").prop("disabled", true);
    });
}

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

function clearFields() {
    $("#item_code").val("");
    $("#item_name").val("");
    $("#item_pic_hidden").val("");
    $("#item_pic_visible").val("");
    $("#item_category").val("");
    $("#item_supp_code").val("");
    $("#item_supp_name").val("");
    $("#item_price_sale").val("");
    $("#item_price_buy").val("");

    $(".size-qty-container").remove();

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
}

function validateFields(){
    let requiredFieldsAreFilled = checkRequiredFields();

    if(!requiredFieldsAreFilled){
        return false;
    }

    let item_name = $("#item_name").val()
    let supp_code = $("#item_supp_code").val();
    let price_sale = $("#item_price_sale").val();
    let price_buy = $("#item_price_buy").val();

    let validated = true;
    if (!validate(item_name, /[A-Za-z0-9\s]+/)) {
        $("#el_item_name").css("display", "block");
        clearErrorLabel("#item_name");
        validated = false;
    }
    if (!validate(supp_code, /^SUPP-\d+$/)) {
        $("#el_supp_code").css("display", "block");
        clearErrorLabel("#item_supp_code");
        validated = false;
    }
    if (!validate(price_sale, /^\d*\.?\d+$/)) {
        $("#el_price_sale").css("display", "block");
        clearErrorLabel("#item_price_sale");
        validated = false;
    }
    if (!validate(price_buy, /^\d*\.?\d+$/)) {
        $("#el_price_buy").css("display", "block");
        clearErrorLabel("#item_price_buy");
        validated = false;
    }

    return validated;
}

function checkRequiredFields() {
    let sizeQtyValidation = true;
    if($(".size-qty-container").length > 0){
        $(".size-qty-container").each(function(index) {
            var $container = $(this);
            var item_size = $container.find("#item_size").val();
            var item_quantity = $container.find("#item_quantity").val();
            console.log(item_quantity);
            if (item_size == null){
                alert("Item Size is not selected");
                sizeQtyValidation = false;
            }
            if (item_quantity == "" || item_quantity < 0){
                alert("Item Quantity is empty or negative");
                sizeQtyValidation = false;
            }
        });
    }

    if(
        $("#item_code").val() == "" || $("#item_name").val() == "" || $("#item_pic_hidden").val() == "" ||
        $("#item_category").val() == null || $("#item_supp_code").val() == null || $("#item_supp_name").val() == "" ||
        $("#item_price_sale").val() == "" || $("#item_price_buy").val() == "" || $(".size-qty-container").length == 0 ||
        !sizeQtyValidation
    ){
        if ($("#item_code").val() == "") alert("Item Code is empty");
        else if ($("#item_name").val() == "") alert("Item Name is empty");
        else if ($("#item_pic_hidden").val() == "") alert("Item Pic is not selected");
        else if ($("#item_category").val() == null) alert("Item Category is not selected");
        else if ($("#item_supp_code").val() == null) alert("Supp Code is not selected");
        else if ($("#item_supp_name").val() == "") alert("Supp Name is empty");
        else if ($("#item_price_sale").val() == "") alert("Unit Price- Sale is empty");
        else if ($("#item_price_buy").val() == "") alert("Unit Price- Buy is empty");
        else if ($(".size-qty-container").length == 0) alert("Please select a size first");

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

function clearErrorLabel(elementId) {
    $(elementId).on("keyup", function(){
        $(elementId + "+ label").css("display", "none");
    })
}
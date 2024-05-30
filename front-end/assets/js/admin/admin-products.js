$(document).ready(function () {
    getAllItems();
});

function getAllItems(){
    $.ajax({
        url: "http://localhost:8080/hello_shoes/api/v1/inventory/getall",
        headers: { "Authorization": "Bearer " + localStorage.getItem("hs_token") },
        method: "GET",
        contentType: "application/json",
        success: function (response) {
            console.log(response);

            $("#product-grid").empty();
            $.each(response.data, function (index, inventory) {
                let card = `
                     <div class="card" style="">
                        <img src="data:image/png;base64,${inventory.itemPicture}" class="card-img-top" style="min-height: 200px">
                        <div class="card-body pt-2 px-3">
                            <h4 class="mt-2" style="font-weight: 600">${inventory.itemCode}</h4>
                            <h5 class="card-title mb-0">${inventory.itemName}</h5>
                            <h6 class="small mt-1">${inventory.category}</h6>
                            <h5 class="mb-2 mt-2" style="font-family: 'Roboto';">${inventory.priceSale}/=</h5>
                        </div>
                    </div>`
                $("#product-grid").append(card);

                $.each(inventory.shoe_size_list, function (index, shoe_size) {
                    let size = shoe_size.size;
                    if(size == "1001"){
                        size = "Small";
                    }else if (size == "1002"){
                        size = "Medium";
                    }else if(size == "1003"){
                        size = "Large";
                    }

                    let ptag = `<p class="card-text" style="font-size: 12px; margin: 0">Size ${size}: &nbsp;${shoe_size.quantity} - ${shoe_size.status}</p>`
                    $("#product-grid .card-body:last").append(ptag);
                });
            });
        },
        error: function (jqxhr, textStatus, error) {
            alert("retrieving items failed.")
            console.log(jqxhr);
        }
    })
}

$("#price-search").click(function () {
   let min_price = $("#min-price").val();
   let max_price = $("#max-price").val();

   clearFilterFields();
    $("#min-price").val(min_price);
    $("#max-price").val(max_price);

   if(min_price == "" || max_price == ""){
         alert("Please enter both minimum and maximum price.");
         return;
   }

    if(min_price > max_price ){
        alert("Minimum price should be less than maximum price.");
        return;
    }

    $.ajax({
        url: "http://localhost:8080/hello_shoes/api/v1/inventory/getAllByPrice/" + min_price + "/" + max_price,
        headers: { "Authorization": "Bearer " + localStorage.getItem("hs_token") },
        method: "GET",
        contentType: "application/json",
        success: function (response) {
            console.log(response);

            $("#product-grid").empty();
            $.each(response.data, function (index, inventory) {
                let card = `
                     <div class="card" style="">
                        <img src="data:image/png;base64,${inventory.itemPicture}" class="card-img-top" style="min-height: 200px">
                        <div class="card-body pt-2 px-3">
                            <h4 class="mt-2" style="font-weight: 600">${inventory.itemCode}</h4>
                            <h5 class="card-title mb-0">${inventory.itemName}</h5>
                            <h6 class="small mt-1">${inventory.category}</h6>
                            <h5 class="mb-2 mt-2" style="font-family: 'Roboto';">${inventory.priceSale}/=</h5>
                        </div>
                    </div>`
                $("#product-grid").append(card);

                $.each(inventory.shoe_size_list, function (index, shoe_size) {
                    let size = shoe_size.size;
                    if(size == "1001"){
                        size = "Small";
                    }else if (size == "1002"){
                        size = "Medium";
                    }else if(size == "1003"){
                        size = "Large";
                    }

                    let ptag = `<p class="card-text" style="font-size: 12px; margin: 0">Size ${size}: &nbsp;${shoe_size.quantity} - ${shoe_size.status}</p>`
                    $("#product-grid .card-body:last").append(ptag);
                });
            });
        },
        error: function (jqxhr, textStatus, error) {
            alert("retrieving items by price - failed.")
            console.log(jqxhr);
        }
    })

});

$("#name-search").keyup(function () {
    let prefix = $("#name-search").val();

    clearFilterFields();
    $("#name-search").val(prefix);

    if(prefix == ""){
        getAllItems();
        return;
    }

    $.ajax({
        url: "http://localhost:8080/hello_shoes/api/v1/inventory/search/" + prefix,
        headers: { "Authorization": "Bearer " + localStorage.getItem("hs_token") },
        method: "GET",
        contentType: "application/json",
        success: function (response) {
            console.log(response);

            $("#product-grid").empty();
            $.each(response.data, function (index, inventory) {
                let card = `
                     <div class="card" style="">
                        <img src="data:image/png;base64,${inventory.itemPicture}" class="card-img-top" style="min-height: 200px">
                        <div class="card-body pt-2 px-3">
                            <h4 class="mt-2" style="font-weight: 600">${inventory.itemCode}</h4>
                            <h5 class="card-title mb-0">${inventory.itemName}</h5>
                            <h6 class="small mt-1">${inventory.category}</h6>
                            <h5 class="mb-2 mt-2" style="font-family: 'Roboto';">${inventory.priceSale}/=</h5>
                        </div>
                    </div>`
                $("#product-grid").append(card);

                $.each(inventory.shoe_size_list, function (index, shoe_size) {
                    let size = shoe_size.size;
                    if(size == "1001"){
                        size = "Small";
                    }else if (size == "1002"){
                        size = "Medium";
                    }else if(size == "1003"){
                        size = "Large";
                    }

                    let ptag = `<p class="card-text" style="font-size: 12px; margin: 0">Size ${size}: &nbsp;${shoe_size.quantity} - ${shoe_size.status}</p>`
                    $("#product-grid .card-body:last").append(ptag);
                });
            });
        },
        error: function (jqxhr, textStatus, error) {
            alert("retrieving items by price - failed.")
            console.log(jqxhr);
        }
    })
});

$(".rbGender").change(function (){
    let value = $(this).val();

    clearFilterFields();
    $(this).prop('checked', true);

    $.ajax({
        url: "http://localhost:8080/hello_shoes/api/v1/inventory/getAllByCategoryNamePart/ " + value + " ",
        headers: { "Authorization": "Bearer " + localStorage.getItem("hs_token") },
        method: "GET",
        contentType: "application/json",
        success: function (response) {
            console.log(response);

            $("#product-grid").empty();
            $.each(response.data, function (index, inventory) {
                let card = `
                     <div class="card" style="">
                        <img src="data:image/png;base64,${inventory.itemPicture}" class="card-img-top" style="min-height: 200px">
                        <div class="card-body pt-2 px-3">
                            <h4 class="mt-2" style="font-weight: 600">${inventory.itemCode}</h4>
                            <h5 class="card-title mb-0">${inventory.itemName}</h5>
                            <h6 class="small mt-1">${inventory.category}</h6>
                            <h5 class="mb-2 mt-2" style="font-family: 'Roboto';">${inventory.priceSale}/=</h5>
                        </div>
                    </div>`
                $("#product-grid").append(card);

                $.each(inventory.shoe_size_list, function (index, shoe_size) {
                    let size = shoe_size.size;
                    if(size == "1001"){
                        size = "Small";
                    }else if (size == "1002"){
                        size = "Medium";
                    }else if(size == "1003"){
                        size = "Large";
                    }
                    let ptag = `<p class="card-text" style="font-size: 12px; margin: 0">Size ${size}: &nbsp;${shoe_size.quantity} - ${shoe_size.status}</p>`
                    $("#product-grid .card-body:last").append(ptag);
                });
            });
        },
        error: function (jqxhr, textStatus, error) {
            alert("retrieving items by gender - failed.")
            console.log(jqxhr);
        }
    })
});

$(".rbOccasion").change(function (){
    let value = $(this).val();

    clearFilterFields();
    $(this).prop('checked', true);

    $.ajax({
        url: "http://localhost:8080/hello_shoes/api/v1/inventory/getAllByCategoryNamePart/ " + value + " ",
        headers: { "Authorization": "Bearer " + localStorage.getItem("hs_token") },
        method: "GET",
        contentType: "application/json",
        success: function (response) {
            console.log(response);

            $("#product-grid").empty();
            $.each(response.data, function (index, inventory) {
                let card = `
                     <div class="card" style="">
                        <img src="data:image/png;base64,${inventory.itemPicture}" class="card-img-top" style="min-height: 200px">
                        <div class="card-body pt-2 px-3">
                            <h4 class="mt-2" style="font-weight: 600">${inventory.itemCode}</h4>
                            <h5 class="card-title mb-0">${inventory.itemName}</h5>
                            <h6 class="small mt-1">${inventory.category}</h6>
                            <h5 class="mb-2 mt-2" style="font-family: 'Roboto';">${inventory.priceSale}/=</h5>
                        </div>
                    </div>`
                $("#product-grid").append(card);

                $.each(inventory.shoe_size_list, function (index, shoe_size) {
                    let size = shoe_size.size;
                    if(size == "1001"){
                        size = "Small";
                    }else if (size == "1002"){
                        size = "Medium";
                    }else if(size == "1003"){
                        size = "Large";
                    }
                    let ptag = `<p class="card-text" style="font-size: 12px; margin: 0">Size ${size}: &nbsp;${shoe_size.quantity} - ${shoe_size.status}</p>`
                    $("#product-grid .card-body:last").append(ptag);
                });
            });
        },
        error: function (jqxhr, textStatus, error) {
            alert("retrieving items by gender - failed.")
            console.log(jqxhr);
        }
    })
});

$("#filter-reset").click(function (){
    clearFilterFields();
    getAllItems();
})

$(document).ajaxError(function(event, jqxhr, settings, thrownError) {
    console.log(event);
    if (jqxhr.status === 401) {
        window.location.href = '../login.html';
    }
});

function clearFilterFields(){
    $("#name-search").val("");
    $("#min-price").val("");
    $("#max-price").val("");
    $(".rbGender").prop('checked', false);
    $(".rbOccasion").prop('checked', false);
}
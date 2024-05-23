$(document).ready(function () {

    let selectYears = $('#selectYears');
    let selectYears1 = $('#selectYears1');
    let currentYear = new Date().getFullYear();
    for (let i = 0; i < 6; i++) {
        let year = currentYear - i;
        $('<option>', { value: year, text: year }).appendTo(selectYears);
        $('<option>', { value: year, text: year }).appendTo(selectYears1);
    }
    selectYears.val(currentYear);
    selectYears1.val(currentYear);

    var currentMonth = new Date().getMonth() + 1;
    $('#selectMonth').val(currentMonth);
    $('#selectMonth1').val(currentMonth);

    getEmployeeCount();
    getSupplierCount();
    getCustomerCount();
    setDataToTotalSalesOfaSelectedDate(currentYear, currentMonth);
    setDataToMostSaleItemQty(currentYear, currentMonth);
    getPicOfMostSoldItem();
});

$(document).ajaxError(function(event, jqxhr, settings, thrownError) {
    console.log(event);
    if (jqxhr.status === 401) {
        window.location.href = '../../login.html';
    }
});

$('#selectYears').change(function () {
    let year = parseInt($('#selectYears').val());
    let month = parseInt($('#selectMonth').val());
    setDataToTotalSalesOfaSelectedDate(year, month);
});

$('#selectMonth').change(function () {
    let year = parseInt($('#selectYears').val());
    let month = parseInt($('#selectMonth').val());
    setDataToTotalSalesOfaSelectedDate(year, month);
});

$('#selectYears1').change(function () {
    let year = parseInt($('#selectYears1').val());
    let month = parseInt($('#selectMonth1').val());
    setDataToMostSaleItemQty(year, month);
});

$('#selectMonth1').change(function () {
    let year = parseInt($('#selectYears1').val());
    let month = parseInt($('#selectMonth1').val());
    setDataToMostSaleItemQty(year, month);
});

function getCustomerCount(){
    $.ajax({
        url: "http://localhost:8080/hello_shoes/api/v1/admin_dash/get_customer_count",
        headers: { "Authorization": "Bearer " + localStorage.getItem("hs_token") },
        method: "GET",
        success: function (response) {
            console.log(response);
            $("#customerCount").text(response);
        },
        error: function (jqxhr, textStatus, error) {
            console.log("getCustomerCount failed.");
            console.log(jqxhr);
        }
    })
}

function getEmployeeCount(){
    $.ajax({
        url: "http://localhost:8080/hello_shoes/api/v1/admin_dash/get_all_employees",
        headers: { "Authorization": "Bearer " + localStorage.getItem("hs_token") },
        method: "GET",
        success: function (response) {
            console.log(response.data);
            let emplyeeStr = "Employees:\n";
            let empCount = 0;
            $.each(response.data, function (index, employee) {
                let code = employee.code;
                let name = employee.name;
                emplyeeStr = emplyeeStr + code + ": " + name + "\n";
                empCount++;
            });
            console.log(emplyeeStr);
            $("#empCountInfo").attr("title", emplyeeStr);
            $("#employeeCount").text(empCount);
        },
        error: function (jqxhr, textStatus, error) {
            console.log("getEmployeeCount failed.");
            console.log(jqxhr);
        }
    })
}

function getSupplierCount(){
    $.ajax({
        url: "http://localhost:8080/hello_shoes/api/v1/admin_dash/get_all_suppliers",
        headers: { "Authorization": "Bearer " + localStorage.getItem("hs_token") },
        method: "GET",
        contentType: "application/json",
        success: function (response) {
            console.log(response);
            let suppStr = "Suppliers:\n";
            let suppCount = 0;
            $.each(response.data, function (index, supplier) {
                let code = supplier.code;
                let name = supplier.name;
                suppStr = suppStr + code + ": " + name + "\n";
                suppCount++;
            });
            $("#suppCountInfo").attr("title", suppStr);
            $("#supplierCount").text(suppCount);
        },
        error: function (jqxhr, textStatus, error) {
            alert("getSupplierCount failed.")
            console.log(jqxhr);
        }
    })
}

function getPicOfMostSoldItem(){
    $.ajax({
        url: "http://localhost:8080/hello_shoes/api/v1/admin_dash/get_picof_most_sold_item",
        headers: { "Authorization": "Bearer " + localStorage.getItem("hs_token") },
        method: "GET",
        contentType: "application/json",
        success: function (response) {
            console.log(response);
            $("#mostSaleItemImg").attr("src", "data:image/png;base64," + response.data.itemPicture);
            $("#itemCode").text(response.data.itemCode);
            $("#itemName").text(response.data.itemName);
            $("#itemCategory").text(response.data.category);
            $("#itemBuyingPrice").text(response.data.priceBuy);
            $("#itemSellingPrice").text(response.data.priceSale);
            $("#itemSuppCode").text(response.data.supplierCode);
            $("#itemSuppName").text(response.data.supplierName);
        },
        error: function (jqxhr, textStatus, error) {
            alert("getPicOfMostSoldItem failed.")
            console.log(jqxhr);
        }
    })

}

function setDataToMostSaleItemQty(year, month){
    $.ajax({
        url: "http://localhost:8080/hello_shoes/api/v1/admin_dash/get_orderdetails_with_date/"+year+"/"+month,
        headers: { "Authorization": "Bearer " + localStorage.getItem("hs_token") },
        method: "GET",
        contentType: "application/json",
        success: function (response) {
            console.log(response);

            const salesPerDay = response.data.reduce((acc, order) => {
                const date = order.orderDate;
                if (!acc[date]) {
                    acc[date] = {};
                }
                if (!acc[date][order.itemCode]) {
                    acc[date][order.itemCode] = { qty: 0, itemName: order.itemName };
                }
                acc[date][order.itemCode].qty += order.qty;
                return acc;
            }, {});

            const mostSoldPerDay = Object.keys(salesPerDay).map(date => {
                const items = salesPerDay[date];
                const mostSoldItemCode = Object.keys(items).reduce((a, b) => items[a].qty > items[b].qty ? a : b);
                return {
                    date,
                    itemName: items[mostSoldItemCode].itemName,
                    itemCode: mostSoldItemCode,
                    qty: items[mostSoldItemCode].qty
                };
            });

            console.log("most sold per day: ");
            console.log(mostSoldPerDay);

            const labels = mostSoldPerDay.map(data => data.date);
            const dataSet = mostSoldPerDay.map(data => data.qty);
            const itemNames = mostSoldPerDay.map(data => data.itemName);

            const ctx = document.getElementById('mostSaleQtyPerDayBarChart').getContext('2d');
            if (window.myChart1 && window.myChart1.config) {
                window.myChart1.destroy();
            }

            window.myChart1 = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Sold quantity',
                        data: dataSet,
                        backgroundColor: '#eee8aa',
                        borderColor: '#eee8aa',
                        borderWidth: 0,
                        hoverBackgroundColor: '#57370D'
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                display: true,
                                color: 'rgba(238,232,170,0.15)'
                            },
                            ticks: {
                                color: '#eee8aa'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: '#eee8aa'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false,
                        },
                        tooltip: {
                            callbacks: {
                                afterLabel: function(context) {
                                    const index = context.dataIndex;
                                    return ` (${itemNames[index]})`;
                                }
                            }
                        }
                    }
                }
            });
        },
        error: function (jqxhr, textStatus, error) {
            alert("setDataToMostSaleItemQty failed.")
            console.log(jqxhr);
        }
    })
}

function setDataToTotalSalesOfaSelectedDate(year, month){
    $.ajax({
        url: "http://localhost:8080/hello_shoes/api/v1/admin_dash/get_all_orders",
        headers: { "Authorization": "Bearer " + localStorage.getItem("hs_token") },
        method: "GET",
        contentType: "application/json",
        success: function (response) {
            let salesByDay = {};
            response.data.forEach(order => {
                const orderDate = new Date(order.orderDate);
                const orderYear = orderDate.getUTCFullYear();
                const orderMonth = orderDate.getUTCMonth() + 1;
                const orderDay = orderDate.getUTCDate();

                if (orderYear === year && orderMonth === month) {
                    const dateKey = `${orderYear}-${orderMonth.toString().padStart(2, '0')}-${orderDay.toString().padStart(2, '0')}`;
                    if (!salesByDay[dateKey]) {
                        salesByDay[dateKey] = 0;
                    }
                    salesByDay[dateKey] += order.totalPrice;
                }
            });

            console.log("data for salesPerDayBarChart:");
            console.log(salesByDay);

            var ctx = document.getElementById('salesPerDayBarChart').getContext('2d');

            if (window.myChart && window.myChart.config) {
                window.myChart.destroy();
            }

            window.myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: Object.keys(salesByDay),
                    datasets: [{
                        label: 'Total Sales',
                        data: Object.values(salesByDay),
                        backgroundColor: '#eee8aa',
                        borderColor: '#eee8aa',
                        borderWidth: 0,
                        hoverBackgroundColor: '#57370D'
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                display: true,
                                color: 'rgba(238,232,170,0.15)'
                            },
                            ticks: {
                                color: '#eee8aa'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: '#eee8aa'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false,
                        },
                    }
                }
            });
        },
        error: function (jqxhr, textStatus, error) {
            alert("setDataToTotalSalesOfaSelectedDate failed.")
            console.log(jqxhr);
        }
    })
}

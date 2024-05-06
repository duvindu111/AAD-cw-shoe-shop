package lk.ijse.gdse66.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lk.ijse.gdse66.backend.entity.Customer;
import lk.ijse.gdse66.backend.entity.Employee;
import lk.ijse.gdse66.backend.util.PaymentMethodEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDTO {
    @NotBlank(message = "Order id is mandatory")
    @Pattern(regexp = "^ORD-\\d+$", message = "Invalid order id")
    private String orderId;

    private Timestamp orderDate;

    private String customer;

    private String customerName;

    @NotNull(message = "total price is mandatory")
    private double totalPrice;

    @NotNull(message = "Added points is mandatory")
    private int addedPoints;

    @NotNull(message = "Payment method is mandatory")
    private PaymentMethodEnum paymentMethod;

    @NotBlank(message = "Employee is mandatory")
    private String employee;

    @NotBlank(message = "Cashier name is mandatory")
    private String cashierName;

    @Valid
    private List<OrderDetailDTO> orderDetailList;
}

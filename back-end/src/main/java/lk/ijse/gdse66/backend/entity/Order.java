package lk.ijse.gdse66.backend.entity;

import jakarta.persistence.*;
import lk.ijse.gdse66.backend.util.PaymentMethodEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "`order`")
public class Order {

    @Id
    @Column(name = "order_id", nullable = false)
    private String orderId;

    @Column(name = "order_date", nullable = false)
    private Timestamp orderDate;

    @ManyToOne
    @JoinColumn(name = "cust_code", referencedColumnName = "code")
    private Customer customer;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "total_price", nullable = false)
    private double totalPrice;

    @Column(name = "added_points", nullable = false)
    private int addedPoints;

    @Column(name = "payment_method", nullable = false)
    @Enumerated(EnumType.STRING)
    private PaymentMethodEnum paymentMethod;

    @ManyToOne
    @JoinColumn(name = "emp_code", referencedColumnName = "code")
    private Employee employee;

    @Column(name = "cashier_name", nullable = false)
    private String cashierName;

    @Override
public String toString() {
        return "Order{" +
                "orderId='" + orderId + '\'' +
                ", orderDate=" + orderDate +
                ", customer=" + customer +
                ", customerName='" + customerName + '\'' +
                ", totalPrice=" + totalPrice +
                ", addedPoints=" + addedPoints +
                ", paymentMethod=" + paymentMethod +
                ", employee=" + employee +
                ", cashierName='" + cashierName + '\'' +
                '}';
    }
}

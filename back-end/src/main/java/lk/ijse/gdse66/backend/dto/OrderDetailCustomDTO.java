package lk.ijse.gdse66.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDetailCustomDTO {
    private String orderId;
    private Date orderDate;
    private String itemName;
    private String itemCode;
    private int qty;
}

package lk.ijse.gdse66.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDetailDTO {

    private String orderId;
    private String itemCode;
    private String itemName;
    private double unitPrice;
    private int size;
    private int qty;
}

package lk.ijse.gdse66.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InventoryPlusQtyDTO {

    private String item_code;
    private String item_name;
    private String item_picture;
    private String category;
    private int size;
    private String supplier_code;
    private String supplier_name;
    private Double price_sale;
    private Double price_buy;
    private Double expected_profit;
    private Double profit_margin;
    private String status;
    private int qty;
}

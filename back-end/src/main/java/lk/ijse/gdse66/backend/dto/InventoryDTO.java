package lk.ijse.gdse66.backend.dto;

import lk.ijse.gdse66.backend.entity.ShoeSize;
import lk.ijse.gdse66.backend.entity.Supplier;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InventoryDTO {
    private String item_code;
    private String item_name;
    private String item_picture;
    private String category;
    private String supplier_code;
    private String supplier_name;
    private Double price_sale;
    private Double price_buy;
    private Double expected_profit;
    private Double profit_margin;
    private List<ShoeSizeDTO> shoe_size_list;
}

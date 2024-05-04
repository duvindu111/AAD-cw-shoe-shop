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
    private String itemCode;
    private String itemName;
    private String itemPicture;
    private String category;
    private String supplierCode;
    private String supplierName;
    private Double priceSale;
    private Double priceBuy;
    private Double expectedProfit;
    private Double profitMargin;
    private List<ShoeSizeDTO> shoe_size_list;
}

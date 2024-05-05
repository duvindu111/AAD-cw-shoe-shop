package lk.ijse.gdse66.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
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

    @NotBlank(message = "Item code is mandatory")
    private String itemCode;

    @NotBlank(message = "Item name is mandatory")
    @Pattern(regexp = "[A-Za-z0-9\\s]+", message = "Invalid Name")
    private String itemName;

    @NotBlank(message = "Item picture is mandatory")
    private String itemPicture;

    @NotBlank(message = "Item category is mandatory")
    private String category;

    @NotBlank(message = "Supplier code is mandatory")
    private String supplierCode;

    @NotBlank(message = "Supplier name is mandatory")
    private String supplierName;

    @NotNull(message = "Sale price is mandatory")
    private Double priceSale;

    @NotNull(message = "Buying price is mandatory")
    private Double priceBuy;

    @NotNull(message = "Profit is mandatory")
    private Double expectedProfit;

    @NotNull(message = "Profit margin is mandatory")
    private Double profitMargin;

    @Valid
    @NotNull(message = "Size list is mandatory")
    private List<ShoeSizeDTO> shoe_size_list;
}

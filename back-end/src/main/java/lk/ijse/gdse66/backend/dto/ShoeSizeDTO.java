package lk.ijse.gdse66.backend.dto;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShoeSizeDTO {
    private String itemCode;
    private int size;

    @PositiveOrZero(message = "Quantity should be positive")
    private int quantity;
    private String status;
}

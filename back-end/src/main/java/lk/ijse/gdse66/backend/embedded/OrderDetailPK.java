package lk.ijse.gdse66.backend.embedded;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class OrderDetailPK implements Serializable {

    @Column(name = "order_id")
    private String orderId;
    @Column(name = "item_code")
    private String itemCode;
    @Column(name = "size")
    private int size;
}

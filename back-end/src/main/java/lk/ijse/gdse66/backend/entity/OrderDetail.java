package lk.ijse.gdse66.backend.entity;

import jakarta.persistence.*;
import lk.ijse.gdse66.backend.embedded.OrderDetailPK;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "order_detail")
public class OrderDetail {

    @EmbeddedId
    private OrderDetailPK orderDetailPK;
    @Column(name = "item_name", nullable = false)
    private String itemName;
    @Column(name = "unit_price")
    private double unitPrice;
    @Column(name = "qty")
    private int qty;

    @ManyToOne
    @JoinColumn(name = "order_id",
            referencedColumnName = "order_id",
            insertable = false,
            updatable = false)
    private Order order;

    @ManyToOne
    @JoinColumn(name = "item_code",
            referencedColumnName = "item_code",
            insertable = false,
            updatable = false)
    private Inventory inventory;
}

package lk.ijse.gdse66.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Inventory {
    @Id
    private String item_code;
    private String item_name;
    @Column(columnDefinition = "LONGTEXT")
    private String item_picture;
    private String category;

    @ManyToOne(cascade = {CascadeType.REFRESH,CascadeType.DETACH})
    @JoinColumn(name = "supplier_code",referencedColumnName = "code", nullable = false)
    private Supplier supplier_code;

    private String supplier_name;
    private Double price_sale;
    private Double price_buy;
    private Double expected_profit;
    private Double profit_margin;
}
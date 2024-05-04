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
    @Column(name = "item_code")
    private String itemCode;
    @Column(name = "item_name")
    private String itemName;
    @Column(name = "item_picture", columnDefinition = "LONGTEXT")
    private String itemPicture;
    private String category;

    @ManyToOne(cascade = {CascadeType.REFRESH,CascadeType.DETACH})
    @JoinColumn(name = "supplier_code",referencedColumnName = "code", nullable = false)
    private Supplier supplierCode;

    @Column(name = "supplier_name")
    private String supplierName;
    @Column(name = "price_sale")
    private Double priceSale;
    @Column(name = "price_buy")
    private Double priceBuy;
    @Column(name = "expected_profit")
    private Double expectedProfit;
    @Column(name = "profit_margin")
    private Double profitMargin;
}
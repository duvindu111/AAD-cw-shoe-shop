package lk.ijse.gdse66.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "shoe_size")
public class ShoeSize {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "item_code", referencedColumnName = "item_code", nullable = false)
    private Inventory item_code;

    private int size;
    private int quantity;
    private String status;
}
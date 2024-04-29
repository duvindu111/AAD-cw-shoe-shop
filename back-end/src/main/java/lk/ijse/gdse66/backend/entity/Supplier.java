package lk.ijse.gdse66.backend.entity;

import jakarta.persistence.*;
import lk.ijse.gdse66.backend.util.CategoryEnum;
import lk.ijse.gdse66.backend.util.GenderEnum;
import lk.ijse.gdse66.backend.util.LoyaltyLevelEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Supplier {

    @Id
    private String code;
    private String name;
    @Enumerated(EnumType.STRING)
    private CategoryEnum category;
    private String addressLine1;
    private String addressLine2;
    private String addressLine3;
    private String addressLine4;
    private String addressLine5;
    private String addressLine6;
    private String mobile_contact;
    private String landline_contact;

    @Column(unique = true)
    private String email;
}

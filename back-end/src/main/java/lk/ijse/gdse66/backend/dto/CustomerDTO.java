package lk.ijse.gdse66.backend.dto;

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
public class CustomerDTO {
    private String code;
    private String name;
    private GenderEnum gender;
    private Date loyaltyJoinedDate;
    private LoyaltyLevelEnum loyaltyLevel;
    private Integer loyaltyPoints;
    private Date dob;
    private String addressLine1;
    private String addressLine2;
    private String addressLine3;
    private String addressLine4;
    private String addressLine5;
    private String contact;
    private String email;
    private Timestamp recentPurchaseDate;
}

package lk.ijse.gdse66.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lk.ijse.gdse66.backend.util.GenderEnum;
import lk.ijse.gdse66.backend.util.LoyaltyLevelEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.sql.Date;
import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerDTO implements Serializable {

    @NotBlank(message = "Name is mandatory")
    @Pattern(regexp = "^CUS-\\d+$", message = "Invalid Code")
    private String code;

    @NotBlank(message = "Name is mandatory")
    @Pattern(regexp = "[A-Za-z\\s]+", message = "Invalid Name")
    private String name;

    @NotNull(message = "Gender is mandatory")
    private GenderEnum gender;

    @NotNull(message = "Joined date as a loyalty customer is mandatory")
    private Date loyaltyJoinedDate;

    @NotNull(message = "Loyalty level is mandatory")
    private LoyaltyLevelEnum loyaltyLevel;

    @NotNull(message = "Loyalty points is mandatory")
    private Integer loyaltyPoints;

    @NotNull(message = "Date of birth is mandatory")
    private Date dob;

    private String addressLine1;
    private String addressLine2;
    @NotBlank(message = "Main city is mandatory")
    private String addressLine3;
    @NotBlank(message = "Main state is mandatory")
    private String addressLine4;
    @NotBlank(message = "Postal code is mandatory")
    private String addressLine5;

    @NotBlank(message = "Contact number is mandatory")
    private String contact;

    @NotBlank(message = "Email is mandatory")
    private String email;

    private Timestamp recentPurchaseDate;

}

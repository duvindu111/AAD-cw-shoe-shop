package lk.ijse.gdse66.backend.dto;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lk.ijse.gdse66.backend.util.CategoryEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SupplierDTO {

    @NotBlank(message = "Code is mandatory")
    @Pattern(regexp = "^SUP-\\d+$", message = "Invalid Code")
    private String code;

    @NotBlank(message = "Name is mandatory")
    @Pattern(regexp = "[A-Za-z\\s]+", message = "Invalid Name")
    private String name;

    @Enumerated(EnumType.STRING)
    private CategoryEnum category;

    private String addressLine1;
    private String addressLine2;
    @NotBlank(message = "Main city is mandatory")
    private String addressLine3;
    @NotBlank(message = "Main state is mandatory")
    private String addressLine4;
    @NotBlank(message = "Postal code is mandatory")
    private String addressLine5;
    @NotBlank(message = "Origin country is mandatory")
    private String addressLine6;

    @Pattern(regexp = "^(\\+ ?)?(?:[0-9] ?){6,14}[0-9]$|^$",
            message = "Invalid mobile contact number")
    private String mobile_contact;

    @Pattern(regexp = "^(\\+ ?)?(?:[0-9] ?){6,14}[0-9]$|^$",
            message = "Invalid landline contact number")
    private String landline_contact;


    @NotBlank(message = "Email is mandatory")
    @Email(message = "Invalid email address")
    private String email;
}

package lk.ijse.gdse66.backend.dto;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lk.ijse.gdse66.backend.util.AccessRoleEnum;
import lk.ijse.gdse66.backend.util.GenderEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeDTO {

    @NotBlank(message = "Code is mandatory")
    @Pattern(regexp = "^EMP-\\d+$", message = "Invalid Code")
    private String code;

    @NotBlank(message = "Name is mandatory")
    @Pattern(regexp = "[A-Za-z\\s]+", message = "Invalid Name")
    private String name;

    @NotBlank(message = "Picture is mandatory")
    private String profilePic;

    private GenderEnum gender;

    @NotBlank(message = "Civil status is mandatory")
    private String civilStatus;

    @NotBlank(message = "Designation is mandatory")
    private String designation;

    @NotNull(message = "Access role is mandatory")
    private AccessRoleEnum role;

    @NotNull(message = "Date of birth is mandatory")
    private Date dob;

    @NotNull(message = "Join date is mandatory")
    private Date joinDate;

    @NotBlank(message = "Branch is mandatory")
    private String branch;

    private String addressLine1;
    private String addressLine2;
    @NotBlank(message = "Main city is mandatory")
    private String addressLine3;
    @NotBlank(message = "Main state is mandatory")
    private String addressLine4;
    @NotBlank(message = "Postal code is mandatory")
    private String addressLine5;

    @NotBlank(message = "Contact number is mandatory")
    @Pattern(regexp = "^(\\+ ?)?(?:[0-9] ?){6,14}[0-9]$", message = "Invalid contact number")
    private String contact;

    @NotBlank(message = "Email is mandatory")
    @Email(message = "Invalid email address")
    private String email;

    @Pattern(regexp = "[A-Za-z\\s]*", message = "Invalid guardian name")
    private String guardianName;

    @Pattern(regexp = "^(\\+ ?)?(?:[0-9] ?){6,14}[0-9]$|^$", message = "Invalid guardian contact number")
    private String guardianContact;
}

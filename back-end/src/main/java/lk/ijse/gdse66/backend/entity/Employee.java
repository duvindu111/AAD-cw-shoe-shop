package lk.ijse.gdse66.backend.entity;

import jakarta.persistence.*;
import lk.ijse.gdse66.backend.util.AccessRoleEnum;
import lk.ijse.gdse66.backend.util.GenderEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Employee {

    @Id
    private String code;
    private String name;
    @Column(columnDefinition = "LONGTEXT")
    private String profilePic;
    @Enumerated(EnumType.STRING)
    private GenderEnum gender;
    private String civilStatus;
    private String designation;
    @Enumerated(EnumType.STRING)
    private AccessRoleEnum role;
    private Date dob;
    private Date joinDate;
    private String branch;
    private String addressLine1;
    private String addressLine2;
    private String addressLine3;
    private String addressLine4;
    private String addressLine5;
    private String contact;

    @Column(unique = true)
    private String email;
    private String guardianName;
    private String guardianContact;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "employee")
    private List<Order> orders = new ArrayList<>();
}

package lk.ijse.gdse66.backend.dto;

import lk.ijse.gdse66.backend.util.AccessRoleEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDTO {
    private String email;
    private String password;
    private AccessRoleEnum role;
}

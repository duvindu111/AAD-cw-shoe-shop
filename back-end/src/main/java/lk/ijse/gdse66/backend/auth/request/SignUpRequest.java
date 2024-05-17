package lk.ijse.gdse66.backend.auth.request;

import lk.ijse.gdse66.backend.util.AccessRoleEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SignUpRequest {
    private String email;
    private String password;
    private AccessRoleEnum role;
}

package lk.ijse.gdse66.backend.services;

import lk.ijse.gdse66.backend.auth.request.SignInRequest;
import lk.ijse.gdse66.backend.auth.request.SignUpRequest;
import lk.ijse.gdse66.backend.auth.response.JWTAuthResponse;
import lk.ijse.gdse66.backend.dto.UserDTO;

import java.util.List;

public interface AuthenticationService {
    JWTAuthResponse signIn(SignInRequest sIgnInRequest);
    JWTAuthResponse signUp(SignUpRequest signUpRequest);

    List<String> sendWishes();

    Boolean checkCredentials(UserDTO userDTO);
}

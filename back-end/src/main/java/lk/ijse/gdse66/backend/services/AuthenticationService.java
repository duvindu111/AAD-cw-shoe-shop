package lk.ijse.gdse66.backend.services;

import lk.ijse.gdse66.backend.auth.request.SignInRequest;
import lk.ijse.gdse66.backend.auth.request.SignUpRequest;
import lk.ijse.gdse66.backend.auth.response.JWTAuthResponse;

public interface AuthenticationService {
    JWTAuthResponse signIn(SignInRequest sIgnInRequest);
    JWTAuthResponse signUp(SignUpRequest signUpRequest);
}

package lk.ijse.gdse66.backend.controller;

import lk.ijse.gdse66.backend.auth.request.SignInRequest;
import lk.ijse.gdse66.backend.auth.request.SignUpRequest;
import lk.ijse.gdse66.backend.auth.response.JWTAuthResponse;
import lk.ijse.gdse66.backend.services.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/auth")
@RequiredArgsConstructor
public class UserController {

    private final AuthenticationService authenticationService;

    @PostMapping("/signin")
    public ResponseEntity<JWTAuthResponse> signIn(@RequestBody SignInRequest signInRequest){
        System.out.println("usercontroller signin");
        return ResponseEntity.ok(authenticationService.signIn(signInRequest));
    }

    @PostMapping("/signup")
    public ResponseEntity<JWTAuthResponse> signUp(@RequestBody SignUpRequest signUpRequest){
        System.out.println("usercontroller signup");
        return ResponseEntity.ok(authenticationService.signUp(signUpRequest));
    }
}

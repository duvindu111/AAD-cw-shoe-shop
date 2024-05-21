package lk.ijse.gdse66.backend.services.impl;

import lk.ijse.gdse66.backend.auth.request.SignInRequest;
import lk.ijse.gdse66.backend.auth.request.SignUpRequest;
import lk.ijse.gdse66.backend.auth.response.JWTAuthResponse;
import lk.ijse.gdse66.backend.dto.UserDTO;
import lk.ijse.gdse66.backend.entity.Customer;
import lk.ijse.gdse66.backend.entity.User;
import lk.ijse.gdse66.backend.repo.CustomerRepo;
import lk.ijse.gdse66.backend.repo.UserRepo;
import lk.ijse.gdse66.backend.services.AuthenticationService;
import lk.ijse.gdse66.backend.services.JWTService;
import lk.ijse.gdse66.backend.services.exceptions.DuplicateRecordException;
import lk.ijse.gdse66.backend.services.util.EmailUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationServiceImpl implements AuthenticationService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepo userRepo;
    private final ModelMapper mapper;
    private final JWTService jwtService;
    private final AuthenticationManager authenticationManager;
    private final CustomerRepo customerRepo;
    private final Path stateFilePath = Paths.get("task_state.txt");

    @Override
    public JWTAuthResponse signIn(SignInRequest signInRequest) {
        log.info("signing in new user: {}", signInRequest.getEmail());
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(signInRequest.getEmail(), signInRequest.getPassword()));
        User user = userRepo.findByEmail(signInRequest.getEmail()).orElseThrow(()->new UsernameNotFoundException("User Not Found"));
        String generatedToken = jwtService.generateToken(user);
        String role = user.getRole().name();

//        try {
//            EmailUtil.sendEmail("duvinduthathsara@gmail.com", "this is the message", "message body brother");
//            System.out.println("Email sent successfully.");
//        } catch (MessagingException e) {
//            e.printStackTrace();
//            System.out.println("Failed to send email.");
//        }

        return JWTAuthResponse.builder().token(generatedToken).role(role).build();
    }

    @Override
    public JWTAuthResponse signUp(SignUpRequest signUpRequest) {
        log.info("trying to create a new user account: {}", signUpRequest.getEmail());
        UserDTO userDTO = UserDTO.builder()
                .email(signUpRequest.getEmail())
                .password(passwordEncoder.encode(signUpRequest.getPassword()))
                .role(signUpRequest.getRole())
                .build();

        User savedUser;
        if(userRepo.existsById(userDTO.getEmail())){
            throw new DuplicateRecordException("User with email " + userDTO.getEmail() + " already exists");
        }else{
            savedUser = userRepo.save(mapper.map(userDTO, User.class));
        }
        String generatedToken = jwtService.generateToken(savedUser);
        return JWTAuthResponse.builder().token(generatedToken).build();
    }

    @Override
    public List<String> sendWishes() {
        List<String> custStringList = new ArrayList<>();
        if (!isTaskExecutedToday()) {
            List<Customer> customersByBirthdayToday = customerRepo.findCustomersByBirthdayToday();
            customersByBirthdayToday.forEach(customer -> {
                try {
                    EmailUtil.sendEmail(customer.getEmail(), "Happy Birthday!", "Happy Birthday " + customer.getName() + "!");
                } catch (MessagingException e) {
                    throw new RuntimeException(e);
                }finally {
                    String custCode = customer.getCode();
                    String name = customer.getName();
                    String together = custCode + " - " + name;
                    custStringList.add(together);
                    saveLastExecutionDate(new Date());
                }
            });
            return custStringList;
        }else{
            return custStringList;
        }
    }

    private boolean isTaskExecutedToday() {
        try {
            if (Files.exists(stateFilePath)) {
                System.out.println("exists");
                String lastExecutionDateStr = Files.readString(stateFilePath).trim();
                if(lastExecutionDateStr.isEmpty() || !lastExecutionDateStr.matches("-?\\d+")) {
                    return false;
                }
                Date lastExecutionDate = new Date(Long.parseLong(lastExecutionDateStr));
                Calendar currentCal = Calendar.getInstance();
                Calendar lastExecutionCal = Calendar.getInstance();
                lastExecutionCal.setTime(lastExecutionDate);
                return currentCal.get(Calendar.YEAR) == lastExecutionCal.get(Calendar.YEAR) &&
                        currentCal.get(Calendar.DAY_OF_YEAR) == lastExecutionCal.get(Calendar.DAY_OF_YEAR);
            }else {
                System.out.println("doesn't exist");
                Files.createFile(stateFilePath);
                Calendar yesterdayCal = Calendar.getInstance();
                yesterdayCal.add(Calendar.DAY_OF_MONTH, -1);
                Date yesterdayDate = yesterdayCal.getTime();
                saveLastExecutionDate(yesterdayDate);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return false;
    }

    private void saveLastExecutionDate(Date executionDate) {
        try {
            Files.writeString(stateFilePath, String.valueOf(executionDate.getTime()));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

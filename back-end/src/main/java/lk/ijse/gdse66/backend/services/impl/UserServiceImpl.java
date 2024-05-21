package lk.ijse.gdse66.backend.services.impl;

import lk.ijse.gdse66.backend.dto.UserDTO;
import lk.ijse.gdse66.backend.entity.User;
import lk.ijse.gdse66.backend.repo.UserRepo;
import lk.ijse.gdse66.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {
    private final UserRepo userRepo;
    private final ModelMapper mapper;

    @Override
    public UserDetailsService userDetailsService() {
        return username -> {
            return userRepo.findByEmail(username).orElseThrow(()->new UsernameNotFoundException("User Not Found"));
        };
    }

    @Override
    public void save(UserDTO userDTO) {
        userRepo.save(mapper.map(userDTO, User.class));
    }
}

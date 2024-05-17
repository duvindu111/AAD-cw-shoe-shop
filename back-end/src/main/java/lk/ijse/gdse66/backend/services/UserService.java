package lk.ijse.gdse66.backend.services;

import lk.ijse.gdse66.backend.dto.UserDTO;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService {

    UserDetailsService userDetailsService();
    void save(UserDTO userDTO);
}

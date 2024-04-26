package lk.ijse.gdse66.backend.repo;

import lk.ijse.gdse66.backend.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepo extends JpaRepository<Customer, String> {

    Customer findTopByOrderByCodeDesc();
}

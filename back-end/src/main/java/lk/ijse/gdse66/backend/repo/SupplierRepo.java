package lk.ijse.gdse66.backend.repo;

import lk.ijse.gdse66.backend.entity.Customer;
import lk.ijse.gdse66.backend.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupplierRepo extends JpaRepository<Supplier, String> {

    Supplier findTopByOrderByCodeDesc();

    List<Supplier> findAllByNameStartingWith(String codePrefix);

    Boolean existsByEmail(String email);
}

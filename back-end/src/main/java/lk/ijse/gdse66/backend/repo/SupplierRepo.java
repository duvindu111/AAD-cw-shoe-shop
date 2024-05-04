package lk.ijse.gdse66.backend.repo;

import lk.ijse.gdse66.backend.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupplierRepo extends JpaRepository<Supplier, String> {

    Supplier findTopByOrderByCodeDesc();

    List<Supplier> findAllByNameStartingWith(String codePrefix);

    Boolean existsByEmail(String email);

    @Query(value = "SELECT code FROM supplier", nativeQuery = true)
    List<String> findSupplierCodes();

    @Query(value = "SELECT name FROM supplier WHERE code=?1", nativeQuery = true)
    String findNameByCode(String supplierCode);

    Supplier findByCode(String code);

}

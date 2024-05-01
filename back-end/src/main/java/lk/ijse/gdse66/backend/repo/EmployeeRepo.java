package lk.ijse.gdse66.backend.repo;

import lk.ijse.gdse66.backend.entity.Employee;
import lk.ijse.gdse66.backend.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepo extends JpaRepository<Employee, String> {

    Employee findTopByOrderByCodeDesc();

    List<Employee> findAllByNameStartingWith(String codePrefix);
}

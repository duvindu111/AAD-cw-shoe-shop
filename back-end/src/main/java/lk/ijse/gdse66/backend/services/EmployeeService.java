package lk.ijse.gdse66.backend.services;

import lk.ijse.gdse66.backend.dto.EmployeeDTO;
import lk.ijse.gdse66.backend.dto.SupplierDTO;

import java.util.List;

public interface EmployeeService {

    void saveEmployee(EmployeeDTO employeeDTO);

    void updateEmployee(EmployeeDTO employeeDTO);

    boolean deleteEmployee(String id);

    List<EmployeeDTO> getAllEmployees();

    String getLastId();

    List<EmployeeDTO> searchEmployeesByName(String prefix);
}

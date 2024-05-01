package lk.ijse.gdse66.backend.services.impl;

import lk.ijse.gdse66.backend.dto.EmployeeDTO;
import lk.ijse.gdse66.backend.dto.SupplierDTO;
import lk.ijse.gdse66.backend.entity.Employee;
import lk.ijse.gdse66.backend.entity.Supplier;
import lk.ijse.gdse66.backend.repo.EmployeeRepo;
import lk.ijse.gdse66.backend.services.EmployeeService;
import lk.ijse.gdse66.backend.services.exceptions.DuplicateRecordException;
import lk.ijse.gdse66.backend.services.exceptions.NotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.List;

@Service
public class EmployeeServiceImpl implements EmployeeService{

    private EmployeeRepo employeeRepo;
    private ModelMapper mapper;

    public EmployeeServiceImpl(EmployeeRepo employeeRepo, ModelMapper mapper) {
        this.employeeRepo = employeeRepo;
        this.mapper = mapper;
    }

    @Override
    public void saveEmployee(EmployeeDTO employeeDTO) {
        if(employeeRepo.existsById(employeeDTO.getCode())){
            throw new DuplicateRecordException("Employee with id " + employeeDTO.getCode() + " already exists");
        }else{
            employeeRepo.save(mapper.map(employeeDTO, Employee.class));
        }
    }

    @Override
    public void updateEmployee(EmployeeDTO employeeDTO) {
        if(!employeeRepo.existsById(employeeDTO.getCode())){
            throw new NotFoundException("No such employee to update | employee Id: " + employeeDTO.getCode());
        }else{
            employeeRepo.save(mapper.map(employeeDTO, Employee.class));
        }
    }

    @Override
    public boolean deleteEmployee(String id) {
        return false;
    }

    @Override
    public List<EmployeeDTO> getAllEmployees() {
        return employeeRepo.findAll().stream().map(employee -> mapper.map(employee, EmployeeDTO.class)).toList();
    }

    @Override
    public String getLastId() {
        Employee lastEmployee = employeeRepo.findTopByOrderByCodeDesc();
        System.out.println(lastEmployee);

        if (lastEmployee == null) {
            return "";
        }else{
            return lastEmployee.getCode();
        }
    }

    @Override
    public List<EmployeeDTO> searchEmployeesByName(String prefix) {
        return List.of();
    }
}

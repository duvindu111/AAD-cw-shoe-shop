package lk.ijse.gdse66.backend.controller;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ValidationException;
import jakarta.validation.Validator;
import lk.ijse.gdse66.backend.dto.EmployeeDTO;
import lk.ijse.gdse66.backend.dto.ResponseDTO;
import lk.ijse.gdse66.backend.services.EmployeeService;
import lk.ijse.gdse66.backend.util.AccessRoleEnum;
import lk.ijse.gdse66.backend.util.GenderEnum;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.Date;
import java.util.Base64;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/employee")
@CrossOrigin(origins = "*")
public class EmployeeController {

    private EmployeeService employeeService;
    private ResponseDTO responseDTO;
    private Validator validator;

    public EmployeeController(EmployeeService employeeService, ResponseDTO responseDTO, Validator validator) {
        this.employeeService = employeeService;
        this.responseDTO = responseDTO;
        this.validator = validator;
    }

    @GetMapping("/getlastid")
    public String getLastId(){
        return employeeService.getLastId();
    }

    @PostMapping(value = "/save")
    @ResponseStatus(HttpStatus.CREATED)
    public void save(@RequestParam("code") String code, @RequestParam("name") String name,
                     @RequestParam("profilePic") MultipartFile profilePic, @RequestParam("gender") GenderEnum gender,
                     @RequestParam("civilStatus") String civilStatus, @RequestParam("designation") String designation,
                     @RequestParam("role") AccessRoleEnum role, @RequestParam("dob") Date dob,
                     @RequestParam("joinDate") Date joinDate, @RequestParam("branch") String branch,
                     @RequestParam("addressLine1") String addressLine1, @RequestParam("addressLine2") String addressLine2,
                     @RequestParam("addressLine3") String addressLine3, @RequestParam("addressLine4") String addressLine4,
                     @RequestParam("addressLine5") String addressLine5,
                     @RequestParam("contact") String contact, @RequestParam("email") String email,
                     @RequestParam("guardianName") String guardianName, @RequestParam("guardianContact") String guardianContact)
            throws IOException {

        byte[] bytes = profilePic.getBytes();
        String base64ProfilePic = Base64.getEncoder().encodeToString(bytes);

        EmployeeDTO employeeDTO = new EmployeeDTO(code, name, base64ProfilePic, gender, civilStatus, designation, role, dob,
                joinDate, branch, addressLine1, addressLine2, addressLine3, addressLine4, addressLine5, contact, email,
                guardianName, guardianContact);

        Set<ConstraintViolation<EmployeeDTO>> violations = validator.validate(employeeDTO);
        if (!violations.isEmpty()) {
            for (ConstraintViolation<EmployeeDTO> violation : violations) {
                System.out.println(violation.getMessage());
            }
            throw new ValidationException("Data Validation Failed.");
        }else{
            employeeService.saveEmployee(employeeDTO);
        }
    }

    @PatchMapping(value = "/update")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void update(@RequestParam("code") String code, @RequestParam("name") String name,
                     @RequestParam("profilePic") MultipartFile profilePic, @RequestParam("gender") GenderEnum gender,
                     @RequestParam("civilStatus") String civilStatus, @RequestParam("designation") String designation,
                     @RequestParam("role") AccessRoleEnum role, @RequestParam("dob") Date dob,
                     @RequestParam("joinDate") Date joinDate, @RequestParam("branch") String branch,
                     @RequestParam("addressLine1") String addressLine1, @RequestParam("addressLine2") String addressLine2,
                     @RequestParam("addressLine3") String addressLine3, @RequestParam("addressLine4") String addressLine4,
                     @RequestParam("addressLine5") String addressLine5,
                     @RequestParam("contact") String contact, @RequestParam("email") String email,
                     @RequestParam("guardianName") String guardianName, @RequestParam("guardianContact") String guardianContact)
            throws IOException {

        byte[] bytes = profilePic.getBytes();
        String base64ProfilePic = Base64.getEncoder().encodeToString(bytes);

        EmployeeDTO employeeDTO = new EmployeeDTO(code, name, base64ProfilePic, gender, civilStatus, designation, role, dob,
                joinDate, branch, addressLine1, addressLine2, addressLine3, addressLine4, addressLine5, contact, email,
                guardianName, guardianContact);

        Set<ConstraintViolation<EmployeeDTO>> violations = validator.validate(employeeDTO);
        if (!violations.isEmpty()) {
            for (ConstraintViolation<EmployeeDTO> violation : violations) {
                System.out.println(violation.getMessage());
            }
            throw new ValidationException("Data Validation Failed.");
        }else{
            employeeService.updateEmployee(employeeDTO);
        }
    }

    @DeleteMapping("/delete/{code}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCustomer(@PathVariable String code){
        employeeService.deleteEmployee(code);
    }

    @GetMapping("/getall")
    public ResponseEntity<ResponseDTO> getAllEmployees(){
        try{
            List<EmployeeDTO> supplierList = employeeService.getAllEmployees();

            responseDTO.setCode(HttpStatus.OK);
            responseDTO.setMessage("Success");
            responseDTO.setData(supplierList);
            return new ResponseEntity<>(responseDTO, HttpStatus.OK);
        }catch (Exception exc){
            responseDTO.setCode(HttpStatus.INTERNAL_SERVER_ERROR);
            responseDTO.setMessage(exc.getMessage());
            responseDTO.setData(exc);
            return new ResponseEntity<>(responseDTO, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/search/{prefix}")
    public ResponseEntity<ResponseDTO> searchEmployeesByName(@PathVariable String prefix){
        try{
            List<EmployeeDTO> employeeList = employeeService.searchEmployeesByName(prefix);

            responseDTO.setCode(HttpStatus.OK);
            responseDTO.setMessage("Success");
            responseDTO.setData(employeeList);
            return new ResponseEntity<>(responseDTO, HttpStatus.OK);
        }catch (Exception exc){
            responseDTO.setCode(HttpStatus.INTERNAL_SERVER_ERROR);
            responseDTO.setMessage(exc.getMessage());
            responseDTO.setData(exc);
            return new ResponseEntity<>(responseDTO, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

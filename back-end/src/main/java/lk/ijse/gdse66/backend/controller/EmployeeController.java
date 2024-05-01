package lk.ijse.gdse66.backend.controller;

import lk.ijse.gdse66.backend.dto.EmployeeDTO;
import lk.ijse.gdse66.backend.dto.ResponseDTO;
import lk.ijse.gdse66.backend.dto.SupplierDTO;
import lk.ijse.gdse66.backend.entity.Employee;
import lk.ijse.gdse66.backend.services.EmployeeService;
import lk.ijse.gdse66.backend.util.AccessRoleEnum;
import lk.ijse.gdse66.backend.util.GenderEnum;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.Date;
import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/api/v1/employee")
@CrossOrigin(origins = "*")
public class EmployeeController {

    public EmployeeService employeeService;
    public ResponseDTO responseDTO;

    public EmployeeController(EmployeeService employeeService, ResponseDTO responseDTO) {
        this.employeeService = employeeService;
        this.responseDTO = responseDTO;
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
        System.out.println(profilePic);
        byte[] bytes = profilePic.getBytes();
        String base64ProfilePic = Base64.getEncoder().encodeToString(bytes);
        System.out.println(base64ProfilePic);

        EmployeeDTO employeeDTO = new EmployeeDTO(code, name, base64ProfilePic, gender, civilStatus, designation, role, dob,
                joinDate, branch, addressLine1, addressLine2, addressLine3, addressLine4, addressLine5, contact, email,
                guardianName, guardianContact);

        employeeService.saveEmployee(employeeDTO);
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
        System.out.println(profilePic);
        byte[] bytes = profilePic.getBytes();
        String base64ProfilePic = Base64.getEncoder().encodeToString(bytes);
        System.out.println(base64ProfilePic);

        EmployeeDTO employeeDTO = new EmployeeDTO(code, name, base64ProfilePic, gender, civilStatus, designation, role, dob,
                joinDate, branch, addressLine1, addressLine2, addressLine3, addressLine4, addressLine5, contact, email,
                guardianName, guardianContact);

        employeeService.updateEmployee(employeeDTO);
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
}

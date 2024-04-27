package lk.ijse.gdse66.backend.controller;

import jakarta.validation.Valid;
import jdk.jshell.Snippet;
import lk.ijse.gdse66.backend.dto.CustomerDTO;
import lk.ijse.gdse66.backend.dto.ResponseDTO;
import lk.ijse.gdse66.backend.services.CustomerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customer")
@CrossOrigin(origins = "*")
public class CustomerController {

    private CustomerService customerService;
    private ResponseDTO responseDTO;

    public CustomerController(CustomerService customerService, ResponseDTO responseDTO) {
        this.customerService = customerService;
        this.responseDTO = responseDTO;
    }

    @GetMapping("/getlastid")
    public String getLastId(){
        return customerService.getLastId();
    }

    @PostMapping("/save")
    @ResponseStatus(HttpStatus.CREATED)
    public void save(@RequestBody CustomerDTO customerDTO){
         customerService.saveCustomer(customerDTO);
    }

    @GetMapping("/getall")
    public ResponseEntity<ResponseDTO> getAllCustomers(){
        try{
            List<CustomerDTO> customerList = customerService.getAllCustomers();

            responseDTO.setCode(HttpStatus.OK);
            responseDTO.setMessage("Success");
            responseDTO.setData(customerList);
            return new ResponseEntity<>(responseDTO, HttpStatus.OK);
        }catch (Exception exc){
            responseDTO.setCode(HttpStatus.INTERNAL_SERVER_ERROR);
            responseDTO.setMessage(exc.getMessage());
            responseDTO.setData(exc);
            return new ResponseEntity<>(responseDTO, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping("/update")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateCustomer(@Valid @RequestBody CustomerDTO customerDTO){
        customerService.updateCustomer(customerDTO);
    }

    @DeleteMapping("/delete/{code}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCustomer(@PathVariable String code){
        customerService.deleteCustomer(code);
    }

    @GetMapping("/search/{prefix}")
    public ResponseEntity<ResponseDTO> searchCustomersByName(@PathVariable String prefix){
        try{
            List<CustomerDTO> customerList = customerService.searchCustomersByName(prefix);

            responseDTO.setCode(HttpStatus.OK);
            responseDTO.setMessage("Success");
            responseDTO.setData(customerList);
            return new ResponseEntity<>(responseDTO, HttpStatus.OK);
        }catch (Exception exc){
            responseDTO.setCode(HttpStatus.INTERNAL_SERVER_ERROR);
            responseDTO.setMessage(exc.getMessage());
            responseDTO.setData(exc);
            return new ResponseEntity<>(responseDTO, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

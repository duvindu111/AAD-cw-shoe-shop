package lk.ijse.gdse66.backend.controller;

import jakarta.validation.Valid;
import lk.ijse.gdse66.backend.dto.CustomerDTO;
import lk.ijse.gdse66.backend.dto.ResponseDTO;
import lk.ijse.gdse66.backend.dto.SupplierDTO;
import lk.ijse.gdse66.backend.services.SupplierService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/supplier")
@CrossOrigin(origins = "*")
public class SupplierController {

    private SupplierService supplierService;
    private ResponseDTO responseDTO;

    public SupplierController(SupplierService supplierService, ResponseDTO responseDTO) {
        this.supplierService = supplierService;
        this.responseDTO = responseDTO;
    }

    @GetMapping("/getlastid")
    public String getLastId(){
        return supplierService.getLastId();
    }

    @PostMapping("/save")
    @ResponseStatus(HttpStatus.CREATED)
    public void save(@RequestBody SupplierDTO supplierDTO){
        supplierService.saveSupplier(supplierDTO);
    }

    @GetMapping("/getall")
    public ResponseEntity<ResponseDTO> getAllSuppliers(){
        try{
            List<SupplierDTO> supplierList = supplierService.getAllSuppliers();

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

    @PatchMapping("/update")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateCustomer(@Valid @RequestBody SupplierDTO supplierDTO){
        supplierService.updateSupplier(supplierDTO);
    }

    @DeleteMapping("/delete/{code}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCustomer(@PathVariable String code){
        supplierService.deleteSupplier(code);
    }

    @GetMapping("/search/{prefix}")
    public ResponseEntity<ResponseDTO> searchSuppliersByName(@PathVariable String prefix){
        try{
            List<SupplierDTO> supplierList = supplierService.searchSuppliersByName(prefix);

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

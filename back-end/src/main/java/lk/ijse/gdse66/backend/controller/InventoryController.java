package lk.ijse.gdse66.backend.controller;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Valid;
import jakarta.validation.ValidationException;
import jakarta.validation.Validator;
import lk.ijse.gdse66.backend.dto.*;
import lk.ijse.gdse66.backend.entity.Inventory;
import lk.ijse.gdse66.backend.services.InventoryService;
import lk.ijse.gdse66.backend.util.AccessRoleEnum;
import lk.ijse.gdse66.backend.util.GenderEnum;
import org.apache.tomcat.util.json.JSONFilter;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.Date;
import java.util.Base64;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/inventory")
@CrossOrigin(origins = "*")
public class InventoryController {

    private InventoryService inventoryService;
    private ResponseDTO responseDTO;
    private Validator validator;

    public InventoryController(InventoryService inventoryService, ResponseDTO responseDTO, Validator validator) {
        this.inventoryService = inventoryService;
        this.responseDTO = responseDTO;
        this.validator = validator;
    }

    @GetMapping("/getlastid/{prefix}")
    public String getLastId(@PathVariable String prefix){
        System.out.println(prefix);
        return inventoryService.getLastId(prefix);
    }

    @GetMapping("/getSupplierCodes")
    public List<String> getSupplierCodes(){
        System.out.println("getSupplierCodes");
        return inventoryService.getSupplierCodes();
    }

    @GetMapping("/getSupplierName/{supp_code}")
    public String getSupplierName(@PathVariable String supp_code){
        System.out.println(supp_code);
        return inventoryService.getSupplierName(supp_code);
    }

    @PostMapping(value = "/save")
    @ResponseStatus(HttpStatus.CREATED)
    public void save(@Valid @RequestBody InventoryDTO inventoryDTO){
        inventoryService.saveItem(inventoryDTO);
    }

    @PatchMapping(value = "/update")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void update(@Valid @RequestBody InventoryDTO inventoryDTO){
        System.out.println(inventoryDTO);
        inventoryService.updateItem(inventoryDTO);
    }

    @DeleteMapping("/delete/{code}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteItem(@PathVariable String code){
        inventoryService.deleteItem(code);
    }

    @GetMapping("/getall")
    public ResponseEntity<ResponseDTO> getAllItems(){
        try{
            List<InventoryDTO> itemList = inventoryService.getAllItems();

            responseDTO.setCode(HttpStatus.OK);
            responseDTO.setMessage("Success");
            responseDTO.setData(itemList);
            return new ResponseEntity<>(responseDTO, HttpStatus.OK);
        }catch (Exception exc){
            responseDTO.setCode(HttpStatus.INTERNAL_SERVER_ERROR);
            responseDTO.setMessage(exc.getMessage());
            responseDTO.setData(exc);
            return new ResponseEntity<>(responseDTO, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/search/{prefix}")
    public ResponseEntity<ResponseDTO> searchItemsByName(@PathVariable String prefix){
        try{
            List<InventoryDTO> itemList = inventoryService.searchByName(prefix);

            responseDTO.setCode(HttpStatus.OK);
            responseDTO.setMessage("Success");
            responseDTO.setData(itemList);
            return new ResponseEntity<>(responseDTO, HttpStatus.OK);
        }catch (Exception exc){
            responseDTO.setCode(HttpStatus.INTERNAL_SERVER_ERROR);
            responseDTO.setMessage(exc.getMessage());
            responseDTO.setData(exc);
            return new ResponseEntity<>(responseDTO, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

package lk.ijse.gdse66.backend.controller;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ValidationException;
import jakarta.validation.Validator;
import lk.ijse.gdse66.backend.dto.EmployeeDTO;
import lk.ijse.gdse66.backend.dto.InventoryDTO;
import lk.ijse.gdse66.backend.dto.InventoryPlusQtyDTO;
import lk.ijse.gdse66.backend.dto.ResponseDTO;
import lk.ijse.gdse66.backend.entity.Inventory;
import lk.ijse.gdse66.backend.services.InventoryService;
import lk.ijse.gdse66.backend.util.AccessRoleEnum;
import lk.ijse.gdse66.backend.util.GenderEnum;
import org.apache.tomcat.util.json.JSONFilter;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
    public void save(@RequestBody InventoryDTO inventoryDTO /*@RequestParam("item_code") String item_code, @RequestParam("item_name") String item_name,
                     @RequestParam("item_picture") String item_pic, @RequestParam("category") String category,
                     @RequestParam("size") int size, @RequestParam("supplier_code") String supp_code,
                     @RequestParam("supplier_name") String supp_name, @RequestParam("price_sale") Double price_sale,
                     @RequestParam("price_buy") Double price_buy, @RequestParam("expected_profit") Double profit,
                     @RequestParam("profit_margin") Double profit_margin, @RequestParam("status") String status,
                     @RequestParam("qty") int qty*/){

        System.out.println(inventoryDTO);
        inventoryService.saveItem(inventoryDTO);

    }

}

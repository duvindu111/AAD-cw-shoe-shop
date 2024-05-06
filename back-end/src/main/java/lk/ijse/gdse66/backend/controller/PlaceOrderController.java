package lk.ijse.gdse66.backend.controller;

import jakarta.validation.Validator;
import lk.ijse.gdse66.backend.dto.CustomerDTO;
import lk.ijse.gdse66.backend.dto.InventoryDTO;
import lk.ijse.gdse66.backend.dto.ResponseDTO;
import lk.ijse.gdse66.backend.services.InventoryService;
import lk.ijse.gdse66.backend.services.PlaceOrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/place_order")
@CrossOrigin(origins = "*")
public class PlaceOrderController {

    private PlaceOrderService placeOrderService;
    private ResponseDTO responseDTO;

    public PlaceOrderController(PlaceOrderService placeOrderService, ResponseDTO responseDTO) {
        this.placeOrderService = placeOrderService;
        this.responseDTO = responseDTO;
    }

    @GetMapping("/getItemCodes")
    public ResponseEntity<ResponseDTO> getItemCodes(){
        System.out.println("getItemCodes");
        try{
            List<String> itemCodeList = placeOrderService.getAllItemCodes();

            responseDTO.setCode(HttpStatus.OK);
            responseDTO.setMessage("Success");
            responseDTO.setData(itemCodeList);
            return new ResponseEntity<>(responseDTO, HttpStatus.OK);
        }catch (Exception exc){
            responseDTO.setCode(HttpStatus.INTERNAL_SERVER_ERROR);
            responseDTO.setMessage(exc.getMessage());
            responseDTO.setData(exc);
            return new ResponseEntity<>(responseDTO, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getItemByCode/{item_code}")
    public ResponseEntity<ResponseDTO> getItemCodes(@PathVariable String item_code){
        System.out.println("item_code");
        try{
            InventoryDTO item = placeOrderService.getItemByCode(item_code);

            responseDTO.setCode(HttpStatus.OK);
            responseDTO.setMessage("Success");
            responseDTO.setData(item);
            return new ResponseEntity<>(responseDTO, HttpStatus.OK);
        }catch (Exception exc){
            responseDTO.setCode(HttpStatus.INTERNAL_SERVER_ERROR);
            responseDTO.setMessage(exc.getMessage());
            responseDTO.setData(exc);
            return new ResponseEntity<>(responseDTO, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getSizesByItemCode/{item_code}")
    public ResponseEntity<ResponseDTO> getSizesByItemCode(@PathVariable String item_code){
        System.out.println("item_code");
        try{
            List<Integer> itemSizes = placeOrderService.getItemSizesByCode(item_code);

            responseDTO.setCode(HttpStatus.OK);
            responseDTO.setMessage("Success");
            responseDTO.setData(itemSizes);
            return new ResponseEntity<>(responseDTO, HttpStatus.OK);
        }catch (Exception exc){
            responseDTO.setCode(HttpStatus.INTERNAL_SERVER_ERROR);
            responseDTO.setMessage(exc.getMessage());
            responseDTO.setData(exc);
            return new ResponseEntity<>(responseDTO, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getQtyByItemCodeAndSize/{item_code}/{size}")
    public int getQtyByItemCodeAndSize(@PathVariable String item_code, @PathVariable int size){
        System.out.println(item_code + " " + size);

        Integer qty = placeOrderService.getQtyByItemCodeAndSize(item_code, size);
        return qty;
    }

    @GetMapping("/getCustomerCodes")
    public ResponseEntity<ResponseDTO> getCustomerCodes(){
        try{
            List<String> customerCodeList = placeOrderService.getAllCustomerCodes();

            responseDTO.setCode(HttpStatus.OK);
            responseDTO.setMessage("Success");
            responseDTO.setData(customerCodeList);
            return new ResponseEntity<>(responseDTO, HttpStatus.OK);
        }catch (Exception exc){
            responseDTO.setCode(HttpStatus.INTERNAL_SERVER_ERROR);
            responseDTO.setMessage(exc.getMessage());
            responseDTO.setData(exc);
            return new ResponseEntity<>(responseDTO, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getCustomerByCode/{cust_code}")
    public ResponseEntity<ResponseDTO> getCustomerCodes(@PathVariable String cust_code){
        System.out.println("cust_code");
        try{
            CustomerDTO customer = placeOrderService.getCustomerByCode(cust_code);

            responseDTO.setCode(HttpStatus.OK);
            responseDTO.setMessage("Success");
            responseDTO.setData(customer);
            return new ResponseEntity<>(responseDTO, HttpStatus.OK);
        }catch (Exception exc){
            responseDTO.setCode(HttpStatus.INTERNAL_SERVER_ERROR);
            responseDTO.setMessage(exc.getMessage());
            responseDTO.setData(exc);
            return new ResponseEntity<>(responseDTO, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}

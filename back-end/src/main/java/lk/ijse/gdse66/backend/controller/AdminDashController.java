package lk.ijse.gdse66.backend.controller;

import lk.ijse.gdse66.backend.dto.*;
import lk.ijse.gdse66.backend.services.AdminDashService;
import lk.ijse.gdse66.backend.services.CustomerService;
import lk.ijse.gdse66.backend.services.EmployeeService;
import lk.ijse.gdse66.backend.services.SupplierService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin_dash")
@CrossOrigin(origins = "*")
public class AdminDashController {

    private CustomerService customerService;
    private EmployeeService employeeService;
    private SupplierService supplierService;
    private AdminDashService adminDashService;
    private ResponseDTO responseDTO;

    public AdminDashController(CustomerService customerService, EmployeeService employeeService,
                               SupplierService supplierService, AdminDashService adminDashService,
                               ResponseDTO responseDTO) {
        this.customerService = customerService;
        this.employeeService = employeeService;
        this.supplierService = supplierService;
        this.adminDashService = adminDashService;
        this.responseDTO = responseDTO;
    }

    @GetMapping("/get_all_employees")
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

    @GetMapping("/get_all_suppliers")
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

    @GetMapping("/get_customer_count")
    public long getCustomerCount(){
        return customerService.getCustomerCount();
    }

    @GetMapping("/getOrderDates")
    public List<String> getOrderDates(){
        return adminDashService.getOrderDates();
    }

    @GetMapping("/get_all_orders")
    public ResponseEntity<ResponseDTO> getAllOrders(){
        try{
            List<OrderDTO> orderList = adminDashService.getAllOrders();

            responseDTO.setCode(HttpStatus.OK);
            responseDTO.setMessage("Success");
            responseDTO.setData(orderList);
            return new ResponseEntity<>(responseDTO, HttpStatus.OK);
        }catch (Exception exc){
            responseDTO.setCode(HttpStatus.INTERNAL_SERVER_ERROR);
            responseDTO.setMessage(exc.getMessage());
            responseDTO.setData(exc);
            return new ResponseEntity<>(responseDTO, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/get_orderdetails_with_date/{year}/{month}")
    public ResponseEntity<ResponseDTO> getOrderDetailsWithDate(@PathVariable int year, @PathVariable int month){
        try{
            List<OrderDetailCustomDTO> orderDetailList = adminDashService.getOrderDetailsWithDate(year, month);

            responseDTO.setCode(HttpStatus.OK);
            responseDTO.setMessage("Success");
            responseDTO.setData(orderDetailList);
            return new ResponseEntity<>(responseDTO, HttpStatus.OK);
        }catch (Exception exc){
            responseDTO.setCode(HttpStatus.INTERNAL_SERVER_ERROR);
            responseDTO.setMessage(exc.getMessage());
            responseDTO.setData(exc);
            return new ResponseEntity<>(responseDTO, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/get_picof_most_sold_item")
    public ResponseEntity<ResponseDTO> getPicOfMostSoldItem(){
        try{
            InventoryDTO inventoryDTO = adminDashService.getMostSoldItem();

            responseDTO.setCode(HttpStatus.OK);
            responseDTO.setMessage("Success");
            responseDTO.setData(inventoryDTO);
            return new ResponseEntity<>(responseDTO, HttpStatus.OK);
        }catch (Exception exc){
            responseDTO.setCode(HttpStatus.INTERNAL_SERVER_ERROR);
            responseDTO.setMessage(exc.getMessage());
            responseDTO.setData(exc);
            return new ResponseEntity<>(responseDTO, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}

package lk.ijse.gdse66.backend.controller;

import jakarta.validation.Valid;
import lk.ijse.gdse66.backend.dto.CustomerDTO;
import lk.ijse.gdse66.backend.dto.OrderDTO;
import lk.ijse.gdse66.backend.dto.OrderDetailDTO;
import lk.ijse.gdse66.backend.dto.ResponseDTO;
import lk.ijse.gdse66.backend.services.OrderDetailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orderdetails")
@CrossOrigin(origins = "*")
public class OrderDetailController {

    private OrderDetailService orderDetailService;
    private ResponseDTO responseDTO;

    public OrderDetailController(OrderDetailService orderDetailService, ResponseDTO responseDTO) {
        this.orderDetailService = orderDetailService;
        this.responseDTO = responseDTO;
    }

    @GetMapping("/getall")
    public ResponseEntity<ResponseDTO> getAllOrders(){
        try{
            List<OrderDTO> orderList = orderDetailService.getAllOrders();

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

    @GetMapping("/getOrderDetailsById/{id}")
    public ResponseEntity<ResponseDTO> getAllOrders(@PathVariable String id){
        try{
            List<OrderDetailDTO> orderDetailList = orderDetailService.getOrderDetailsById(id);

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

    @GetMapping("/searchByCode/{prefix}")
    public ResponseEntity<ResponseDTO> searchOrdersByCode(@PathVariable String prefix){
        try{
            List<OrderDTO> orderList = orderDetailService.searchOrdersByCode(prefix);

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

    @PostMapping("/refund")
    @ResponseStatus(HttpStatus.CREATED)
    public void refundCompleteOrder(@Valid @RequestBody OrderDTO orderDTO){
        System.out.println(orderDTO);
        orderDetailService.refund(orderDTO);
    }

    @PostMapping("/refundOne")
    @ResponseStatus(HttpStatus.CREATED)
    public void refundOneItem(@Valid @RequestBody OrderDTO orderDTO){
        System.out.println(orderDTO);
        orderDetailService.refundOneItem(orderDTO);
    }
}

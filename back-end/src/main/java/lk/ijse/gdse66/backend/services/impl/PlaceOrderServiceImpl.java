package lk.ijse.gdse66.backend.services.impl;

import jakarta.transaction.Transactional;
import lk.ijse.gdse66.backend.dto.*;
import lk.ijse.gdse66.backend.embedded.OrderDetailPK;
import lk.ijse.gdse66.backend.entity.*;
import lk.ijse.gdse66.backend.repo.*;
import lk.ijse.gdse66.backend.services.PlaceOrderService;
import lk.ijse.gdse66.backend.util.LoyaltyLevelEnum;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Transactional
@Service
public class PlaceOrderServiceImpl implements PlaceOrderService {

    private final EmployeeRepo employeeRepo;
    private final OrderDetailRepo orderDetailRepo;
    private CustomerRepo customerRepo;
    private InventoryRepo inventoryRepo;
    private ShoeSizeRepo shoeSizeRepo;
    private OrderRepo orderRepo;
    private ModelMapper mapper;

    public PlaceOrderServiceImpl(CustomerRepo customerRepo, InventoryRepo inventoryRepo, ShoeSizeRepo shoeSizeRepo, OrderRepo orderRepo, ModelMapper mapper, EmployeeRepo employeeRepo, OrderDetailRepo orderDetailRepo) {
        this.customerRepo = customerRepo;
        this.inventoryRepo = inventoryRepo;
        this.shoeSizeRepo = shoeSizeRepo;
        this.orderRepo = orderRepo;
        this.mapper = mapper;
        this.employeeRepo = employeeRepo;
        this.orderDetailRepo = orderDetailRepo;
    }

    @Override
    public List<String> getAllItemCodes() {
        List<String> itemCodeList = inventoryRepo.getItemCodes();
        return itemCodeList;
    }

    @Override
    public InventoryDTO getItemByCode(String item_code) {
        Inventory inventory = inventoryRepo.findAllByItemCode(item_code);
        InventoryDTO inventoryDTO = mapper.map(inventory, InventoryDTO.class);

        List<ShoeSize> shoeSizes = shoeSizeRepo.getAllByItemCode(inventoryDTO.getItemCode());
        List<ShoeSizeDTO> shoeSizeDTOList = new ArrayList<>();

        for (ShoeSize shoeSize : shoeSizes) {
            ShoeSizeDTO shoeSizeDTO = new ShoeSizeDTO();
            shoeSizeDTO.setSize(shoeSize.getSize());
            shoeSizeDTO.setQuantity(shoeSize.getQuantity());
            shoeSizeDTO.setStatus(shoeSize.getStatus());
            shoeSizeDTOList.add(shoeSizeDTO);
        }
        inventoryDTO.setShoe_size_list(shoeSizeDTOList);

        return inventoryDTO;
    }

    @Override
    public List<Integer> getItemSizesByCode(String itemCode) {
        List<Integer> sizes = shoeSizeRepo.findSizesByItemCodeAndStatus(itemCode, "Not Available");
        return sizes;
    }

    @Override
    public Integer getQtyByItemCodeAndSize(String itemCode, int size) {
        return shoeSizeRepo.findQtyByItemCodeAndSize(itemCode, size);
    }

    @Override
    public List<String> getAllCustomerCodes() {
        List<String> customerCodeList = customerRepo.getCustomerCodes();
        return customerCodeList;
    }

    @Override
    public CustomerDTO getCustomerByCode(String custCode) {
        Customer customer = customerRepo.findAllByCode(custCode);
        return mapper.map(customer, CustomerDTO.class);
    }

    @Override
    public String getLastId() {
        Order lastOrder = orderRepo.findTopByOrderByOrderIdDesc();

        if (lastOrder == null) {
            return "";
        }else{
            return lastOrder.getOrderId();
        }
    }

    @Override
    public void placeOrder(OrderDTO orderDTO) {
        //1st process - saving to orders table
        Order order = mapper.map(orderDTO, Order.class);

        System.out.println(orderDTO.getCustomer());
        System.out.println(orderDTO.getEmployee());
        System.out.println(order.getCustomer());
        System.out.println(order.getEmployee());

        if(orderDTO.getCustomer() == null || orderDTO.getCustomer() == ""){
            order.setCustomer(null);
        }else{
            Customer customer = customerRepo.findByCode(orderDTO.getCustomer());
            order.setCustomer(customer);

            //3rd process - updating customer loyalty points and level
            int currentPoints = customer.getLoyaltyPoints();
            int addedPoints = orderDTO.getAddedPoints();
            if(orderDTO.getTotalPrice() >= 800){
                addedPoints -= 1;
            }
            int newPoints = currentPoints - addedPoints;
            LoyaltyLevelEnum loyalty_level = null;
            if(newPoints < 50){
                loyalty_level = LoyaltyLevelEnum.NEW;
            }else if(newPoints >= 50 && newPoints < 100){
                loyalty_level = LoyaltyLevelEnum.BRONZE;
            }else if(newPoints >= 100 && newPoints < 200){
                loyalty_level = LoyaltyLevelEnum.SILVER;
            }else if(newPoints >= 200){
                loyalty_level = LoyaltyLevelEnum.GOLD;
            }
            customer.setLoyaltyPoints(newPoints);
            customer.setLoyaltyLevel(loyalty_level);
            customer.setRecentPurchaseDate(orderDTO.getOrderDate());
            customerRepo.save(customer);
        }

        Employee employee = employeeRepo.findByCode(orderDTO.getEmployee());
        order.setEmployee(employee);

        orderRepo.save(order);

        //2nd process - saving to order_detail table & updating inventory table
        List<OrderDetailDTO> orderDetails = orderDTO.getOrderDetailList();
        for (OrderDetailDTO detail : orderDetails) {
            OrderDetail orderDetail = new OrderDetail();
            OrderDetailPK orderDetailPK = new OrderDetailPK(detail.getOrderId(), detail.getItemCode(), detail.getSize());
            orderDetail.setOrderDetailPK(orderDetailPK);
            orderDetail.setItemName(detail.getItemName());
            orderDetail.setUnitPrice(detail.getUnitPrice());
            orderDetail.setQty(detail.getQty());

            orderDetailRepo.save(orderDetail);
            //----------------------------------------------

            int availableQty = shoeSizeRepo.findQtyByItemCodeAndSize(detail.getItemCode(), detail.getSize());
            int newQty = availableQty - detail.getQty();

            String status;
            if(newQty <= 0) {
                status = "Not Available";
            }else if(newQty<10){
                status = "Low";
            }else{
                status = "Available";
            }

            shoeSizeRepo.updateByItemCodeAndSize(newQty, status, detail.getItemCode(), detail.getSize());
        }
    }
}

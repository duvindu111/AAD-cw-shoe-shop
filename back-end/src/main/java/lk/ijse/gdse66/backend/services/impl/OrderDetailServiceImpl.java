package lk.ijse.gdse66.backend.services.impl;

import jakarta.transaction.Transactional;
import lk.ijse.gdse66.backend.dto.CustomerDTO;
import lk.ijse.gdse66.backend.dto.OrderDTO;
import lk.ijse.gdse66.backend.dto.OrderDetailDTO;
import lk.ijse.gdse66.backend.entity.Customer;
import lk.ijse.gdse66.backend.entity.Order;
import lk.ijse.gdse66.backend.entity.OrderDetail;
import lk.ijse.gdse66.backend.repo.CustomerRepo;
import lk.ijse.gdse66.backend.repo.OrderDetailRepo;
import lk.ijse.gdse66.backend.repo.OrderRepo;
import lk.ijse.gdse66.backend.repo.ShoeSizeRepo;
import lk.ijse.gdse66.backend.services.OrderDetailService;
import lk.ijse.gdse66.backend.util.LoyaltyLevelEnum;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderDetailServiceImpl implements OrderDetailService {

    private final ShoeSizeRepo shoeSizeRepo;
    private final OrderDetailRepo orderDetailRepo;
    private final CustomerRepo customerRepo;
    private OrderRepo orderRepo;
    private ModelMapper mapper;

    public OrderDetailServiceImpl(OrderRepo orderRepo, ModelMapper mapper, ShoeSizeRepo shoeSizeRepo, OrderDetailRepo orderDetailRepo, CustomerRepo customerRepo) {
        this.orderRepo = orderRepo;
        this.mapper = mapper;

        this.mapper.addMappings(new PropertyMap<Order, OrderDTO>() {
            @Override
            protected void configure() {
                map().setCustomer(source.getCustomer().getCode());
                map().setCustomerName(source.getCustomerName());
            }
        });

        this.mapper.addMappings(new PropertyMap<Order, OrderDTO>() {
            @Override
            protected void configure() {
                map().setEmployee(source.getEmployee().getCode());
            }
        });
        this.shoeSizeRepo = shoeSizeRepo;
        this.orderDetailRepo = orderDetailRepo;
        this.customerRepo = customerRepo;
    }

    @Override
    public List<OrderDTO> getAllOrders() {
        return orderRepo.findAll().stream().map(order -> mapper.map(order, OrderDTO.class)).toList();
    }

    @Override
    public List<OrderDetailDTO> getOrderDetailsById(String id) {
        List<OrderDetail> orderDetailList = orderDetailRepo.findAllByOrderDetailPK_OrderId(id);
        List<OrderDetailDTO> orderDetailDTOList = orderDetailList.stream().map(orderDetail -> {
            OrderDetailDTO dto = mapper.map(orderDetail, OrderDetailDTO.class);
            dto.setItemCode(orderDetail.getOrderDetailPK().getItemCode());
            dto.setSize(orderDetail.getOrderDetailPK().getSize());
            return dto;
        }).collect(Collectors.toList());
        return orderDetailDTOList;
    }

    @Override
    public List<OrderDTO> searchOrdersByCode(String prefix) {
        return orderRepo.findAllByOrderIdStartingWith(prefix).stream().map(order ->
                mapper.map(order, OrderDTO.class)).toList();

    }

    @Override
    public void refund(OrderDTO orderDTO) {
        orderDetailRepo.deleteByOrderDetailPK_OrderId(orderDTO.getOrderId());
        orderRepo.deleteById(orderDTO.getOrderId());

        List<OrderDetailDTO> itemList = orderDTO.getOrderDetailList();
        for (OrderDetailDTO dto : itemList) {
            int availableQty = shoeSizeRepo.findQtyByItemCodeAndSize(dto.getItemCode(), dto.getSize());
            int newQty = availableQty + dto.getQty();

            String status;
            if (newQty <= 0) {
                status = "Not Available";
            } else if (newQty < 10) {
                status = "Low";
            } else {
                status = "Available";
            }
            shoeSizeRepo.updateByItemCodeAndSize(newQty, status, dto.getItemCode(), dto.getSize());
        }

        System.out.println(orderDTO.getCustomer());
        if(orderDTO.getCustomer() == null || orderDTO.getCustomer() == "" || orderDTO.getCustomer().equals("null")){
            System.out.println("Customer is null");
        }else {
            double total_price = orderDTO.getTotalPrice();
            int points_tobe_added = orderDTO.getAddedPoints();

            if (total_price >= 800) {
                points_tobe_added -= 1;
            }
            Customer customer = customerRepo.findByCode(orderDTO.getCustomer());
            int currentPoints = customer.getLoyaltyPoints();
            int newPoints = currentPoints + points_tobe_added;

            LoyaltyLevelEnum loyalty_level = null;
            if (newPoints < 50) {
                loyalty_level = LoyaltyLevelEnum.NEW;
            } else if (newPoints >= 50 && newPoints < 100) {
                loyalty_level = LoyaltyLevelEnum.BRONZE;
            } else if (newPoints >= 100 && newPoints < 200) {
                loyalty_level = LoyaltyLevelEnum.SILVER;
            } else if (newPoints >= 200) {
                loyalty_level = LoyaltyLevelEnum.GOLD;
            }
            customer.setLoyaltyPoints(newPoints);
            customer.setLoyaltyLevel(loyalty_level);
            customerRepo.save(customer);
        }
    }
}

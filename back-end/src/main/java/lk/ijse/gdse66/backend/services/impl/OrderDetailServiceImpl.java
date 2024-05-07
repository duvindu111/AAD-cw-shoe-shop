package lk.ijse.gdse66.backend.services.impl;

import lk.ijse.gdse66.backend.dto.OrderDTO;
import lk.ijse.gdse66.backend.entity.Order;
import lk.ijse.gdse66.backend.repo.OrderRepo;
import lk.ijse.gdse66.backend.services.OrderDetailService;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderDetailServiceImpl implements OrderDetailService {

    private OrderRepo orderRepo;
    private ModelMapper mapper;

    public OrderDetailServiceImpl(OrderRepo orderRepo, ModelMapper mapper) {
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
    }

    @Override
    public List<OrderDTO> getAllOrders() {
        return orderRepo.findAll().stream().map(order -> mapper.map(order, OrderDTO.class)).toList();
    }
}

package lk.ijse.gdse66.backend.services.impl;

import lk.ijse.gdse66.backend.dto.OrderDTO;
import lk.ijse.gdse66.backend.dto.OrderDetailDTO;
import lk.ijse.gdse66.backend.entity.Order;
import lk.ijse.gdse66.backend.entity.OrderDetail;
import lk.ijse.gdse66.backend.repo.OrderDetailRepo;
import lk.ijse.gdse66.backend.repo.OrderRepo;
import lk.ijse.gdse66.backend.repo.ShoeSizeRepo;
import lk.ijse.gdse66.backend.services.OrderDetailService;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderDetailServiceImpl implements OrderDetailService {

    private final ShoeSizeRepo shoeSizeRepo;
    private final OrderDetailRepo orderDetailRepo;
    private OrderRepo orderRepo;
    private ModelMapper mapper;

    public OrderDetailServiceImpl(OrderRepo orderRepo, ModelMapper mapper, ShoeSizeRepo shoeSizeRepo, OrderDetailRepo orderDetailRepo) {
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
}

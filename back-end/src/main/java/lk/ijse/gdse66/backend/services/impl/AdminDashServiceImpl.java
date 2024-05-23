package lk.ijse.gdse66.backend.services.impl;

import jakarta.transaction.Transactional;
import lk.ijse.gdse66.backend.dto.InventoryDTO;
import lk.ijse.gdse66.backend.dto.OrderDTO;
import lk.ijse.gdse66.backend.dto.OrderDetailCustomDTO;
import lk.ijse.gdse66.backend.repo.InventoryRepo;
import lk.ijse.gdse66.backend.repo.OrderDetailRepo;
import lk.ijse.gdse66.backend.repo.OrderRepo;
import lk.ijse.gdse66.backend.services.AdminDashService;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class AdminDashServiceImpl implements AdminDashService {

//    private static final Logger log = LoggerFactory.getLogger(AdminDashServiceImpl.class);
    private final InventoryRepo inventoryRepo;
    private OrderRepo orderRepo;
    private OrderDetailRepo orderDetailRepo;
    private ModelMapper mapper;

    public AdminDashServiceImpl(OrderRepo orderRepo, OrderDetailRepo orderDetailRepo, ModelMapper mapper, InventoryRepo inventoryRepo) {
        this.orderRepo = orderRepo;
        this.orderDetailRepo = orderDetailRepo;
        this.mapper = mapper;
        this.inventoryRepo = inventoryRepo;
    }

    @Override
    public List<String> getOrderDates(){
        return orderRepo.getDistinctOrderDates();
    }

    @Override
    public List<OrderDTO> getAllOrders() {
        return orderRepo.findAll().stream().map(order -> mapper.map(order, OrderDTO.class)).toList();
    }

    @Override
    public List<OrderDetailCustomDTO> getOrderDetailsWithDate(int year, int month) {
        List<OrderDetailCustomDTO> orderDetailCustomDTOS = orderRepo.findOrderDetailsWithDate(year, month).stream().map(orderDetailByYMProjection -> mapper.map(orderDetailByYMProjection, OrderDetailCustomDTO.class)).toList();
        return orderDetailCustomDTOS;
    }

    @Override
    public InventoryDTO getMostSoldItem() {
        String itemCode = orderDetailRepo.findMostSoldItemCode();
        System.out.println(itemCode);

        InventoryDTO inventoryDTO = mapper.map(inventoryRepo.findById(itemCode).get(), InventoryDTO.class);
        System.out.println(inventoryDTO);
        return inventoryDTO;
    }
}

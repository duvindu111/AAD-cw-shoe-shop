package lk.ijse.gdse66.backend.services;

import lk.ijse.gdse66.backend.dto.OrderDTO;

import java.util.List;

public interface OrderDetailService {
    List<OrderDTO> getAllOrders();
}

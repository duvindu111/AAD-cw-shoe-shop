package lk.ijse.gdse66.backend.services;

import lk.ijse.gdse66.backend.dto.OrderDTO;
import lk.ijse.gdse66.backend.dto.OrderDetailDTO;

import java.util.List;

public interface OrderDetailService {
    List<OrderDTO> getAllOrders();

    List<OrderDetailDTO> getOrderDetailsById(String id);
}

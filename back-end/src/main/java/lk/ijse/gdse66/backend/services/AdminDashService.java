package lk.ijse.gdse66.backend.services;

import lk.ijse.gdse66.backend.dto.InventoryDTO;
import lk.ijse.gdse66.backend.dto.OrderDTO;
import lk.ijse.gdse66.backend.dto.OrderDetailCustomDTO;

import java.util.List;

public interface AdminDashService {

    public List<String> getOrderDates();

    List<OrderDTO> getAllOrders();

    List<OrderDetailCustomDTO> getOrderDetailsWithDate(int year, int month);

    InventoryDTO getMostSoldItem();
}

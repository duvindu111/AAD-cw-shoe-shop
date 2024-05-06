package lk.ijse.gdse66.backend.services;

import lk.ijse.gdse66.backend.dto.CustomerDTO;
import lk.ijse.gdse66.backend.dto.InventoryDTO;
import lk.ijse.gdse66.backend.dto.OrderDTO;

import java.util.List;

public interface PlaceOrderService {

    List<String> getAllItemCodes();

    InventoryDTO getItemByCode(String item_code);

    List<Integer> getItemSizesByCode(String itemCode);

    Integer getQtyByItemCodeAndSize(String itemCode, int size);

    List<String> getAllCustomerCodes();

    CustomerDTO getCustomerByCode(String custCode);

    String getLastId();

    void placeOrder(OrderDTO orderDTO);
}

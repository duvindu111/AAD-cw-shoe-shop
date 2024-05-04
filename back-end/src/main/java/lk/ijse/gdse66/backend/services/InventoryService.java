package lk.ijse.gdse66.backend.services;

import lk.ijse.gdse66.backend.dto.InventoryDTO;
import lk.ijse.gdse66.backend.dto.InventoryPlusQtyDTO;

import java.util.List;

public interface InventoryService {

    void saveItem(InventoryPlusQtyDTO inventoryDTO);

    void updateItem(InventoryDTO inventoryDTO);

    boolean deleteItem(String id);

    List<InventoryDTO> getAllItems();

    String getLastId(String prefix);

    List<String> getSupplierCodes();

    String getSupplierName(String supp_code);
}

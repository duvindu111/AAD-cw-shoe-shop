package lk.ijse.gdse66.backend.services;

import lk.ijse.gdse66.backend.dto.InventoryDTO;

import java.util.List;

public interface InventoryService {

    void saveItem(InventoryDTO inventoryDTO);

    void updateItem(InventoryDTO inventoryDTO);

    void deleteItem(String id);

    List<InventoryDTO> getAllItems();

    String getLastId(String prefix);

    List<String> getSupplierCodes();

    String getSupplierName(String supp_code);

    List<InventoryDTO> searchByName(String codePrefix);

    List<InventoryDTO> getAllItemsByPrice(double minPrice, double maxPrice);

    List<InventoryDTO> getAllItemsByGender(String value);
}

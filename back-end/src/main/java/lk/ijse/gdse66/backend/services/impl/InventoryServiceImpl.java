package lk.ijse.gdse66.backend.services.impl;

import jakarta.transaction.Transactional;
import lk.ijse.gdse66.backend.dto.InventoryDTO;
import lk.ijse.gdse66.backend.dto.InventoryPlusQtyDTO;
import lk.ijse.gdse66.backend.entity.Inventory;
import lk.ijse.gdse66.backend.entity.ShoeSize;
import lk.ijse.gdse66.backend.entity.Supplier;
import lk.ijse.gdse66.backend.repo.InventoryRepo;
import lk.ijse.gdse66.backend.repo.ShoeSizeRepo;
import lk.ijse.gdse66.backend.repo.SupplierRepo;
import lk.ijse.gdse66.backend.services.InventoryService;
import lk.ijse.gdse66.backend.services.exceptions.DuplicateRecordException;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class InventoryServiceImpl implements InventoryService {

    private SupplierRepo supplierRepo;
    private InventoryRepo inventoryRepo;
    private ShoeSizeRepo shoeSizeRepo;
    private ModelMapper mapper;

    public InventoryServiceImpl(SupplierRepo supplierRepo, InventoryRepo inventoryRepo, ShoeSizeRepo shoeSizeRepo, ModelMapper mapper) {
        this.supplierRepo = supplierRepo;
        this.inventoryRepo = inventoryRepo;
        this.shoeSizeRepo = shoeSizeRepo;
        this.mapper = mapper;
    }

    @Override
    public void saveItem(InventoryPlusQtyDTO inventoryPlusQtyDTO) {
        if(inventoryRepo.existsById(inventoryPlusQtyDTO.getItem_code())){
            throw new DuplicateRecordException("Item with id " + inventoryPlusQtyDTO.getItem_code() + " already exists");
        }else{

            Supplier supplier = supplierRepo.findByCode(inventoryPlusQtyDTO.getSupplier_code());

//            InventoryDTO inventoryDTO = new InventoryDTO(
//                    inventoryPlusQtyDTO.getItem_code(),
//                    inventoryPlusQtyDTO.getItem_name(),
//                    inventoryPlusQtyDTO.getItem_picture(),
//                    inventoryPlusQtyDTO.getCategory(),
//                    inventoryPlusQtyDTO.getSize(),
//                    inventoryPlusQtyDTO.getSupplier_code(),
//                    inventoryPlusQtyDTO.getSupplier_name(),
//                    inventoryPlusQtyDTO.getPrice_sale(),
//                    inventoryPlusQtyDTO.getPrice_buy(),
//                    inventoryPlusQtyDTO.getExpected_profit(),
//                    inventoryPlusQtyDTO.getProfit_margin(),
//                    inventoryPlusQtyDTO.getStatus()
//            );

            Inventory inventory = mapper.map(inventoryPlusQtyDTO, Inventory.class);
            inventory.setSupplier_code(supplier);
            inventoryRepo.save(inventory);

            ShoeSize shoeSize = new ShoeSize();
            shoeSize.setItem_code(inventory);
            shoeSize.setSize(inventoryPlusQtyDTO.getSize());
            shoeSize.setQuantity(inventoryPlusQtyDTO.getQty());
            shoeSizeRepo.save(shoeSize);
        }
    }

    @Override
    public void updateItem(InventoryDTO inventoryDTO) {

    }

    @Override
    public boolean deleteItem(String id) {
        return false;
    }

    @Override
    public List<InventoryDTO> getAllItems() {
        return List.of();
    }

    @Override
    public String getLastId(String prefix) {
        Inventory lastItem = inventoryRepo.getLastItemCode(prefix);
        System.out.println(lastItem);

        if (lastItem == null) {
            return "";
        }else{
            return lastItem.getItem_code();
        }
    }

    @Override
    public List<String> getSupplierCodes() {
        return supplierRepo.findSupplierCodes();
    }

    @Override
    public String getSupplierName(String supp_code) {
        return supplierRepo.findNameByCode(supp_code);
    }
}

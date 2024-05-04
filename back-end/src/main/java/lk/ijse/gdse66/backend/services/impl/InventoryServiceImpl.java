package lk.ijse.gdse66.backend.services.impl;

import jakarta.transaction.Transactional;
import lk.ijse.gdse66.backend.dto.CustomerDTO;
import lk.ijse.gdse66.backend.dto.InventoryDTO;
import lk.ijse.gdse66.backend.dto.InventoryPlusQtyDTO;
import lk.ijse.gdse66.backend.dto.ShoeSizeDTO;
import lk.ijse.gdse66.backend.entity.Inventory;
import lk.ijse.gdse66.backend.entity.ShoeSize;
import lk.ijse.gdse66.backend.entity.Supplier;
import lk.ijse.gdse66.backend.repo.InventoryRepo;
import lk.ijse.gdse66.backend.repo.ShoeSizeRepo;
import lk.ijse.gdse66.backend.repo.SupplierRepo;
import lk.ijse.gdse66.backend.services.InventoryService;
import lk.ijse.gdse66.backend.services.exceptions.DuplicateRecordException;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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
    public void saveItem(InventoryDTO inventoryDTO) {
        if(inventoryRepo.existsById(inventoryDTO.getItemCode())){
            throw new DuplicateRecordException("Item with id " + inventoryDTO.getItemCode() + " already exists");
        }else{
            Supplier supplier = supplierRepo.findByCode(inventoryDTO.getSupplierCode());

            Inventory inventory = mapper.map(inventoryDTO, Inventory.class);
            inventory.setSupplierCode(supplier);
            inventoryRepo.save(inventory);

            for (ShoeSizeDTO dto : inventoryDTO.getShoe_size_list()) {
                ShoeSize shoeSize = new ShoeSize();
                shoeSize.setItemCode(inventory);
                shoeSize.setSize(dto.getSize());
                shoeSize.setQuantity(dto.getQuantity());
                shoeSize.setStatus(dto.getStatus());
                shoeSizeRepo.save(shoeSize);
            }
        }
    }

    @Override
    public void updateItem(InventoryDTO inventoryDTO) {
        if(!inventoryRepo.existsById(inventoryDTO.getItemCode())){
            throw new DuplicateRecordException("No such item to update | item Id: " + inventoryDTO.getItemCode());
        }else{
            Supplier supplier = supplierRepo.findByCode(inventoryDTO.getSupplierCode());

            Inventory inventory = mapper.map(inventoryDTO, Inventory.class);
            inventory.setSupplierCode(supplier);
            inventoryRepo.save(inventory);

            for (ShoeSizeDTO dto : inventoryDTO.getShoe_size_list()) {
                if(!shoeSizeRepo.existsByItemCodeAndSize(inventory, dto.getSize())){
                    ShoeSize shoeSize = new ShoeSize();
                    shoeSize.setItemCode(inventory);
                    shoeSize.setSize(dto.getSize());
                    shoeSize.setQuantity(dto.getQuantity());
                    shoeSize.setStatus(dto.getStatus());
                    shoeSizeRepo.save(shoeSize);
                }else{
                    shoeSizeRepo.updateByItemCodeAndSize(dto.getQuantity(), dto.getStatus(),
                            inventory.getItemCode(), dto.getSize());
                }
            }
        }
    }

    @Override
    public void deleteItem(String id) {
        shoeSizeRepo.deleteByItemCode(id);
        inventoryRepo.deleteById(id);
    }

    @Override
    public List<InventoryDTO> getAllItems() {
        List<Inventory> inventoryList = inventoryRepo.findAll();
        List<InventoryDTO> inventoryDTOList = inventoryList.stream().map(inventory -> {
            InventoryDTO dto = mapper.map(inventory, InventoryDTO.class);
            dto.setSupplierCode(inventory.getSupplierCode().getCode());
            return dto;
         }).collect(Collectors.toList());

        for (InventoryDTO dto : inventoryDTOList) {
            List<ShoeSize> shoeSizes = shoeSizeRepo.getAllByItemCode(dto.getItemCode());
            List<ShoeSizeDTO> shoeSizeDTOList = new ArrayList<>();

            for (ShoeSize shoeSize : shoeSizes) {
                ShoeSizeDTO shoeSizeDTO = new ShoeSizeDTO();
                shoeSizeDTO.setSize(shoeSize.getSize());
                shoeSizeDTO.setQuantity(shoeSize.getQuantity());
                shoeSizeDTO.setStatus(shoeSize.getStatus());
                shoeSizeDTOList.add(shoeSizeDTO);
            }
            dto.setShoe_size_list(shoeSizeDTOList);
        }

        return inventoryDTOList;
    }

    @Override
    public String getLastId(String prefix) {
        Inventory lastItem = inventoryRepo.getLastItemCode(prefix);
        System.out.println(lastItem);

        if (lastItem == null) {
            return "";
        }else{
            return lastItem.getItemCode();
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

    @Override
    public List<InventoryDTO> searchByName(String codePrefix) {
        List<Inventory> inventoryList = inventoryRepo.findAllByItemNameStartingWith(codePrefix);
        List<InventoryDTO> inventoryDTOList = inventoryList.stream().map(inventory -> {
            InventoryDTO dto = mapper.map(inventory, InventoryDTO.class);
            dto.setSupplierCode(inventory.getSupplierCode().getCode());
            return dto;
        }).collect(Collectors.toList());

        for (InventoryDTO dto : inventoryDTOList) {
            List<ShoeSize> shoeSizes = shoeSizeRepo.getAllByItemCode(dto.getItemCode());
            List<ShoeSizeDTO> shoeSizeDTOList = new ArrayList<>();

            for (ShoeSize shoeSize : shoeSizes) {
                ShoeSizeDTO shoeSizeDTO = new ShoeSizeDTO();
                shoeSizeDTO.setSize(shoeSize.getSize());
                shoeSizeDTO.setQuantity(shoeSize.getQuantity());
                shoeSizeDTO.setStatus(shoeSize.getStatus());
                shoeSizeDTOList.add(shoeSizeDTO);
            }
            dto.setShoe_size_list(shoeSizeDTOList);
        }

        return inventoryDTOList;
    }
}

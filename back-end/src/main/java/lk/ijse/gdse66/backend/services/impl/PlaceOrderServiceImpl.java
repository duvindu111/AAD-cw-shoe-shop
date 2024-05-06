package lk.ijse.gdse66.backend.services.impl;

import lk.ijse.gdse66.backend.dto.CustomerDTO;
import lk.ijse.gdse66.backend.dto.InventoryDTO;
import lk.ijse.gdse66.backend.dto.ShoeSizeDTO;
import lk.ijse.gdse66.backend.entity.Customer;
import lk.ijse.gdse66.backend.entity.Inventory;
import lk.ijse.gdse66.backend.entity.ShoeSize;
import lk.ijse.gdse66.backend.repo.CustomerRepo;
import lk.ijse.gdse66.backend.repo.InventoryRepo;
import lk.ijse.gdse66.backend.repo.ShoeSizeRepo;
import lk.ijse.gdse66.backend.services.PlaceOrderService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PlaceOrderServiceImpl implements PlaceOrderService {

    private CustomerRepo customerRepo;
    private InventoryRepo inventoryRepo;
    private ShoeSizeRepo shoeSizeRepo;
    private ModelMapper mapper;

    public PlaceOrderServiceImpl(InventoryRepo inventoryRepo, ShoeSizeRepo shoeSizeRepo, ModelMapper mapper, CustomerRepo customerRepo) {
        this.inventoryRepo = inventoryRepo;
        this.shoeSizeRepo = shoeSizeRepo;
        this.mapper = mapper;
        this.customerRepo = customerRepo;
    }

    @Override
    public List<String> getAllItemCodes() {
        List<String> itemCodeList = inventoryRepo.getItemCodes();
        return itemCodeList;
    }

    @Override
    public InventoryDTO getItemByCode(String item_code) {
        Inventory inventory = inventoryRepo.findAllByItemCode(item_code);
        InventoryDTO inventoryDTO = mapper.map(inventory, InventoryDTO.class);

        List<ShoeSize> shoeSizes = shoeSizeRepo.getAllByItemCode(inventoryDTO.getItemCode());
        List<ShoeSizeDTO> shoeSizeDTOList = new ArrayList<>();

        for (ShoeSize shoeSize : shoeSizes) {
            ShoeSizeDTO shoeSizeDTO = new ShoeSizeDTO();
            shoeSizeDTO.setSize(shoeSize.getSize());
            shoeSizeDTO.setQuantity(shoeSize.getQuantity());
            shoeSizeDTO.setStatus(shoeSize.getStatus());
            shoeSizeDTOList.add(shoeSizeDTO);
        }
        inventoryDTO.setShoe_size_list(shoeSizeDTOList);

        return inventoryDTO;
    }

    @Override
    public List<Integer> getItemSizesByCode(String itemCode) {
        List<Integer> sizes = shoeSizeRepo.findSizesByItemCodeAndStatus(itemCode, "Not Available");
        return sizes;
    }

    @Override
    public Integer getQtyByItemCodeAndSize(String itemCode, int size) {
        return shoeSizeRepo.findQtyByItemCodeAndSize(itemCode, size);
    }

    @Override
    public List<String> getAllCustomerCodes() {
        List<String> customerCodeList = customerRepo.getCustomerCodes();
        return customerCodeList;
    }

    @Override
    public CustomerDTO getCustomerByCode(String custCode) {
        Customer customer = customerRepo.findAllByCode(custCode);
        return mapper.map(customer, CustomerDTO.class);
    }
}

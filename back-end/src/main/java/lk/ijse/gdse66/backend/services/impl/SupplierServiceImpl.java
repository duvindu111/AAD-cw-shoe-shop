package lk.ijse.gdse66.backend.services.impl;

import lk.ijse.gdse66.backend.dto.CustomerDTO;
import lk.ijse.gdse66.backend.dto.SupplierDTO;
import lk.ijse.gdse66.backend.entity.Customer;
import lk.ijse.gdse66.backend.entity.Supplier;
import lk.ijse.gdse66.backend.repo.CustomerRepo;
import lk.ijse.gdse66.backend.repo.SupplierRepo;
import lk.ijse.gdse66.backend.services.CustomerService;
import lk.ijse.gdse66.backend.services.SupplierService;
import lk.ijse.gdse66.backend.services.exceptions.DuplicateRecordException;
import lk.ijse.gdse66.backend.services.exceptions.NotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierServiceImpl implements SupplierService {

    private SupplierRepo supplierRepo;
    private ModelMapper mapper;

    public SupplierServiceImpl(SupplierRepo supplierRepo, ModelMapper mapper) {
        this.supplierRepo = supplierRepo;
        this.mapper = mapper;
    }


    @Override
    public void saveSupplier(SupplierDTO supplierDTO) {
        if(supplierRepo.existsById(supplierDTO.getCode())){
            throw new DuplicateRecordException("Supplier with id " + supplierDTO.getCode() + " already exists");
        }else{
            supplierRepo.save(mapper.map(supplierDTO, Supplier.class));
        }
    }

    @Override
    public void updateSupplier(SupplierDTO supplierDTO) {
        if(!supplierRepo.existsById(supplierDTO.getCode())){
            throw new NotFoundException("No such supplier to update | Supplier Id: " + supplierDTO.getCode());
        }else{
            supplierRepo.save(mapper.map(supplierDTO, Supplier.class));
        }
    }

    @Override
    public boolean deleteSupplier(String id) {
        if(supplierRepo.existsById(id)){
            supplierRepo.deleteById(id);
            return true;
        }else{
            throw new NotFoundException("No such supplier to delete | Supplier Id: " + id);
        }
    }

    @Override
    public List<SupplierDTO> getAllSuppliers() {
        return supplierRepo.findAll().stream().map(supplier -> mapper.map(supplier, SupplierDTO.class)).toList();
    }

    @Override
    public String getLastId() {
        Supplier lastSupplier = supplierRepo.findTopByOrderByCodeDesc();
        System.out.println(lastSupplier);

        if (lastSupplier == null) {
            return "";
        }else{
            return lastSupplier.getCode();
        }
    }

    @Override
    public List<SupplierDTO> searchSuppliersByName(String prefix) {
        return supplierRepo.findAllByNameStartingWith(prefix).stream().map(supplier -> mapper.map(supplier, SupplierDTO.class)).toList();

    }
}

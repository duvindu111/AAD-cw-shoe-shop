package lk.ijse.gdse66.backend.services;

import lk.ijse.gdse66.backend.dto.CustomerDTO;
import lk.ijse.gdse66.backend.dto.SupplierDTO;

import java.util.List;

public interface SupplierService {

    void saveSupplier(SupplierDTO supplierDTO);

    void updateSupplier(SupplierDTO supplierDTO);

    boolean deleteSupplier(String id);

    List<SupplierDTO> getAllSuppliers();

    String getLastId();

    List<SupplierDTO> searchSuppliersByName(String prefix);

}

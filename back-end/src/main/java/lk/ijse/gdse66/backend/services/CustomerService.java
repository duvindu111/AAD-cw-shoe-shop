package lk.ijse.gdse66.backend.services;

import lk.ijse.gdse66.backend.dto.CustomerDTO;

import java.util.List;

public interface CustomerService {

    void saveCustomer(CustomerDTO customerDTO);

    void updateCustomer(CustomerDTO customerDTO);

    boolean deleteCustomer(String id);

    List<CustomerDTO> getAllCustomers();

    String getLastId();

    List<CustomerDTO> searchCustomersByName(String prefix);

}

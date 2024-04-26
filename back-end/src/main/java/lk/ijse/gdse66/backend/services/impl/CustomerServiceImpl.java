package lk.ijse.gdse66.backend.services.impl;

import lk.ijse.gdse66.backend.dto.CustomerDTO;
import lk.ijse.gdse66.backend.entity.Customer;
import lk.ijse.gdse66.backend.repo.CustomerRepo;
import lk.ijse.gdse66.backend.services.CustomerService;
import lk.ijse.gdse66.backend.services.exceptions.DuplicateRecordException;
import lk.ijse.gdse66.backend.services.exceptions.NotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerServiceImpl implements CustomerService {

    private CustomerRepo customerRepo;
    private ModelMapper mapper;

    public CustomerServiceImpl(CustomerRepo customerRepo, ModelMapper mapper) {
        this.customerRepo = customerRepo;
        this.mapper = mapper;
    }

    @Override
    public void saveCustomer(CustomerDTO customerDTO) {
        if(customerRepo.existsById(customerDTO.getCode())){
            throw new DuplicateRecordException("Customer with id " + customerDTO.getCode() + " already exists");
        }
        customerRepo.save(mapper.map(customerDTO, Customer.class));
    }

    @Override
    public void updateCustomer(CustomerDTO customerDTO) {
        if(customerRepo.existsById(customerDTO.getCode())){
            customerRepo.save(mapper.map(customerDTO, Customer.class));
        }else{
            throw new NotFoundException("No such customer to update | Customer Id: " + customerDTO.getCode());
        }
    }

    @Override
    public boolean deleteCustomer(String id) {
        return false;
    }

    @Override
    public List<CustomerDTO> getAllCustomers() {
        return customerRepo.findAll().stream().map(customer -> mapper.map(customer, CustomerDTO.class)).toList();
    }

    @Override
    public CustomerDTO searchCustomer(String id) {
        return null;
    }

    @Override
    public String getLastId() {
        Customer lastCustomer = customerRepo.findTopByOrderByCodeDesc();

        System.out.println(lastCustomer);

        if (lastCustomer == null) {
            return "";
        }else{
            return lastCustomer.getCode();
        }
    }
}

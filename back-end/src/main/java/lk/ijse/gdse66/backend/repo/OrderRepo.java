package lk.ijse.gdse66.backend.repo;

import lk.ijse.gdse66.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepo extends JpaRepository<Order, String> {

    Order findTopByOrderByOrderIdDesc();
}

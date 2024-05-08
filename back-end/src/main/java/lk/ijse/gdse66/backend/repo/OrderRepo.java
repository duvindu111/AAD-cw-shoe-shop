package lk.ijse.gdse66.backend.repo;

import lk.ijse.gdse66.backend.entity.Order;
import lk.ijse.gdse66.backend.entity.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepo extends JpaRepository<Order, String> {

    Order findTopByOrderByOrderIdDesc();

    List<Order> findAllByOrderIdStartingWith(String prefix);

}

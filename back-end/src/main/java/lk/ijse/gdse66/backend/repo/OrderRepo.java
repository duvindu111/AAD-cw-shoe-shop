package lk.ijse.gdse66.backend.repo;

import lk.ijse.gdse66.backend.entity.Order;
import lk.ijse.gdse66.backend.projection.OrderDetailByYearMonthProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepo extends JpaRepository<Order, String> {

    Order findTopByOrderByOrderIdDesc();

    List<Order> findAllByOrderIdStartingWith(String prefix);

    Order findByOrderId(String orderId);

    @Query("SELECT DISTINCT o.orderDate FROM Order o")
    List<String> getDistinctOrderDates();

    @Query(value = "SELECT `order`.order_id AS orderId, DATE(`order`.order_date) AS orderDate, order_detail.item_name AS itemName, order_detail.item_code AS itemCode, order_detail.qty AS qty " +
            "FROM `order` " +
            "INNER JOIN order_detail ON order_detail.order_id = `order`.order_id "+
            "WHERE YEAR(`order`.order_date) = :year AND MONTH(`order`.order_date) = :month",
            nativeQuery = true)
    List<OrderDetailByYearMonthProjection> findOrderDetailsWithDate(@Param("year") int year, @Param("month") int month);


}

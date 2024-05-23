package lk.ijse.gdse66.backend.repo;

import lk.ijse.gdse66.backend.dto.OrderDetailDTO;
import lk.ijse.gdse66.backend.entity.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderDetailRepo extends JpaRepository<OrderDetail, String> {

    List<OrderDetail> findAllByOrderDetailPK_OrderId(String orderId);

    void deleteByOrderDetailPK_OrderId(String orderId);

    void deleteByOrderDetailPK_OrderIdAndOrderDetailPK_ItemCodeAndOrderDetailPK_Size
            (String orderId, String itemCode, int size);

    @Query(value = "SELECT item_code " +
            "FROM order_detail " +
            "GROUP BY item_code " +
            "ORDER BY SUM(qty) DESC " +
            "LIMIT 1 " , nativeQuery = true)
    String findMostSoldItemCode();
}

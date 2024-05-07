package lk.ijse.gdse66.backend.repo;

import lk.ijse.gdse66.backend.dto.OrderDetailDTO;
import lk.ijse.gdse66.backend.entity.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderDetailRepo extends JpaRepository<OrderDetail, String>{

    List<OrderDetail> findAllByOrderDetailPK_OrderId(String orderId);
}

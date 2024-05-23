package lk.ijse.gdse66.backend.projection;

import java.sql.Date;

public interface OrderDetailByYearMonthProjection {
    String getOrderId();
    Date getOrderDate();
    String getItemName();
    String getItemCode();
    int getQty();
}


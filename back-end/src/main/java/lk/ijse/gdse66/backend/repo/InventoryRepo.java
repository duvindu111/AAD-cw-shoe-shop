package lk.ijse.gdse66.backend.repo;

import lk.ijse.gdse66.backend.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryRepo extends JpaRepository<Inventory,String> {

    @Query(value = "SELECT * FROM inventory  WHERE item_code LIKE ?1% ORDER BY item_code DESC LIMIT 1", nativeQuery = true)
    Inventory getLastItemCode(String prefix);

}

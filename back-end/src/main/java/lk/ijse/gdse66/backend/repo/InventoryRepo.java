package lk.ijse.gdse66.backend.repo;

import jakarta.transaction.Transactional;
import lk.ijse.gdse66.backend.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryRepo extends JpaRepository<Inventory,String> {

    @Query(value = "SELECT * FROM inventory  WHERE item_code LIKE ?1% ORDER BY item_code DESC LIMIT 1", nativeQuery = true)
    Inventory getLastItemCode(String prefix);

    List<Inventory> findAllByItemNameStartingWith(String codePrefix);

    List<Inventory> findByPriceSaleBetween(double min_price, double max_price);

    List<Inventory> findByCategoryContaining(String value);

    @Query(value = "SELECT item_code FROM inventory", nativeQuery = true)
    List<String> getItemCodes();

    Inventory findAllByItemCode(String code);

//    Inventory findByItemCode(String code);
}

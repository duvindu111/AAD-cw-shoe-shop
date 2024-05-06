package lk.ijse.gdse66.backend.repo;

import jakarta.transaction.Transactional;
import lk.ijse.gdse66.backend.entity.Inventory;
import lk.ijse.gdse66.backend.entity.ShoeSize;
import org.aspectj.weaver.ast.Not;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShoeSizeRepo extends JpaRepository<ShoeSize,String> {

    @Query(value="SELECT * FROM shoe_size WHERE item_code=?1",nativeQuery = true)
    List<ShoeSize> getAllByItemCode(String item_code);

    @Transactional
    @Modifying
    @Query(value="UPDATE shoe_size SET quantity = ?1, status = ?2 WHERE item_code= ?3 && size = ?4",nativeQuery = true)
    void updateByItemCodeAndSize(int qty, String status, String item_code, int size);

    Boolean existsByItemCodeAndSize(Inventory item_code, int size);

    @Transactional
    @Modifying
    @Query(value="DELETE FROM shoe_size WHERE item_code= ?1", nativeQuery = true)
    void deleteByItemCode(String item_code);

    @Query(value="SELECT size FROM shoe_size WHERE item_code=?1 && (NOT status =?2) ",nativeQuery = true)
    List<Integer> findSizesByItemCodeAndStatus(String item_code, String status);

    @Query(value="SELECT quantity FROM shoe_size WHERE item_code=?1 && size=?2",nativeQuery = true)
    Integer findQtyByItemCodeAndSize(String item_code, int size);
}




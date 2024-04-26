package lk.ijse.gdse66.backend.services.exceptions;

import org.hibernate.service.spi.ServiceException;

public class DuplicateRecordException extends ServiceException {

    public DuplicateRecordException(String message) {
        super(message);
    }

}

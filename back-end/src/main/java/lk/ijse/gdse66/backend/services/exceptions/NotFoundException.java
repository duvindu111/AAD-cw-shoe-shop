package lk.ijse.gdse66.backend.services.exceptions;

import org.hibernate.service.spi.ServiceException;

public class NotFoundException extends ServiceException {

    public NotFoundException(String message) {
        super(message);
    }

}

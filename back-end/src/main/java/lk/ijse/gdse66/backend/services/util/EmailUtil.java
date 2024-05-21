package lk.ijse.gdse66.backend.services.util;

import java.util.Properties;
import javax.mail.*;
import javax.mail.internet.*;

public class EmailUtil {

    private static final String SMTP_HOST = "smtp.gmail.com";
    private static final String SMTP_PORT = "587";
    private static final String SMTP_AUTH = "true";
    private static final String SMTP_STARTTLS = "true";
    private static final String USERNAME = "fightlife241@gmail.com";
    private static final String PASSWORD = "ebij tfoj hphp rrmz";

    public static void sendEmail(String to, String subject, String body) throws MessagingException {
        Properties properties = new Properties();
        properties.put("mail.smtp.host", SMTP_HOST);
        properties.put("mail.smtp.port", SMTP_PORT);
        properties.put("mail.smtp.auth", SMTP_AUTH);
        properties.put("mail.smtp.starttls.enable", SMTP_STARTTLS);

        Session session = Session.getInstance(properties, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(USERNAME, PASSWORD);
            }
        });

        session.setDebug(true);

        Message message = new MimeMessage(session);
        message.setFrom(new InternetAddress(USERNAME));
        message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
        message.setSubject(subject);
        message.setText(body);

        Transport.send(message);
    }
}

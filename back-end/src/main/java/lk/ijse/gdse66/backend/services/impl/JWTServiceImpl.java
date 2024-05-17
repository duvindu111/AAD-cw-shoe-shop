package lk.ijse.gdse66.backend.services.impl;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lk.ijse.gdse66.backend.services.JWTService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.function.Function;

@Service
public class JWTServiceImpl implements JWTService {

    @Value("${token.key}")
    String jwtKey;

    @Override
    public String generateToken(UserDetails userDetail) {
        HashMap<String, Object> claims = new HashMap<>();
        claims.put("role", userDetail.getAuthorities());
        Date currentDate = new Date();
        Date expireDate = new Date(currentDate.getTime() + 1000 * 600);
        String accessToken = Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetail.getUsername())
                .setIssuedAt(currentDate)
                .setExpiration(expireDate)
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
        return accessToken;
    }

    @Override
    public String extractUsername(String token) {
        return extractClaims(token,claims -> claims.getSubject());
    }

    @Override
    public boolean isTokenValid(String token, UserDetails userDetails) {
        String subject = extractClaims(token, claims -> claims.getSubject());
        return subject.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private Key getSignKey(){
        byte[] bytes = Decoders.BASE64.decode(jwtKey);
        return Keys.hmacShaKeyFor(bytes);
    }

    private Claims getAllClaims(String token){
        return Jwts.parserBuilder().setSigningKey(getSignKey()).build().parseClaimsJws(token).getBody();
    }

    private <T> T extractClaims(String token, Function<Claims, T> claimsResolver){
        Claims claims = getAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private boolean isTokenExpired(String token){
        Date expiredDate = extractClaims(token, claims -> claims.getExpiration());
        return expiredDate.before(new Date());
    }
}

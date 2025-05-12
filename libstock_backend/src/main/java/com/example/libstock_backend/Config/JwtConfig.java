package com.example.libstock_backend.Config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtConfig {
    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public String createToken(String email, int expiration){
        return Jwts.builder() // used to generate token //
            .setSubject(email) // what is used to make token // 
            .setIssuedAt(new Date()) // keeps track of time on token creation //
            .setExpiration(new Date(System.currentTimeMillis() + expiration * 1000 * 60)) // keeps track of expiration, expiration * minutes //
            .signWith(key, SignatureAlgorithm.HS256) // signs token with hashed key //
            .compact(); // finalizes token into final string // 
    }

    public String validation(String token) {
        return Jwts.parserBuilder() // used to read and validate token //
            .setSigningKey(key) // key used to sign token also used to validate //
            .build() // builds parser //
            .parseClaimsJws(token) // paser token = reads token //
            .getBody() // get's payload after validation //
            .getSubject(); // extracts field from payload // 
    }
}
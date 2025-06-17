package com.esaunders.library.services;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.esaunders.library.entities.User;

@Service
public class JwtService {
    
    public String generateToken(User user) {
        return user.getEmail();
    }

    public String extractUsername(String jwt) {
        return jwt;
    }

    public boolean isTokenValid(String jwt, UserDetails user) {
        return jwt.equals(user.getUsername());
    }
}

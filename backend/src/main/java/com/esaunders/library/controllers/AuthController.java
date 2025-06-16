package com.esaunders.library.controllers;

import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.esaunders.library.dtos.RegisterUser;
import com.esaunders.library.dtos.UserDto;
import com.esaunders.library.entities.User;
import com.esaunders.library.mappers.UserMapper;
import com.esaunders.library.repositories.UserRepository;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5500")
public class AuthController {
    private UserRepository userRepo;
    private UserMapper userMapper;


    @PostMapping("/login")
    public ResponseEntity<UserDto> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Optional<User> userOpt = userRepo.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            if (user.getPassword().equals(password)) {
                return ResponseEntity.ok(userMapper.toDto(user));
            }
        }

        return ResponseEntity.notFound().build();
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterUser request) {
        System.out.println(request.getName());
        if (userRepo.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Email already in use"));
        }

        userRepo.save(userMapper.toEntity(request));
        return ResponseEntity.ok(Map.of("message", "Registration successful"));
    }
}

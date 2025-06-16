package com.esaunders.library.dtos;

import lombok.Data;

@Data
public class RegisterUser {
    private String name;
    private String email;
    private String password;
}

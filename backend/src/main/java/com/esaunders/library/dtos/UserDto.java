package com.esaunders.library.dtos;

import java.util.List;

import com.esaunders.library.entities.Book;

import lombok.Data;

@Data
public class UserDto {
    private String name;
    private String email;
    private List<Book> books;
}

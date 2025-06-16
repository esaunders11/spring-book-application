package com.esaunders.library.dtos;

import java.util.List;

import com.esaunders.library.entities.Book;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class UserDto {
    private Long id;
    private String name;
    private List<Book> books;
}

package com.esaunders.library.dtos;

import lombok.Data;

@Data
public class BookDto {
    private String title;
    private String author;
    private String genre;
    private int length;
}

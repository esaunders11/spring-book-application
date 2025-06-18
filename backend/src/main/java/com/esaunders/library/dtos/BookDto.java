package com.esaunders.library.dtos;

import lombok.Data;

@Data
public class BookDto {
    private String title;
    private String author;
    private String genre;
    private String thumbnail;
    private String description;
    private double year;
    private double rating;
    private int pages;
}

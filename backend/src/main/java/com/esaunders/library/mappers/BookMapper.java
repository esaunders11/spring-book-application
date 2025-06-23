package com.esaunders.library.mappers;

import org.mapstruct.Mapper;

import com.esaunders.library.dtos.BookDto;
import com.esaunders.library.entities.Book;

@Mapper(componentModel = "spring")
public interface BookMapper {
    BookDto toDto(Book book);
    Book toEntity(BookDto bookDto);
}

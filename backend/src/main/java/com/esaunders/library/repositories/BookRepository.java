package com.esaunders.library.repositories;

import com.esaunders.library.entities.Book;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    Book findByTitleContainingIgnoreCaseAndAuthorContainingIgnoreCase(String title, String author);
    Book findByTitleContainingIgnoreCase(String title);
}


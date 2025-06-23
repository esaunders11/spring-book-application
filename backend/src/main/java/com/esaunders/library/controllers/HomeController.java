package com.esaunders.library.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.esaunders.library.dtos.BookDto;
import com.esaunders.library.dtos.RequestBook;
import com.esaunders.library.dtos.UserDto;
import com.esaunders.library.entities.Book;
import com.esaunders.library.entities.User;
import com.esaunders.library.mappers.BookMapper;
import com.esaunders.library.mappers.UserMapper;
import com.esaunders.library.repositories.BookRepository;
import com.esaunders.library.repositories.UserRepository;
import com.esaunders.library.services.UserService;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/home")
@CrossOrigin(origins = "http://localhost:5500")
public class HomeController {
    private BookRepository bookRepository;
    private UserRepository userRepository;
    private BookMapper bookMapper;
    private UserMapper userMapper;
    private UserService userService;



    @GetMapping("/user")
    public ResponseEntity<UserDto> getLoginUser() {
        User user = userService.getAuthenticatedUser();
        return ResponseEntity.ok(userMapper.toDto(user));
    }

    @PostMapping("/add-book")
    public ResponseEntity<BookDto> addBook(@RequestBody RequestBook bookRequest) {
        User user = userService.getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        Book book = bookRepository
            .findByTitleContainingIgnoreCaseAndAuthorContainingIgnoreCase(
                bookRequest.getTitle().trim(), 
                bookRequest.getAuthor().trim()
            );

        if (book == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        if (!user.getBooks().contains(book)) {
            user.getBooks().add(book);
            userRepository.save(user);
        }

        BookDto response = bookMapper.toDto(book);
        
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete-book")
    public ResponseEntity<Void> deleteBook(@RequestBody Book book) {
        User user = userService.getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        if (book == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        user.getBooks().removeIf(b -> b.getId().equals(book.getId()));
        userRepository.save(user);
        return ResponseEntity.noContent().build();
    }

}

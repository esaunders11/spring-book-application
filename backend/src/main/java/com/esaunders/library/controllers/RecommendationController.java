package com.esaunders.library.controllers;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;

import com.esaunders.library.dtos.BookDto;
import com.esaunders.library.mappers.BookMapper;
import com.esaunders.library.repositories.BookRepository;

import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/recommend")
@CrossOrigin(origins = {"http://localhost:5500", "http://localhost:8000"})
public class RecommendationController {

    private final WebClient webClient;
    private final BookRepository bookRepository;
    private final BookMapper bookMapper;

    @Autowired
    public RecommendationController(WebClient.Builder webClientBuilder, BookRepository bookRepository, BookMapper bookMapper) {
        this.webClient = webClientBuilder.baseUrl("http://localhost:8000").build();
        this.bookRepository = bookRepository;
        this.bookMapper = bookMapper;
    }

    @SuppressWarnings("unchecked")
    @GetMapping("/with")
    public Mono<ResponseEntity<List<BookDto>>> getRecommendations(@RequestParam String title) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/recommend")
                        .queryParam("title", title)
                        .build())
                .retrieve()
                .bodyToMono(Map.class)
                .map(responseMap -> {
                    List<Map<String, String>> results = (List<Map<String, String>>) responseMap.get("recommendations");

                    List<BookDto> recommendedBooks = results.stream()
                        .map(map -> bookRepository.findByTitleContainingIgnoreCaseAndAuthorContainingIgnoreCase(
                            map.get("title"), map.get("author")
                        ))
                        .filter(Objects::nonNull)
                        .map(bookMapper::toDto)
                        .collect(Collectors.toList());

                    return ResponseEntity.ok(recommendedBooks);
                })
                .onErrorResume(e -> {
                    System.out.println(e.getMessage());
                    return Mono.just(ResponseEntity.status(500).body(Collections.emptyList()));
                });
    }
}

package com.esaunders.library.entities;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * Book class creates book objects,
 * Books have a title, genre, length, and author's last name
 * 
 * @author Ethan Saunders
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ToString
@EqualsAndHashCode
@Entity
@Table(name = "books")
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "isbn13")
    private float isbn13;
    /** Title of Book */
    @Column(name = "title")
    private String title;
    /** Author's last name */
    @Column(name = "author")
    private String author;
    /** Book Genre */
    @Column(name = "genre")
    private String genre;
    @Column(name = "img")
    private String thumbnail;
    @Column(name = "description")
    private String description;
    @Column(name = "published_year")
    private int year;
    @Column(name = "rating")
    private double rating;
    @Column(name = "pages")
    private int pages;    
    @ManyToMany(mappedBy = "books")
    @JsonIgnore
    private Set<User> users;
}


package com.esaunders.library.entities;

/**
 * Book class creates book objects,
 * Books have a title, genre, length, and author's last name
 * 
 * @author Ethan Saunders
 */
public class Book {
    /** Title of Book */
    private String title;
    /** Author's last name */
    private String author;
    /** Number of Pages of Book */
    private int length;
    /** Book information */
    private String[] info;
    
    /**
     * Generates Book Object with title, author, and length
     * @param title title of Book
     * @param author author's last name
     * @param length Number of pages
     * @param genre Genre of Book
     */
    public Book(String title, String author, String genre, int length) {
        setTitle(title);
        setAuthor(author);
        setLength(length);
    }

    /**
     * Add Book information
     * @param info list of information
     */
    public void addInfo(String[] info) {
        this.info = info;
    }

    /**
     * Returns Book's information
     * @return list of Book's information
     */
    public String[] getInfo(){
        return info;
    }

    /**
     * Sets the title of Book
     * @param title Title of Book
     * @throws IllegalArgumentException if title is empty or null
     */
    public void setTitle(String title) {
        if("".equals(title) || title == null) {
            throw new IllegalArgumentException("Invalid Title.");
        }

        this.title = title;
    }

    /**
     * Gets title of Book
     * @return title of Book
     */
    public String getTitle() {
        return this.title;
    }

    /**
     * Sets the author's last name
     * @param author author's last name
     * @throws IllegalArgumentException if author's name is null or emtpy
     */
    public void setAuthor(String author) {
        if("".equals(author) || author == null) {
            throw new IllegalArgumentException("Invalid Author.");
        }

        this.author = author;
    }

    /**
     * Gets author's name
     * @return author's last name
     */
    public String getAuthor() {
        return this.author;
    }

    /**
     * Sets the number of pages of book
     * @param length Number of pages
     * @throws IllegalArgumentException if length is 0
     */
    public void setLength(int length) {
        if (length == 0) {
            throw new IllegalArgumentException("Invalid Number of Pages.");
        }

        this.length = length;
    }

    /**
     * Gets the number of pages of Book
     * @return length of book
     */
    public int getLength() {
        return this.length;
    }

    
    /**
     * Returns Book contents
     * @return String of Book's title, author and length
     */
    @Override
    public String toString() {
        return title + "," + author + "," + length;
    }

    /**
     * Hashcode
     */
    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((title == null) ? 0 : title.hashCode());
        result = prime * result + ((author == null) ? 0 : author.hashCode());
        result = prime * result + length;
        return result;
    }

    /**
     * Equals method to check if two Books are the same
     * @return boolean if two Books are equal or not
     */
    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Book other = (Book) obj;
        if (title == null) {
            if (other.title != null)
                return false;
        } else if (!title.equals(other.title))
            return false;
        if (author == null) {
            if (other.author != null)
                return false;
        } else if (!author.equals(other.author))
            return false;
        if (length != other.length)
            return false;
        return true;
    }
}


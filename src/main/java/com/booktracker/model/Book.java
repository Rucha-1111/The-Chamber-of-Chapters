package com.booktracker.model;

import jakarta.persistence.*;

@Entity
@Table(name = "books")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;

    // One of: TO_READ, READING, COMPLETED
    @Column(nullable = false)
    private String status;

    // 1-5 stars, only meaningful once status = COMPLETED. Nullable otherwise.
    private Integer rating;

    // Free-text personal thoughts about the book. Nullable - not every book
    // needs a note. Stored as TEXT so it isn't length-limited like a normal
    // varchar column.
    @Column(columnDefinition = "TEXT")
    private String notes;

    // Which user this book belongs to. Kept as a plain foreign key column
    // instead of a full @ManyToOne relationship, on purpose - simpler to read
    // and reason about for a small project like this.
    @Column(name = "user_id", nullable = false)
    private Long userId;

    public Book() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}

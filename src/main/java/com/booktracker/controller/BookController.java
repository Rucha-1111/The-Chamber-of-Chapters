package com.booktracker.controller;

import com.booktracker.model.Book;
import com.booktracker.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/books")
public class BookController {

    @Autowired
    private BookRepository bookRepository;

    // GET /api/books?userId=1
    @GetMapping
    public ResponseEntity<List<Book>> getBooks(@RequestParam Long userId) {
        return ResponseEntity.ok(bookRepository.findByUserId(userId));
    }

    // POST /api/books
    // body: { "userId": 1, "title": "...", "author": "...", "status": "TO_READ" }
    @PostMapping
    public ResponseEntity<?> addBook(@RequestBody Map<String, Object> body) {
        Book book = new Book();
        book.setUserId(Long.valueOf(String.valueOf(body.get("userId"))));
        book.setTitle((String) body.get("title"));
        book.setAuthor((String) body.get("author"));
        book.setStatus(body.getOrDefault("status", "TO_READ").toString());
        if (body.get("notes") != null) {
            book.setNotes((String) body.get("notes"));
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(bookRepository.save(book));
    }

    // PUT /api/books/5
    // body: any of { "title", "author", "status", "rating" } to change
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBook(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return bookRepository.findById(id)
                .map(book -> {
                    if (body.containsKey("title")) book.setTitle((String) body.get("title"));
                    if (body.containsKey("author")) book.setAuthor((String) body.get("author"));
                    if (body.containsKey("status")) book.setStatus((String) body.get("status"));
                    if (body.containsKey("rating")) {
                        Object rating = body.get("rating");
                        book.setRating(rating == null ? null : Integer.valueOf(String.valueOf(rating)));
                    }
                    if (body.containsKey("notes")) {
                        book.setNotes((String) body.get("notes"));
                    }
                    return ResponseEntity.ok(bookRepository.save(book));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/books/5
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable Long id) {
        if (!bookRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        bookRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

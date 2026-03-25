package com.newsnest.news_service.controller;

import com.newsnest.news_service.model.Article;
import com.newsnest.news_service.service.NewsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news")
@CrossOrigin(origins = "http://localhost:8000")
public class NewsController {

    private final NewsService newsService;

    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Spring Boot is running!");
    }

    @GetMapping("/top")
    public ResponseEntity<List<Article>> getTop() {
        return ResponseEntity.ok(newsService.getTopHeadlines());
    }

    @GetMapping
    public ResponseEntity<List<Article>> getByCategory(
            @RequestParam(defaultValue = "general") String category) {
        return ResponseEntity.ok(newsService.fetchNewsByCategory(category, "en"));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Article>> search(@RequestParam String q) {
        return ResponseEntity.ok(newsService.searchNews(q));
    }

    // Naya Endpoint Load More ke liye
    @GetMapping("/more")
    public ResponseEntity<List<Article>> getMore(
            @RequestParam(defaultValue = "general") String category,
            @RequestParam(defaultValue = "2") int page) {
        return ResponseEntity.ok(newsService.fetchMore(category, page));
    }
}
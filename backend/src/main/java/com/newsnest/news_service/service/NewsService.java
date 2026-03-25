package com.newsnest.news_service.service;

import com.newsnest.news_service.model.Article;
import com.newsnest.news_service.repository.ArticleRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.json.JSONArray;
import org.json.JSONObject;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class NewsService {

    @Value("${news.api.key}")
    private String apiKey;

    @Value("${news.api.url}")
    private String apiUrl;

    private final ArticleRepository articleRepository;
    private final RestTemplate restTemplate;

    public NewsService(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
        this.restTemplate = new RestTemplate();
    }

    public List<Article> fetchNewsByCategory(String category, String lang) {
        return fetchNewsAPIFallback(category, "en", 1);
    }

    public List<Article> searchNews(String query) {
        try {
            // 🔥 FIX 1: sortBy=relevancy kar diya taaki sabse best news aaye 🔥
            String url = apiUrl + "/everything?q=" + query
                    + "&language=en&pageSize=20&sortBy=relevancy&apiKey=" + apiKey;
            return parseAndSave(restTemplate.getForObject(url, String.class), "search");
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    public List<Article> getTopHeadlines() {
        try {
            String url = apiUrl + "/top-headlines?country=us&pageSize=20&apiKey=" + apiKey;
            return parseAndSave(restTemplate.getForObject(url, String.class), "general");
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    public List<Article> fetchMore(String category, int page) {
        try {
            String query = category.equals("general") ? "world news" : category;
            // 🔥 FIX 2: sortBy=popularity kar diya Load More ke liye 🔥
            String url = apiUrl + "/everything?q=" + query
                    + "&language=en&pageSize=20&sortBy=popularity&page=" + page + "&apiKey=" + apiKey;
            return parseAndSave(restTemplate.getForObject(url, String.class), category);
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    private List<Article> fetchNewsAPIFallback(String category, String lang, int page) {
        try {
            String url = apiUrl + "/top-headlines?category=" + category
                    + "&language=en&pageSize=20&page=" + page + "&apiKey=" + apiKey;
            return parseAndSave(restTemplate.getForObject(url, String.class), category);
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    private List<Article> parseAndSave(String jsonResponse, String category) {
        List<Article> articles = new ArrayList<>();
        try {
            JSONObject json = new JSONObject(jsonResponse);
            JSONArray articlesArray = json.getJSONArray("articles");
            for (int i = 0; i < articlesArray.length(); i++) {
                JSONObject a = articlesArray.getJSONObject(i);
                Article article = new Article();
                article.setTitle(a.optString("title", "No Title"));
                article.setDescription(a.optString("description", ""));
                article.setUrl(a.optString("url", ""));
                article.setImageUrl(a.optString("urlToImage", ""));
                article.setAuthor(a.optString("author", ""));
                article.setCategory(category);
                article.setCachedAt(LocalDateTime.now());

                if (!a.isNull("source")) {
                    article.setSource(a.getJSONObject("source").optString("name", ""));
                }

                articles.add(article);
                articleRepository.save(article);
            }
        } catch (Exception e) {
        }
        return articles;
    }
}
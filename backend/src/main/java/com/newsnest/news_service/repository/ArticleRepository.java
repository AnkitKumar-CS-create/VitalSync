package com.newsnest.news_service.repository;

import com.newsnest.news_service.model.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
    List<Article> findByCategory(String category);

    List<Article> findByTitleContainingIgnoreCase(String keyword);
}
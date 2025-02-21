package BackEnd;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ReviewController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/api/reviews/add")
    public ResponseEntity<String> addReview(@RequestBody Map<String, Object> review) {
        try {

            System.out.println("Received review data: " + review.toString());
            Integer score = null;
            String author = null;
            Integer seriesId = null;
            String content = null;

            try {
                if (review.get("score") instanceof Integer) {
                    score = (Integer) review.get("score");
                } else if (review.get("score") instanceof Number) {
                    score = ((Number) review.get("score")).intValue();
                }

                author = (String) review.get("author");

                if (review.get("series_id") instanceof Integer) {
                    seriesId = (Integer) review.get("series_id");
                } else if (review.get("series_id") instanceof Number) {
                    seriesId = ((Number) review.get("series_id")).intValue();
                } else if (review.get("series_id") instanceof String) {
                    try {
                        seriesId = Integer.parseInt((String) review.get("series_id"));
                    } catch (NumberFormatException e) {
                        return ResponseEntity.badRequest().body("Nieprawidłowy format series_id");
                    }
                }

                content = (String) review.get("content");
            } catch (Exception e) {
                System.out.println("Error parsing request data: " + e.getMessage());
                return ResponseEntity.badRequest().body("Błąd przetwarzania danych: " + e.getMessage());
            }

            if (content == null || content.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Treść recenzji jest wymagana");
            }

            if (score == null || score < 1 || score > 10) {
                return ResponseEntity.badRequest().body("Ocena musi być między 1 a 10");
            }

            if (seriesId == null) {
                return ResponseEntity.badRequest().body("ID serialu jest wymagane");
            }

            if (author == null || author.trim().isEmpty()) {
                author = "anonymus";
            }

            String sql = "INSERT INTO reviews (score, author, series_id, content) VALUES (?, ?, ?, ?)";
            System.out.println("SQL query: " + sql);
            System.out.println("SQL parameters: " + score + ", " + author + ", " + seriesId + ", " + content);

            int rowsAffected = jdbcTemplate.update(sql, score, author, seriesId, content);
            System.out.println("Rows affected: " + rowsAffected);


            if (rowsAffected > 0) {
                jdbcTemplate.execute("COMMIT");
                return ResponseEntity.ok("Recenzja została zapisana");
            } else {
                return ResponseEntity.status(500).body("Nie udało się zapisać recenzji");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Błąd podczas zapisywania recenzji: " + e.getMessage());
        }
    }

    // Endpoint testowy do weryfikacji, czy API działa
    @GetMapping("/api/reviews/test")
    public ResponseEntity<String> testEndpoint() {
        return ResponseEntity.ok("API działa poprawnie");
    }
}
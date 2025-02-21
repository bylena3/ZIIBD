package BackEnd;

import Core.Review;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Endpoint do dodania recenzji
    @PostMapping("/add_reviews")
    public ResponseEntity<String> addReview(@RequestBody Review review) {
        // Zapytanie SQL do wstawienia danych recenzji
        String sql = "INSERT INTO reviews (content, score, author, series_id ) VALUES (?, ?)";

        // Wykonanie zapytania z JdbcTemplate
        int rowsAffected = jdbcTemplate.update(sql, review.getContent(), review.getScore(), review.getAuthor(), review.getSeries_id());

        // Sprawdzanie, czy dane zostały zapisane w bazie
        if (rowsAffected > 0) {
            return ResponseEntity.ok("Recenzja została zapisana.");
        } else {
            return ResponseEntity.status(500).body("Wystąpił problem z zapisem recenzji.");
        }
    }
}


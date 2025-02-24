package BackEnd;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;


@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class MoviesReviewController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/api/reviews/addm")
    public ResponseEntity<String> addReview(@RequestBody Review review) {
        try {
            System.out.println("Received review data: " + review.toString());
            Integer score = review.getScore();
            String author = review.getAuthor();
            Integer movieId = review.getMovieId();
            String content = review.getContent();

            if (content == null || content.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Treść recenzji jest wymagana");
            }


            if (movieId == null) {
                return ResponseEntity.badRequest().body("ID filmu jest wymagane");
            }

            if (author == null || author.trim().isEmpty()) {
                author = "Anonymus";
            }

            String sql = "INSERT INTO reviews (score, author, movie_id, content) VALUES (?, ?, ?, ?)";
            System.out.println("SQL query: " + sql);
            System.out.println("SQL parameters: " + score + ", " + author + ", " + movieId + ", " + content);

            int rowsAffected = jdbcTemplate.update(sql, score, author, movieId, content);
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

}
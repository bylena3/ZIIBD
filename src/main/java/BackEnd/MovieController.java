package BackEnd;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.List;
import java.util.Map;


 class ReviewUpdateRequest {
    private int score;
    private String content;

    // Getters and setters
    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class MovieController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/api/movies")
    public List<Map<String, Object>> getMovies() {
        String sql = "SELECT m.MOVIE_ID, m.TITLE, d.NAME AS DIRECTOR_NAME,d.SURNAME AS DIRECTOR_SURNAME, m.DURATION,g.NAME AS GENRE_NAME, m.URL FROM movies m JOIN directors d ON m.DIRECTOR_ID = d.DIRECTOR_ID JOIN genres g ON m.GENRE_ID = g.GENRE_ID";
        return jdbcTemplate.queryForList(sql);
    }

    @GetMapping("/api/series")
    public List<Map<String, Object>> getSeries() {
        String sql = "SELECT s.SERIES_ID, s.TITLE, d.NAME AS DIRECTOR_NAME , d.SURNAME AS DIRECTOR_SURNAME, s.SEASONS,g.NAME AS GENRE_NAME, s.URL FROM series s JOIN directors d ON s.DIRECTOR_ID = d.DIRECTOR_ID JOIN genres g ON s.GENRE_ID = g.GENRE_ID";
        return jdbcTemplate.queryForList(sql);
    }

    @GetMapping("/api/top_media")
    public List<Map<String, Object>> getTopSeries() {
        String sql = "SELECT series.series_ID AS series_id, title, URL FROM series WHERE ROWNUM <=3 UNION ALL SELECT movies.movie_id as movie_id, title, URL FROM movies WHERE ROWNUM <=3";
        return jdbcTemplate.queryForList(sql);
    }

    @GetMapping("/api/movie_reviews")
    public List<Map<String, Object>> getMovieReviews() {
        String sql = "SELECT r.review_id, r.author, r.score, r.content, r.movie_id, m.title FROM reviews r JOIN movies m ON r.movie_id = m.movie_id";
        return jdbcTemplate.queryForList(sql);
    }

    @GetMapping("/api/series_reviews")
    public List<Map<String, Object>> getSeriesReviews() {
        String sql = "SELECT r.review_id, r.author, r.score, r.content, r.series_id, s.title FROM reviews r JOIN series s ON r.series_id = s.series_id";
        return jdbcTemplate.queryForList(sql);
    }

    @GetMapping("/api/movie_info")
    public List<Map<String, Object>> getMovieInfo() {
        String sql = "SELECT m.movie_id, m.Title, m.Duration, m.Description, d.Name || ' ' || d.Surname AS Director, g.Name AS Genre, m.URL, LISTAGG(a.Name || ' ' || a.Surname, ', ') WITHIN GROUP (ORDER BY a.Surname, a.Name) AS Actors FROM Movies m JOIN Directors d ON m.Director_ID = d.Director_ID JOIN Genres g ON m.Genre_ID = g.Genre_ID JOIN MovieCast mc ON m.Movie_ID = mc.Movie_ID JOIN Actors a ON mc.Actor_ID = a.Actor_ID GROUP BY m.Movie_ID, m.Title, m.Duration, m.Description, m.URL, d.Name, d.Surname, g.Name ORDER BY m.Title";
        return jdbcTemplate.queryForList(sql);
    }

    @GetMapping("/api/series_info")
    public List<Map<String, Object>> getSeriesInfo() {
        String sql = "SELECT s.series_id, s.Title, s.URL, s.Seasons, s.AvgDuration, s.Description, d.Name || ' ' || d.Surname AS Director, g.Name AS Genre, LISTAGG(a.Name || ' ' || a.Surname, ', ') WITHIN GROUP (ORDER BY a.Surname, a.Name) AS Actors FROM Series s JOIN Directors d ON s.Director_ID = d.Director_ID JOIN Genres g ON s.Genre_ID = g.Genre_ID JOIN SeriesCast sc ON s.Series_ID = sc.Series_ID JOIN Actors a ON sc.Actor_ID = a.Actor_ID GROUP BY s.Series_ID, s.Title, s.URL, s.Seasons, s.AvgDuration, s.Description, d.Name, d.Surname, g.Name ORDER BY s.Title";
        return jdbcTemplate.queryForList(sql);
    }

    @PutMapping("/api/reviews/{reviewId}")
    public ResponseEntity<?> updateReview(@PathVariable Long reviewId, @RequestBody ReviewUpdateRequest request) {
        try {
            String sql = "UPDATE reviews SET score = ?, content = ? WHERE review_id = ?";
            int rowsAffected = jdbcTemplate.update(sql, request.getScore(), request.getContent(), reviewId);

            if (rowsAffected > 0) {
                return ResponseEntity.ok().body(Map.of("message", "Review updated successfully"));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Add this class to represent the request body


}




package Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.List;
import java.util.Map;

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
        String sql = "SELECT series_ID, title, URL FROM series WHERE ROWNUM <=3 UNION ALL SELECT movie_id, title, URL FROM movies WHERE ROWNUM <=3";
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




}
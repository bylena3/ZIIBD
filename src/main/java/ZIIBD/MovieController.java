package ZIIBD;

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
        String sql = "SELECT m.MOVIE_ID, m.TITLE, d.NAME AS DIRECTOR_NAME,d.SURNAME AS DIRECTOR_SURNAME, m.DURATION FROM movies m JOIN directors d ON m.DIRECTOR_ID = d.DIRECTOR_ID";
        return jdbcTemplate.queryForList(sql);
    }

    @GetMapping("/api/series")
    public List<Map<String, Object>> getSeries() {
        String sql = "SELECT s.SERIES_ID, s.TITLE, d.NAME AS DIRECTOR_NAME , d.SURNAME AS DIRECTOR_SURNAME, s.SEASONS FROM series s JOIN directors d ON s.DIRECTOR_ID = d.DIRECTOR_ID";
        return jdbcTemplate.queryForList(sql);
    }
}
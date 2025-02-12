package ZIIBD;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.CommandLineRunner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@SpringBootApplication
public class ZiibdProjectApplication implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public static void main(String[] args) {
        SpringApplication.run(ZiibdProjectApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        String sql = "SELECT Movie_ID,title FROM movies ";
        List<Movie> Movies = jdbcTemplate.query(sql, new MovieRowMapper());
        
        Movies.forEach(System.out::println);
    }

    static class Movie {
        private int id;
        private String name;

        public Movie(int id, String name) {
            this.id = id;
            this.name = name;
        }

        @Override
        public String toString() {
            return "Movie{id=" + id + ", title='" + name + "'}";
        }
    }

    static class MovieRowMapper implements RowMapper<Movie> {
        @Override
        public Movie mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new Movie(rs.getInt("MOVIE_ID"), rs.getString("TITLE"));
        }
    }
}

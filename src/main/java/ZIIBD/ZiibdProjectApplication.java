package ZIIBD;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
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
        String sql = "SELECT * FROM employees";
        List<Employee> employees = jdbcTemplate.query(sql, new EmployeeRowMapper());
        
        employees.forEach(System.out::println);
    }

    static class Employee {
        private int id;
        private String name;
        private String job;

        public Employee(int id, String name, String job) {
            this.id = id;
            this.name = name;
            this.job = job;
        }

        @Override
        public String toString() {
            return "Employee{id=" + id + ", name='" + name + "', job='" + job + "'}";
        }
    }

    static class EmployeeRowMapper implements RowMapper<Employee> {
        @Override
        public Employee mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new Employee(rs.getInt("id"), rs.getString("name"), rs.getString("job"));
        }
    }
}

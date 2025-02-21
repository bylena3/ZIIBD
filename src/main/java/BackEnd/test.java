package BackEnd;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class test {

    @GetMapping("/kr")
    public String sayHello() {
        return "kr";
    }


}





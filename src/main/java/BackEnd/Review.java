package BackEnd;

import lombok.Data;

@Data
public class Review {
    private String author;
    private Integer score;
    private Integer seriesId;
    private String content;
    private Integer movieId;

}

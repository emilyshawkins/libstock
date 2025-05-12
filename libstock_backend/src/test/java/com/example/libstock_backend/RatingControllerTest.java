package com.example.libstock_backend;

import com.example.libstock_backend.Controllers.RatingController;
import com.example.libstock_backend.Models.Book;
import com.example.libstock_backend.Models.Rating;
import com.example.libstock_backend.Models.User;
import com.example.libstock_backend.Repositories.BookRepository;
import com.example.libstock_backend.Repositories.RatingRepository;
import com.example.libstock_backend.Repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.*;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class RatingControllerTest {

    private MockMvc mockMvc;

    @Mock
    private RatingRepository ratingRepository;

    @Mock
    private BookRepository bookRepository;

    @Mock
    private UserRepository userRepository;

    private RatingController ratingController;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        ratingController = new RatingController();
        ratingController.ratingRepository = ratingRepository;
        ratingController.bookRepository = bookRepository;
        ratingController.userRepository = userRepository;
        mockMvc = MockMvcBuilders.standaloneSetup(ratingController).build();
    }

    // Test for create_rating
    @Test
    public void testCreateRating_Success() throws Exception {
        Rating rating = new Rating();
        rating.setUserId("1");
        rating.setBookId("1");
        rating.setStars(5);
        rating.setComment("Great book!");

        when(userRepository.findById("1")).thenReturn(java.util.Optional.of(new User()));
        when(bookRepository.findById("1")).thenReturn(java.util.Optional.of(new Book()));
        when(ratingRepository.findByUserIdAndBookId("1", "1")).thenReturn(null);
        when(ratingRepository.save(any(Rating.class))).thenReturn(rating);

        mockMvc.perform(post("/rating/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userId\": \"1\", \"bookId\": \"1\", \"stars\": 5, \"comment\": \"Great book!\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.stars").value(5))
                .andExpect(jsonPath("$.comment").value("Great book!"));

        verify(ratingRepository, times(1)).save(any(Rating.class));
    }

    @Test
    public void testCreateRating_MissingUserIdOrBookId() throws Exception {
        mockMvc.perform(post("/rating/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userId\": null, \"bookId\": null, \"stars\": 5}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("User ID and Book ID are required fields."));
    }

    @Test
    public void testCreateRating_UserNotFound() throws Exception {
        Rating rating = new Rating();
        rating.setUserId("1");
        rating.setBookId("1");
        rating.setStars(5);
        rating.setComment("Great book!");

        when(userRepository.findById("1")).thenReturn(java.util.Optional.empty());

        mockMvc.perform(post("/rating/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userId\": \"1\", \"bookId\": \"1\", \"stars\": 5, \"comment\": \"Great book!\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("User does not exist."));
    }

    @Test
    public void testCreateRating_BookNotFound() throws Exception {
        Rating rating = new Rating();
        rating.setUserId("1");
        rating.setBookId("1");
        rating.setStars(5);
        rating.setComment("Great book!");

        when(userRepository.findById("1")).thenReturn(java.util.Optional.of(new User()));
        when(bookRepository.findById("1")).thenReturn(java.util.Optional.empty());

        mockMvc.perform(post("/rating/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userId\": \"1\", \"bookId\": \"1\", \"stars\": 5, \"comment\": \"Great book!\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Book does not exist."));
    }

    @Test
    public void testCreateRating_StarsOutOfRange() throws Exception {
        when(userRepository.findById("1")).thenReturn(java.util.Optional.of(new User()));
        when(bookRepository.findById("1")).thenReturn(java.util.Optional.of(new Book()));
        mockMvc.perform(post("/rating/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userId\": \"1\", \"bookId\": \"1\", \"stars\": 6, \"comment\": \"Great book!\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Stars must be between 1 and 5."));
    }

    @Test
    public void testCreateRating_RatingExists() throws Exception {
        Rating existingRating = new Rating();
        existingRating.setUserId("1");
        existingRating.setBookId("1");

        when(userRepository.findById("1")).thenReturn(java.util.Optional.of(new User()));
        when(bookRepository.findById("1")).thenReturn(java.util.Optional.of(new Book()));
        when(ratingRepository.findByUserIdAndBookId("1", "1")).thenReturn(existingRating);

        mockMvc.perform(post("/rating/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userId\": \"1\", \"bookId\": \"1\", \"stars\": 5, \"comment\": \"Great book!\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Rating already exists."));
    }

    // Test for read_rating
    @Test
    public void testReadRating_Success() throws Exception {
        Rating rating = new Rating();
        rating.setId("1");
        rating.setUserId("1");
        rating.setBookId("1");
        rating.setStars(5);
        rating.setComment("Great book!");

        when(ratingRepository.findById("1")).thenReturn(java.util.Optional.of(rating));

        mockMvc.perform(get("/rating/read")
                .param("id", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.stars").value(5))
                .andExpect(jsonPath("$.comment").value("Great book!"));
    }

    @Test
    public void testReadRating_NotFound() throws Exception {
        when(ratingRepository.findById("1")).thenReturn(java.util.Optional.empty());

        mockMvc.perform(get("/rating/read")
                .param("id", "1"))
                .andExpect(status().isNotFound());
    }

    // Test for update_rating
    @Test
    public void testUpdateRating_Success() throws Exception {
        Rating existingRating = new Rating();
        existingRating.setId("1");
        existingRating.setStars(4);
        existingRating.setComment("Good book.");

        Rating updatedRating = new Rating();
        updatedRating.setId("1");
        updatedRating.setStars(5);
        updatedRating.setComment("Great book!");

        when(ratingRepository.findById("1")).thenReturn(java.util.Optional.of(existingRating));
        when(ratingRepository.save(any(Rating.class))).thenReturn(updatedRating);

        mockMvc.perform(patch("/rating/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"id\": \"1\", \"stars\": 5, \"comment\": \"Great book!\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.stars").value(5))
                .andExpect(jsonPath("$.comment").value("Great book!"));
    }

    @Test
    public void testUpdateRating_NotFound() throws Exception {
        when(ratingRepository.findById("1")).thenReturn(java.util.Optional.empty());

        mockMvc.perform(patch("/rating/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"id\": \"1\", \"stars\": 5, \"comment\": \"Great book!\"}"))
                .andExpect(status().isNotFound());
    }

    // Test for delete_rating
    @Test
    public void testDeleteRating_Success() throws Exception {
        Rating rating = new Rating();
        rating.setId("1");
        rating.setStars(5);
        rating.setComment("Great book!");

        when(ratingRepository.findById("1")).thenReturn(java.util.Optional.of(rating));
        doNothing().when(ratingRepository).delete(rating);

        mockMvc.perform(delete("/rating/delete")
                .param("id", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.stars").value(5))
                .andExpect(jsonPath("$.comment").value("Great book!"));

        verify(ratingRepository, times(1)).delete(rating);
    }

    @Test
    public void testDeleteRating_NotFound() throws Exception {
        when(ratingRepository.findById("1")).thenReturn(java.util.Optional.empty());

        mockMvc.perform(delete("/rating/delete")
                .param("id", "1"))
                .andExpect(status().isNotFound());
    }

    // Test for get_ratings_by_user
    @Test
    public void testGetRatingsByUser_Success() throws Exception {
        Rating rating = new Rating();
        rating.setId("1");
        rating.setStars(5);
        rating.setComment("Great book!");

        when(ratingRepository.findByUserId("1")).thenReturn(java.util.List.of(rating));

        mockMvc.perform(get("/rating/get_ratings_by_user")
                .param("userId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].stars").value(5))
                .andExpect(jsonPath("$[0].comment").value("Great book!"));
    }

    // Test for get_ratings_by_book
    @Test
    public void testGetRatingsByBook_Success() throws Exception {
        Rating rating = new Rating();
        rating.setId("1");
        rating.setStars(5);
        rating.setComment("Great book!");

        when(ratingRepository.findByBookId("1")).thenReturn(java.util.List.of(rating));

        mockMvc.perform(get("/rating/get_ratings_by_book")
                .param("bookId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].stars").value(5))
                .andExpect(jsonPath("$[0].comment").value("Great book!"));
    }
}

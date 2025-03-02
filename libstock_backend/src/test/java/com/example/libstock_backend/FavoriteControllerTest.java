package com.example.libstock_backend;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.test.web.servlet.*;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.example.libstock_backend.Controllers.FavoriteController;
import com.example.libstock_backend.Models.Favorite;
import com.example.libstock_backend.Models.User;
import com.example.libstock_backend.Models.Book;
import com.example.libstock_backend.Repositories.FavoriteRepository;
import com.example.libstock_backend.Repositories.BookRepository;
import com.example.libstock_backend.Repositories.UserRepository;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;

public class FavoriteControllerTest {

    private MockMvc mockMvc;

    @Mock
    private FavoriteRepository favoriteRepository;

    @Mock
    private BookRepository bookRepository;

    @Mock
    private UserRepository userRepository;

    private FavoriteController favoriteController;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        favoriteController = new FavoriteController();
        favoriteController.favoriteRepository = favoriteRepository;
        favoriteController.bookRepository = bookRepository;
        favoriteController.userRepository = userRepository;
        mockMvc = MockMvcBuilders.standaloneSetup(favoriteController).build();
    }

    // Test for create_favorite
    @Test
    public void testCreateFavorite_Success() throws Exception {
        Favorite favorite = new Favorite();
        favorite.setUserId("1");
        favorite.setBookId("1");

        Book book = new Book();
        book.setId("1");

        User user = new User();
        user.setId("1");

        when(bookRepository.findById("1")).thenReturn(java.util.Optional.of(book));
        when(userRepository.findById("1")).thenReturn(java.util.Optional.of(user));
        when(favoriteRepository.findByUserIdAndBookId("1", "1")).thenReturn(null);
        when(favoriteRepository.save(any(Favorite.class))).thenReturn(favorite);

        mockMvc.perform(post("/favorite/create")
                .contentType("application/json")
                .content("{\"userId\": \"1\", \"bookId\": \"1\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value("1"))
                .andExpect(jsonPath("$.bookId").value("1"));

        verify(favoriteRepository, times(1)).save(any(Favorite.class));
    }

    @Test
    public void testCreateFavorite_UserNotFound() throws Exception {

        when(bookRepository.findById("1")).thenReturn(java.util.Optional.of(new Book()));
        when(userRepository.findById("1")).thenReturn(java.util.Optional.empty());

        mockMvc.perform(post("/favorite/create")
                .contentType("application/json")
                .content("{\"userId\": \"1\", \"bookId\": \"1\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("User not found."));
    }

    @Test
    public void testCreateFavorite_BookNotFound() throws Exception {
        User user = new User();
        user.setId("1");

        when(userRepository.findById("1")).thenReturn(java.util.Optional.of(user));
        when(bookRepository.findById("1")).thenReturn(java.util.Optional.empty());

        mockMvc.perform(post("/favorite/create")
                .contentType("application/json")
                .content("{\"userId\": \"1\", \"bookId\": \"1\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Book not found."));
    }

    @Test
    public void testCreateFavorite_FavoriteAlreadyExists() throws Exception {
        when(userRepository.findById("1")).thenReturn(java.util.Optional.of(new User()));
        when(bookRepository.findById("1")).thenReturn(java.util.Optional.of(new Book()));
        when(favoriteRepository.findByUserIdAndBookId("1", "1")).thenReturn(new Favorite());

        mockMvc.perform(post("/favorite/create")
                .contentType("application/json")
                .content("{\"userId\": \"1\", \"bookId\": \"1\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Favorite already exists."));
    }

    // Test for read_favorite
    @Test
    public void testReadFavorite_Success() throws Exception {
        Favorite favorite = new Favorite();
        favorite.setId("1");
        favorite.setUserId("1");
        favorite.setBookId("1");

        when(favoriteRepository.findById("1")).thenReturn(java.util.Optional.of(favorite));

        mockMvc.perform(get("/favorite/read")
                .param("id", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value("1"))
                .andExpect(jsonPath("$.bookId").value("1"));
    }

    @Test
    public void testReadFavorite_NotFound() throws Exception {
        when(favoriteRepository.findById("1")).thenReturn(java.util.Optional.empty());

        mockMvc.perform(get("/favorite/read")
                .param("id", "1"))
                .andExpect(status().isNotFound());
    }

    // Test for update_favorite
    @Test
    public void testUpdateFavorite_Success() throws Exception {
        Favorite existingFavorite = new Favorite();
        existingFavorite.setId("1");
        existingFavorite.setUserId("1");
        existingFavorite.setBookId("1");

        Favorite updatedFavorite = new Favorite();
        updatedFavorite.setId("1");
        updatedFavorite.setUserId("1");
        updatedFavorite.setBookId("2");

        when(favoriteRepository.findById("1")).thenReturn(java.util.Optional.of(existingFavorite));
        when(favoriteRepository.save(any(Favorite.class))).thenReturn(updatedFavorite);

        mockMvc.perform(patch("/favorite/update")
                .contentType("application/json")
                .content("{\"id\": \"1\", \"userId\": \"1\", \"bookId\": \"2\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value("1"))
                .andExpect(jsonPath("$.bookId").value("2"));

        verify(favoriteRepository, times(1)).save(any(Favorite.class));
    }

    @Test
    public void testUpdateFavorite_NotFound() throws Exception {
        when(favoriteRepository.findById("1")).thenReturn(java.util.Optional.empty());

        mockMvc.perform(patch("/favorite/update")
                .contentType("application/json")
                .content("{\"id\": \"1\", \"userId\": \"1\", \"bookId\": \"2\"}"))
                .andExpect(status().isNotFound());
    }

    // Test for delete_favorite_by_ids
    @Test
    public void testDeleteFavorite_Success() throws Exception {
        Favorite favorite = new Favorite();
        favorite.setUserId("1");
        favorite.setBookId("1");

        when(favoriteRepository.findByUserIdAndBookId("1", "1")).thenReturn(favorite);
        doNothing().when(favoriteRepository).delete(favorite);

        mockMvc.perform(delete("/favorite/delete")
                .param("userId", "1")
                .param("bookId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value("1"))
                .andExpect(jsonPath("$.bookId").value("1"));

        verify(favoriteRepository, times(1)).delete(favorite);
    }

    @Test
    public void testDeleteFavorite_NotFound() throws Exception {
        when(favoriteRepository.findByUserIdAndBookId("1", "1")).thenReturn(null);

        mockMvc.perform(delete("/favorite/delete")
                .param("userId", "1")
                .param("bookId", "1"))
                .andExpect(status().isNotFound());
    }

    // Test for get_favorites_by_user
    @Test
    public void testGetFavoritesByUser_Success() throws Exception {
        Favorite favorite = new Favorite();
        favorite.setId("1");
        favorite.setUserId("1");
        favorite.setBookId("1");

        Book book = new Book();
        book.setId("1");

        when(favoriteRepository.findByUserId("1")).thenReturn(List.of(favorite));
        when(bookRepository.findById("1")).thenReturn(java.util.Optional.of(book));

        mockMvc.perform(get("/favorite/get_favorites_by_user")
                .param("userId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("1"));
    }
}

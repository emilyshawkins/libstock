package com.example.libstock_backend;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.test.web.servlet.*;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.example.libstock_backend.Controllers.GenreController;
import com.example.libstock_backend.Models.Genre;
import com.example.libstock_backend.Repositories.GenreRepository;
import com.example.libstock_backend.Repositories.BookGenreRepository;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class GenreControllerTest {

    private MockMvc mockMvc;

    @Mock
    private GenreRepository genreRepository;

    @Mock
    private BookGenreRepository bookGenreRepository;

    private GenreController genreController;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        genreController = new GenreController();
        genreController.genreRepository = genreRepository;
        genreController.bookGenreRepository = bookGenreRepository;
        mockMvc = MockMvcBuilders.standaloneSetup(genreController).build();
    }

    // Test for create_genre
    @Test
    public void testCreateGenre_Success() throws Exception {
        Genre genre = new Genre();
        genre.setName("Fiction");

        when(genreRepository.findByName("Fiction")).thenReturn(null);
        when(genreRepository.save(any(Genre.class))).thenReturn(genre);

        mockMvc.perform(post("/genre/create")
                .contentType("application/json")
                .content("{\"name\": \"Fiction\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Fiction"));

        verify(genreRepository, times(1)).save(any(Genre.class));
    }

    @Test
    public void testCreateGenre_NameRequired() throws Exception {
        mockMvc.perform(post("/genre/create")
                .contentType("application/json")
                .content("{\"name\": null}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Name is required"));
    }

    @Test
    public void testCreateGenre_AlreadyExists() throws Exception {
        Genre existingGenre = new Genre();
        existingGenre.setName("Fiction");

        when(genreRepository.findByName("Fiction")).thenReturn(existingGenre);

        mockMvc.perform(post("/genre/create")
                .contentType("application/json")
                .content("{\"name\": \"Fiction\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Genre already exists"));
    }

    // Test for read_genre
    @Test
    public void testReadGenre_Success() throws Exception {
        Genre genre = new Genre();
        genre.setId("1");
        genre.setName("Fiction");

        when(genreRepository.findById("1")).thenReturn(java.util.Optional.of(genre));

        mockMvc.perform(get("/genre/read")
                .param("id", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Fiction"));
    }

    @Test
    public void testReadGenre_NotFound() throws Exception {
        when(genreRepository.findById("1")).thenReturn(java.util.Optional.empty());

        mockMvc.perform(get("/genre/read")
                .param("id", "1"))
                .andExpect(status().isNotFound());
    }

    // Test for update_genre
    @Test
    public void testUpdateGenre_Success() throws Exception {
        Genre existingGenre = new Genre();
        existingGenre.setId("1");
        existingGenre.setName("Fiction");

        Genre updatedGenre = new Genre();
        updatedGenre.setId("1");
        updatedGenre.setName("Science Fiction");

        when(genreRepository.findById("1")).thenReturn(java.util.Optional.of(existingGenre));
        when(genreRepository.save(any(Genre.class))).thenReturn(updatedGenre);

        mockMvc.perform(patch("/genre/update")
                .contentType("application/json")
                .content("{\"id\": \"1\", \"name\": \"Science Fiction\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Science Fiction"));

        verify(genreRepository, times(1)).save(any(Genre.class));
    }

    @Test
    public void testUpdateGenre_NotFound() throws Exception {
        when(genreRepository.findById("1")).thenReturn(java.util.Optional.empty());

        mockMvc.perform(patch("/genre/update")
                .contentType("application/json")
                .content("{\"id\": \"1\", \"name\": \"Science Fiction\"}"))
                .andExpect(status().isNotFound());
    }

    // Test for delete_genre
    @Test
    public void testDeleteGenre_Success() throws Exception {
        Genre genre = new Genre();
        genre.setId("1");
        genre.setName("Fiction");

        when(genreRepository.findById("1")).thenReturn(java.util.Optional.of(genre));
        doNothing().when(bookGenreRepository).deleteAllByGenreId("1");
        doNothing().when(genreRepository).delete(genre);

        mockMvc.perform(delete("/genre/delete")
                .param("id", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Fiction"));

        verify(genreRepository, times(1)).delete(genre);
        verify(bookGenreRepository, times(1)).deleteAllByGenreId("1");
    }

    @Test
    public void testDeleteGenre_NotFound() throws Exception {
        when(genreRepository.findById("1")).thenReturn(java.util.Optional.empty());

        mockMvc.perform(delete("/genre/delete")
                .param("id", "1"))
                .andExpect(status().isNotFound());
    }

    // Test for get_all_genres
    @Test
    public void testGetAllGenres_Success() throws Exception {
        Genre genre = new Genre();
        genre.setId("1");
        genre.setName("Fiction");

        when(genreRepository.findAll()).thenReturn(java.util.List.of(genre));

        mockMvc.perform(get("/genre/get_all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Fiction"));
    }
}

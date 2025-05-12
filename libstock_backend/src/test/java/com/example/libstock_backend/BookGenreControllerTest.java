package com.example.libstock_backend;

import com.example.libstock_backend.Controllers.BookGenreController;
import com.example.libstock_backend.Models.Book;
import com.example.libstock_backend.Models.BookGenre;
import com.example.libstock_backend.Models.Genre;
import com.example.libstock_backend.Repositories.BookGenreRepository;
import com.example.libstock_backend.Repositories.BookRepository;
import com.example.libstock_backend.Repositories.GenreRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class BookGenreControllerTest {

    private MockMvc mockMvc;

    @Mock
    private BookGenreRepository bookGenreRepository;

    @Mock
    private GenreRepository genreRepository;

    @Mock
    private BookRepository bookRepository;

    BookGenreController bookGenreController;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        bookGenreController = new BookGenreController();
        bookGenreController.bookgenreRepository = bookGenreRepository;
        bookGenreController.genreRepository = genreRepository;
        bookGenreController.bookRepository = bookRepository;
        mockMvc = MockMvcBuilders.standaloneSetup(bookGenreController).build();
    }

    @Test
    public void testCreateBookGenre_Success() throws Exception {
        BookGenre bookGenre = new BookGenre();
        bookGenre.setId("1");
        bookGenre.setBookId("book1");
        bookGenre.setGenreId("genre1");

        when(bookRepository.findById("book1")).thenReturn(java.util.Optional.of(new Book()));
        when(genreRepository.findById("genre1")).thenReturn(java.util.Optional.of(new Genre()));
        when(bookGenreRepository.findByGenreIdAndBookId("genre1", "book1")).thenReturn(null);
        when(bookGenreRepository.save(any(BookGenre.class))).thenReturn(bookGenre);

        mockMvc.perform(post("/bookgenre/create")
                .contentType("application/json")
                .content("{\"bookId\": \"book1\", \"genreId\": \"genre1\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bookId").value("book1"))
                .andExpect(jsonPath("$.genreId").value("genre1"));

        verify(bookGenreRepository, times(1)).save(any(BookGenre.class));
    }

    @Test
    public void testCreateBookGenre_MissingBookId() throws Exception {
        mockMvc.perform(post("/bookgenre/create")
                .contentType("application/json")
                .content("{\"genreId\": \"genre1\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Genre ID and Book ID are required"));

        verify(bookGenreRepository, times(0)).save(any(BookGenre.class));
    }

    @Test
    public void testCreateBookGenre_NonExistingBook() throws Exception {
        when(bookRepository.findById("book1")).thenReturn(java.util.Optional.empty());
        when(genreRepository.findById("genre1")).thenReturn(java.util.Optional.of(new Genre()));

        mockMvc.perform(post("/bookgenre/create")
                .contentType("application/json")
                .content("{\"bookId\": \"book1\", \"genreId\": \"genre1\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Book does not exist"));

        verify(bookGenreRepository, times(0)).save(any(BookGenre.class));
    }

    @Test
    public void testReadBookGenre_Success() throws Exception {
        BookGenre bookGenre = new BookGenre();
        bookGenre.setId("1");
        bookGenre.setBookId("book1");
        bookGenre.setGenreId("genre1");

        when(bookGenreRepository.findById("1")).thenReturn(java.util.Optional.of(bookGenre));

        mockMvc.perform(get("/bookgenre/read")
                .param("id", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.bookId").value("book1"))
                .andExpect(jsonPath("$.genreId").value("genre1"));
    }

    @Test
    public void testUpdateBookGenre_Success() throws Exception {
        BookGenre existingBookGenre = new BookGenre();
        existingBookGenre.setId("1");
        existingBookGenre.setBookId("book1");
        existingBookGenre.setGenreId("genre1");

        when(bookGenreRepository.findById("1")).thenReturn(java.util.Optional.of(existingBookGenre));
        when(bookRepository.findById("book1")).thenReturn(java.util.Optional.of(new Book()));
        when(genreRepository.findById("genre1")).thenReturn(java.util.Optional.of(new Genre()));

        mockMvc.perform(patch("/bookgenre/update")
                .contentType("application/json")
                .content("{\"id\": \"1\", \"bookId\": \"book1\", \"genreId\": \"genre1\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.bookId").value("book1"))
                .andExpect(jsonPath("$.genreId").value("genre1"));

        verify(bookGenreRepository, times(1)).save(any(BookGenre.class));
    }

    @Test
    public void testDeleteBookGenre_Success() throws Exception {
        BookGenre existingBookGenre = new BookGenre();
        existingBookGenre.setId("1");
        existingBookGenre.setBookId("book1");
        existingBookGenre.setGenreId("genre1");

        when(bookGenreRepository.findById("1")).thenReturn(java.util.Optional.of(existingBookGenre));

        mockMvc.perform(delete("/bookgenre/delete")
                .param("id", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.bookId").value("book1"))
                .andExpect(jsonPath("$.genreId").value("genre1"));

                verify(bookGenreRepository, times(1)).delete(existingBookGenre);
    }

}

package com.example.libstock_backend;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.test.web.servlet.*;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.example.libstock_backend.Controllers.AuthorController;
import com.example.libstock_backend.Models.Author;
import com.example.libstock_backend.Repositories.AuthorRepository;
import com.example.libstock_backend.Repositories.BookAuthorRepository;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;

public class AuthorControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AuthorRepository authorRepository;

    @Mock
    private BookAuthorRepository bookAuthorRepository;

    private AuthorController authorController;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        authorController = new AuthorController();
        authorController.authorRepository = authorRepository;
        authorController.bookAuthorRepository = bookAuthorRepository;
        mockMvc = MockMvcBuilders.standaloneSetup(authorController).build();
    }

    // Test for create_author
    @Test
    public void testCreateAuthor_Success() throws Exception {
        Author author = new Author();
        author.setFirstName("John");
        author.setLastName("Doe");

        when(authorRepository.save(any(Author.class))).thenReturn(author);

        mockMvc.perform(post("/author/create")
                .contentType("application/json")
                .content("{\"firstName\": \"John\", \"lastName\": \"Doe\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.lastName").value("Doe"));

        verify(authorRepository, times(1)).save(any(Author.class));
    }

    @Test
    public void testCreateAuthor_FirstNameBlank() throws Exception {
        mockMvc.perform(post("/author/create")
                .contentType("application/json")
                .content("{\"firstName\": \"\", \"lastName\": \"Doe\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("First name must not be blank."));
    }

    // Test for read_author
    @Test
    public void testReadAuthor_Success() throws Exception {
        Author author = new Author();
        author.setId("1");
        author.setFirstName("John");
        author.setLastName("Doe");

        when(authorRepository.findById("1")).thenReturn(java.util.Optional.of(author));

        mockMvc.perform(get("/author/read")
                .param("id", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.lastName").value("Doe"));
    }

    @Test
    public void testReadAuthor_NotFound() throws Exception {
        when(authorRepository.findById("1")).thenReturn(java.util.Optional.empty());

        mockMvc.perform(get("/author/read")
                .param("id", "1"))
                .andExpect(status().isNotFound());
    }

    // Test for update_author
    @Test
    public void testUpdateAuthor_Success() throws Exception {
        Author existingAuthor = new Author();
        existingAuthor.setId("1");
        existingAuthor.setFirstName("John");
        existingAuthor.setLastName("Doe");

        Author updatedAuthor = new Author();
        updatedAuthor.setId("1");
        updatedAuthor.setFirstName("Updated John");
        updatedAuthor.setLastName("Updated Doe");

        when(authorRepository.findById("1")).thenReturn(java.util.Optional.of(existingAuthor));
        when(authorRepository.save(any(Author.class))).thenReturn(updatedAuthor);

        mockMvc.perform(patch("/author/update")
                .contentType("application/json")
                .content("{\"id\": \"1\", \"firstName\": \"Updated John\", \"lastName\": \"Updated Doe\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("Updated John"))
                .andExpect(jsonPath("$.lastName").value("Updated Doe"));

        verify(authorRepository, times(1)).save(any(Author.class));
    }

    @Test
    public void testUpdateAuthor_NotFound() throws Exception {
        Author updatedAuthor = new Author();
        updatedAuthor.setId("1");
        updatedAuthor.setFirstName("Updated John");

        when(authorRepository.findById("1")).thenReturn(java.util.Optional.empty());

        mockMvc.perform(patch("/author/update")
                .contentType("application/json")
                .content("{\"id\": \"1\", \"firstName\": \"Updated John\"}"))
                .andExpect(status().isNotFound());
    }

    // Test for delete_author
    @Test
    public void testDeleteAuthor_Success() throws Exception {
        Author author = new Author();
        author.setId("1");
        author.setFirstName("John");
        author.setLastName("Doe");

        when(authorRepository.findById("1")).thenReturn(java.util.Optional.of(author));
        doNothing().when(bookAuthorRepository).deleteAllByAuthorId("1");

        mockMvc.perform(delete("/author/delete")
                .param("id", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.lastName").value("Doe"));

        verify(authorRepository, times(1)).delete(author);
        verify(bookAuthorRepository, times(1)).deleteAllByAuthorId("1");
    }

    @Test
    public void testDeleteAuthor_NotFound() throws Exception {
        when(authorRepository.findById("1")).thenReturn(java.util.Optional.empty());

        mockMvc.perform(delete("/author/delete")
                .param("id", "1"))
                .andExpect(status().isNotFound());
    }

    // Test for get_all_authors
    @Test
    public void testGetAllAuthors_Success() throws Exception {
        Author author1 = new Author();
        author1.setId("1");
        author1.setFirstName("John");
        author1.setLastName("Doe");

        Author author2 = new Author();
        author2.setId("2");
        author2.setFirstName("Jane");
        author2.setLastName("Doe");

        List<Author> authors = List.of(author1, author2);
        when(authorRepository.findAll()).thenReturn(authors);

        mockMvc.perform(get("/author/get_all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].firstName").value("John"))
                .andExpect(jsonPath("$[1].firstName").value("Jane"));
    }
}

package com.example.libstock_backend;

import com.example.libstock_backend.Controllers.BookAuthorController;
import com.example.libstock_backend.Models.Author;
import com.example.libstock_backend.Models.Book;
import com.example.libstock_backend.Models.BookAuthor;
import com.example.libstock_backend.Repositories.AuthorRepository;
import com.example.libstock_backend.Repositories.BookAuthorRepository;
import com.example.libstock_backend.Repositories.BookRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;

public class BookAuthorControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Mock
    private BookAuthorRepository bookAuthorRepository;

    @Mock
    private BookRepository bookRepository;

    @Mock
    private AuthorRepository authorRepository;

    BookAuthorController bookAuthorController;

    private Author author;
    private Book book;
    private BookAuthor bookAuthor;

    @BeforeEach
    public void setUp() {
        author = new Author();
        author.setId("1");
        author.setFirstName("John");
        author.setLastName("Doe");

        book = new Book();
        book.setId("1");
        book.setTitle("Sample Book");

        bookAuthor = new BookAuthor();
        bookAuthor.setId("1");
        bookAuthor.setAuthorId(author.getId());
        bookAuthor.setBookId(book.getId());

        MockitoAnnotations.openMocks(this);
        bookAuthorController = new BookAuthorController();
        bookAuthorController.authorRepository = authorRepository;
        bookAuthorController.bookauthorRepository = bookAuthorRepository;
        bookAuthorController.bookRepository = bookRepository;
        mockMvc = MockMvcBuilders.standaloneSetup(bookAuthorController).build();
    }

    // Test create_bookauthor endpoint
    @Test
    public void testCreateBookAuthor_Success() throws Exception {
        when(authorRepository.findById(author.getId())).thenReturn(java.util.Optional.of(author));
        when(bookRepository.findById(book.getId())).thenReturn(java.util.Optional.of(book));
        when(bookAuthorRepository.findByAuthorIdAndBookId(author.getId(), book.getId())).thenReturn(null);
        when(bookAuthorRepository.save(any(BookAuthor.class))).thenReturn(bookAuthor);

        mockMvc.perform(post("/bookauthor/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"authorId\": \"1\", \"bookId\": \"1\"}"))
                .andExpect(status().isOk());

        verify(bookAuthorRepository, times(1)).save(any(BookAuthor.class));
    }

    @Test
    public void testCreateBookAuthor_BadRequest_MissingAuthorId() throws Exception {
        mockMvc.perform(post("/bookauthor/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"bookId\": \"1\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Author ID and Book ID are required."));
    }

    @Test
    public void testCreateBookAuthor_BadRequest_AuthorDoesNotExist() throws Exception {
        when(authorRepository.findById(author.getId())).thenReturn(java.util.Optional.empty());

        mockMvc.perform(post("/bookauthor/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"authorId\": \"1\", \"bookId\": \"1\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Author does not exist."));
    }

    @Test
    public void testCreateBookAuthor_BadRequest_BookDoesNotExist() throws Exception {
        when(authorRepository.findById(author.getId())).thenReturn(java.util.Optional.of(author));
        when(bookRepository.findById(book.getId())).thenReturn(java.util.Optional.empty());

        mockMvc.perform(post("/bookauthor/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"authorId\": \"1\", \"bookId\": \"1\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Book does not exist."));
    }

    @Test
    public void testCreateBookAuthor_BadRequest_AlreadyAssociated() throws Exception {
        when(authorRepository.findById(author.getId())).thenReturn(java.util.Optional.of(author));
        when(bookRepository.findById(book.getId())).thenReturn(java.util.Optional.of(book));
        when(bookAuthorRepository.findByAuthorIdAndBookId(author.getId(), book.getId())).thenReturn(bookAuthor);

        mockMvc.perform(post("/bookauthor/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"authorId\": \"1\", \"bookId\": \"1\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Book and author already associated."));
    }

    // Test read_bookauthor endpoint
    @Test
    public void testReadBookAuthor_Success() throws Exception {
        when(bookAuthorRepository.findById(bookAuthor.getId())).thenReturn(java.util.Optional.of(bookAuthor));

        mockMvc.perform(get("/bookauthor/read")
                .param("id", bookAuthor.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(bookAuthor.getId()))
                .andExpect(jsonPath("$.authorId").value(author.getId()))
                .andExpect(jsonPath("$.bookId").value(book.getId()));

        verify(bookAuthorRepository, times(1)).findById(bookAuthor.getId());
    }

    @Test
    public void testReadBookAuthor_NotFound() throws Exception {
        when(bookAuthorRepository.findById(bookAuthor.getId())).thenReturn(java.util.Optional.empty());

        mockMvc.perform(get("/bookauthor/read")
                .param("id", bookAuthor.getId()))
                .andExpect(status().isNotFound());
    }

    // Test update_bookauthor endpoint
    @Test
    public void testUpdateBookAuthor_Success() throws Exception {
        when(bookAuthorRepository.findById(bookAuthor.getId())).thenReturn(java.util.Optional.of(bookAuthor));
        when(bookAuthorRepository.save(any(BookAuthor.class))).thenReturn(bookAuthor);

        mockMvc.perform(patch("/bookauthor/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"id\": \"1\", \"authorId\": \"1\", \"bookId\": \"1\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(bookAuthor.getId()))
                .andExpect(jsonPath("$.authorId").value(author.getId()))
                .andExpect(jsonPath("$.bookId").value(book.getId()));

        verify(bookAuthorRepository, times(1)).save(any(BookAuthor.class));
    }

    @Test
    public void testUpdateBookAuthor_NotFound() throws Exception {
        when(bookAuthorRepository.findById(bookAuthor.getId())).thenReturn(java.util.Optional.empty());

        mockMvc.perform(patch("/bookauthor/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"id\": \"1\", \"authorId\": \"1\", \"bookId\": \"1\"}"))
                .andExpect(status().isNotFound());
    }

    // Test delete_bookauthor endpoint
    @Test
    public void testDeleteBookAuthor_Success() throws Exception {
        when(bookAuthorRepository.findById(bookAuthor.getId())).thenReturn(java.util.Optional.of(bookAuthor));

        mockMvc.perform(delete("/bookauthor/delete")
                .param("id", bookAuthor.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(bookAuthor.getId()));

        verify(bookAuthorRepository, times(1)).delete(bookAuthor);
    }

    @Test
    public void testDeleteBookAuthor_NotFound() throws Exception {
        when(bookAuthorRepository.findById(bookAuthor.getId())).thenReturn(java.util.Optional.empty());

        mockMvc.perform(delete("/bookauthor/delete")
                .param("id", bookAuthor.getId()))
                .andExpect(status().isNotFound());
    }

    // Test get_books_by_author endpoint
    @Test
    public void testGetBooksByAuthor_Success() throws Exception {
        when(bookAuthorRepository.findByAuthorId(author.getId())).thenReturn(List.of(bookAuthor));
        when(bookRepository.findById(book.getId())).thenReturn(java.util.Optional.of(book));

        mockMvc.perform(get("/bookauthor/get_books_by_author")
                .param("authorId", author.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(book.getId()))
                .andExpect(jsonPath("$[0].title").value(book.getTitle()));
    }

    // Test get_authors_by_book endpoint
    @Test
    public void testGetAuthorsByBook_Success() throws Exception {
        when(bookAuthorRepository.findByBookId(book.getId())).thenReturn(List.of(bookAuthor));
        when(authorRepository.findById(author.getId())).thenReturn(java.util.Optional.of(author));

        mockMvc.perform(get("/bookauthor/get_authors_by_book")
                .param("bookId", book.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(author.getId()))
                .andExpect(jsonPath("$[0].firstName").value(author.getFirstName()))
                .andExpect(jsonPath("$[0].lastName").value(author.getLastName()));
    }

    // Test get_genre_ids endpoint
    @Test
    public void testGetBookAuthorIds_Success() throws Exception {
        when(bookAuthorRepository.findByBookId(book.getId())).thenReturn(List.of(bookAuthor));

        mockMvc.perform(get("/bookauthor/get_ids")
                .param("bookId", book.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").value(bookAuthor.getId()));
    }
}

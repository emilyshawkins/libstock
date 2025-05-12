package com.example.libstock_backend;

import com.example.libstock_backend.Controllers.BookController;
import com.example.libstock_backend.Models.Book;
import com.example.libstock_backend.Repositories.BookAuthorRepository;
import com.example.libstock_backend.Repositories.BookGenreRepository;
import com.example.libstock_backend.Repositories.BookRepository;
import com.example.libstock_backend.Repositories.CheckoutRepository;
import com.example.libstock_backend.Repositories.FavoriteRepository;
import com.example.libstock_backend.Repositories.QueueRepository;
import com.example.libstock_backend.Repositories.RatingRepository;
import com.example.libstock_backend.Repositories.WishlistItemRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.math.BigDecimal;

public class BookControllerTest {

    private MockMvc mockMvc;

    @Mock
    private BookRepository bookRepository;

    @Mock
    private BookAuthorRepository bookAuthorRepository;
    
    @Mock
    private BookGenreRepository bookGenreRepository;

    @Mock
    private CheckoutRepository checkoutRepository;

    @Mock
    private FavoriteRepository favoriteRepository;

    @Mock
    private QueueRepository queueRepository;

    @Mock
    private RatingRepository ratingRepository;

    @Mock
    private WishlistItemRepository wishlistItemRepository;
    
    private BookController bookController;

    private Book testBook;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        bookController = new BookController();
        bookController.BookRepository = bookRepository;
        bookController.BookAuthorRepository = bookAuthorRepository;
        bookController.BookGenreRepository = bookGenreRepository;
        bookController.CheckoutRepository = checkoutRepository;
        bookController.FavoriteRepository = favoriteRepository;
        bookController.QueueRepository = queueRepository;
        bookController.RatingRepository = ratingRepository;
        bookController.WishlistItemRepository = wishlistItemRepository;
        mockMvc = MockMvcBuilders.standaloneSetup(bookController).build();

        // Prepare a test book
        testBook = new Book();
        testBook.setId("1");
        testBook.setISBN("1234567890");
        testBook.setTitle("Test Book");
        testBook.setSummary("Test summary");
        testBook.setPublicationDate("2025-01-01");
        testBook.setPrice(new BigDecimal("19.99"));
        testBook.setPurchasable(true);
        testBook.setCount(10);
        testBook.setNumCheckedOut(2);
        testBook.setCover(new byte[]{1, 2, 3, 4});
    }

    @Test
    public void testCreateBook_Success() throws Exception {
        // Mock the repository save method
        when(bookRepository.save(any(Book.class))).thenReturn(testBook);

        mockMvc.perform(post("/book/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"isbn\":\"1234567890\",\"title\":\"Test Book\",\"summary\":\"Test summary\",\"publicationDate\":\"2025-01-01\",\"price\":19.99,\"purchasable\":true,\"count\":10}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isbn").value("1234567890"))
                .andExpect(jsonPath("$.title").value("Test Book"));
    }

    @Test
    public void testCreateBook_ISBNAlreadyExists() throws Exception {
        when(bookRepository.findByISBN("1234567890")).thenReturn(testBook);

        mockMvc.perform(post("/book/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"isbn\":\"1234567890\",\"title\":\"Test Book\",\"summary\":\"Test summary\",\"publicationDate\":\"2025-01-01\",\"price\":19.99,\"purchasable\":true,\"count\":10}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("ISBN already exists"));
    }

    @Test
    public void testReadBook_Success() throws Exception {
        when(bookRepository.findById("1")).thenReturn(java.util.Optional.of(testBook));

        mockMvc.perform(get("/book/read")
                .param("id", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Book"));
    }

    @Test
    public void testReadBook_NotFound() throws Exception {
        when(bookRepository.findById("1")).thenReturn(java.util.Optional.empty());

        mockMvc.perform(get("/book/read")
                .param("id", "1"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testUpdateBook_Success() throws Exception {
        when(bookRepository.findById("1")).thenReturn(java.util.Optional.of(testBook));
        when(bookRepository.save(any(Book.class))).thenReturn(testBook);

        mockMvc.perform(patch("/book/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"id\":\"1\",\"ISBN\":\"1234567890\",\"title\":\"Updated Book\",\"summary\":\"Updated summary\",\"publicationDate\":\"2025-01-01\",\"price\":19.99,\"purchasable\":true,\"count\":10}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Book"));
    }

    @Test
    public void testDeleteBook_Success() throws Exception {
        when(bookRepository.findById("1")).thenReturn(java.util.Optional.of(testBook));

        mockMvc.perform(delete("/book/delete")
                .param("id", "1"))
                .andExpect(status().isOk());
    }

    @Test
    public void testDeleteBook_NotFound() throws Exception {
        when(bookRepository.findById("1")).thenReturn(java.util.Optional.empty());

        mockMvc.perform(delete("/book/delete")
                .param("id", "1"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testGetAllBooks_Success() throws Exception {
        when(bookRepository.findAll()).thenReturn(java.util.List.of(testBook));

        mockMvc.perform(get("/book/get_all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Test Book"));
    }

 @Test
    public void testSetCover_Success() throws Exception {
        // Create a MockMultipartFile to simulate the file upload
        byte[] coverImage = new byte[]{1, 2, 3, 4}; // Sample image byte array
        MockMultipartFile coverFile = new MockMultipartFile(
            "cover", // Parameter name in the request
            "cover.jpg", // Original filename
            "image/jpeg", // Content type
            coverImage // File content
        );

        // Mock the BookRepository to return a testBook when findById is called
        when(bookRepository.findById("1")).thenReturn(java.util.Optional.of(testBook));

        // Perform the multipart request
        mockMvc.perform(multipart("/book/set_cover")
                .file(coverFile) // Attach the mock file
                .param("id", "1") // Include the book ID as a request parameter
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk());
    }

    @Test
    public void testGetCover_Success() throws Exception {
        when(bookRepository.findById("1")).thenReturn(java.util.Optional.of(testBook));

        mockMvc.perform(get("/book/get_cover")
                .param("id", "1"))
                .andExpect(status().isOk());
    }


}

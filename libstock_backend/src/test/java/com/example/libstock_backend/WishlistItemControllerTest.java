package com.example.libstock_backend;

import com.example.libstock_backend.Controllers.WishlistItemController;
import com.example.libstock_backend.Models.Book;
import com.example.libstock_backend.Models.User;
import com.example.libstock_backend.Models.WishlistItem;
import com.example.libstock_backend.Repositories.BookRepository;
import com.example.libstock_backend.Repositories.UserRepository;
import com.example.libstock_backend.Repositories.WishlistItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.*;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class WishlistItemControllerTest {

    private MockMvc mockMvc;

    @Mock
    private WishlistItemRepository wishlistItemRepository;

    @Mock
    private BookRepository bookRepository;

    @Mock
    private UserRepository userRepository;

    private WishlistItemController wishlistItemController;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        wishlistItemController = new WishlistItemController();
        wishlistItemController.wishlistItemRepository = wishlistItemRepository;
        wishlistItemController.bookRepository = bookRepository;
        wishlistItemController.userRepository = userRepository;
        mockMvc = MockMvcBuilders.standaloneSetup(wishlistItemController).build();
    }

    // Test for create_wishlist_item
    @Test
    public void testCreateWishlistItem_Success() throws Exception {
        WishlistItem wishlistItem = new WishlistItem();
        wishlistItem.setUserId("1");
        wishlistItem.setBookId("1");

        Book book = new Book();
        book.setId("1");

        when(bookRepository.findById("1")).thenReturn(Optional.of(book));
        when(userRepository.findById("1")).thenReturn(Optional.of(new User()));
        when(wishlistItemRepository.findByUserIdAndBookId("1", "1")).thenReturn(null);
        when(wishlistItemRepository.save(any(WishlistItem.class))).thenReturn(wishlistItem);

        mockMvc.perform(post("/wishlist/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userId\": \"1\", \"bookId\": \"1\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value("1"))
                .andExpect(jsonPath("$.bookId").value("1"));

        verify(wishlistItemRepository, times(1)).save(any(WishlistItem.class));
    }

    @Test
    public void testCreateWishlistItem_UserOrBookNotFound() throws Exception {
        mockMvc.perform(post("/wishlist/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userId\": null, \"bookId\": null}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("User ID and book ID are required."));
    }

    @Test
    public void testCreateWishlistItem_BookNotFound() throws Exception {
        when(bookRepository.findById("1")).thenReturn(Optional.empty());
        mockMvc.perform(post("/wishlist/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userId\": \"1\", \"bookId\": \"1\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Book not found."));
    }

    @Test
    public void testCreateWishlistItem_UserNotFound() throws Exception {
        when(bookRepository.findById("1")).thenReturn(Optional.of(new Book()));
        when(userRepository.findById("1")).thenReturn(Optional.empty());

        mockMvc.perform(post("/wishlist/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userId\": \"1\", \"bookId\": \"1\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("User not found."));
    }

    @Test
    public void testCreateWishlistItem_AlreadyExists() throws Exception {
        WishlistItem existingWishlistItem = new WishlistItem();
        existingWishlistItem.setUserId("1");
        existingWishlistItem.setBookId("1");

        when(bookRepository.findById("1")).thenReturn(Optional.of(new Book()));
        when(userRepository.findById("1")).thenReturn(Optional.of(new User()));
        when(wishlistItemRepository.findByUserIdAndBookId("1", "1")).thenReturn(existingWishlistItem);

        mockMvc.perform(post("/wishlist/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userId\": \"1\", \"bookId\": \"1\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Wishlist item already exists."));
    }

    // Test for read_wishlist_item
    @Test
    public void testReadWishlistItem_Success() throws Exception {
        WishlistItem wishlistItem = new WishlistItem();
        wishlistItem.setId("1");
        wishlistItem.setUserId("1");
        wishlistItem.setBookId("1");

        when(wishlistItemRepository.findById("1")).thenReturn(Optional.of(wishlistItem));

        mockMvc.perform(get("/wishlist/read")
                .param("id", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value("1"))
                .andExpect(jsonPath("$.bookId").value("1"));
    }

    @Test
    public void testReadWishlistItem_NotFound() throws Exception {
        when(wishlistItemRepository.findById("1")).thenReturn(Optional.empty());

        mockMvc.perform(get("/wishlist/read")
                .param("id", "1"))
                .andExpect(status().isNotFound());
    }

    // Test for update_wishlist_item
    @Test
    public void testUpdateWishlistItem_Success() throws Exception {
        WishlistItem existingWishlistItem = new WishlistItem();
        existingWishlistItem.setId("1");
        existingWishlistItem.setUserId("1");
        existingWishlistItem.setBookId("1");

        WishlistItem updatedWishlistItem = new WishlistItem();
        updatedWishlistItem.setId("1");
        updatedWishlistItem.setUserId("1");
        updatedWishlistItem.setBookId("2");

        when(wishlistItemRepository.findById("1")).thenReturn(Optional.of(existingWishlistItem));
        when(wishlistItemRepository.save(any(WishlistItem.class))).thenReturn(updatedWishlistItem);

        mockMvc.perform(patch("/wishlist/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"id\": \"1\", \"userId\": \"1\", \"bookId\": \"2\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value("1"))
                .andExpect(jsonPath("$.bookId").value("2"));
    }

    @Test
    public void testUpdateWishlistItem_NotFound() throws Exception {
        when(wishlistItemRepository.findById("1")).thenReturn(Optional.empty());

        mockMvc.perform(patch("/wishlist/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"id\": \"1\", \"userId\": \"1\", \"bookId\": \"2\"}"))
                .andExpect(status().isNotFound());
    }

    // Test for delete_wishlist_item
    @Test
    public void testDeleteWishlistItem_Success() throws Exception {
        WishlistItem wishlistItem = new WishlistItem();
        wishlistItem.setId("1");
        wishlistItem.setUserId("1");
        wishlistItem.setBookId("1");

        when(wishlistItemRepository.findByUserIdAndBookId("1", "1")).thenReturn(wishlistItem);
        doNothing().when(wishlistItemRepository).delete(wishlistItem);

        mockMvc.perform(delete("/wishlist/delete")
                .param("userId", "1")
                .param("bookId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value("1"))
                .andExpect(jsonPath("$.bookId").value("1"));

        verify(wishlistItemRepository, times(1)).delete(wishlistItem);
    }

    @Test
    public void testDeleteWishlistItem_NotFound() throws Exception {
        when(wishlistItemRepository.findByUserIdAndBookId("1", "1")).thenReturn(null);

        mockMvc.perform(delete("/wishlist/delete")
                .param("userId", "1")
                .param("bookId", "1"))
                .andExpect(status().isNotFound());
    }

    // Test for get_wishlist_by_user
    @Test
    public void testGetWishlistByUser_Success() throws Exception {
        WishlistItem wishlistItem = new WishlistItem();
        wishlistItem.setId("1");
        wishlistItem.setUserId("1");
        wishlistItem.setBookId("1");

        Book book = new Book();
        book.setId("1");

        User user = new User();
        user.setId("1");

        when(wishlistItemRepository.findByUserId("1")).thenReturn(List.of(wishlistItem));
        when(bookRepository.findById("1")).thenReturn(Optional.of(book));
        when(userRepository.findById("1")).thenReturn(Optional.of(user));

        mockMvc.perform(get("/wishlist/get_wishlist_by_user")
                .param("userId", "1"))
                .andExpect(status().isOk());
    }

    @Test
    public void testGetWishlistByUser_NoItems() throws Exception {
        when(wishlistItemRepository.findByUserId("1")).thenReturn(List.of());

        mockMvc.perform(get("/wishlist/get_wishlist_by_user")
                .param("userId", "1"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }
}

package com.example.libstock_backend;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.test.web.servlet.*;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.example.libstock_backend.Controllers.UserController;
import com.example.libstock_backend.DTOs.ProfileDTO;
import com.example.libstock_backend.Models.User;
import com.example.libstock_backend.Repositories.CheckoutRepository;
import com.example.libstock_backend.Repositories.FavoriteRepository;
import com.example.libstock_backend.Repositories.NotificationRepository;
import com.example.libstock_backend.Repositories.QueueRepository;
import com.example.libstock_backend.Repositories.RatingRepository;
import com.example.libstock_backend.Repositories.UserRepository;
import com.example.libstock_backend.Repositories.WishlistItemRepository;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class UserControllerTest {

    private MockMvc mockMvc;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CheckoutRepository checkoutRepository;

    @Mock
    private FavoriteRepository favoriteRepository;

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private QueueRepository queueRepository;

    @Mock
    private RatingRepository ratingRepository;

    @Mock
    private WishlistItemRepository wishlistItemRepository;

    private UserController userController;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        userController = new UserController();
        userController.userRepository = userRepository;
        userController.checkoutRepository = checkoutRepository;
        userController.favoriteRepository = favoriteRepository;
        userController.notificationRepository = notificationRepository;
        userController.queueRepository = queueRepository;
        userController.ratingRepository = ratingRepository;
        userController.wishlistItemRepository = wishlistItemRepository;
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
    }

    @Test
    public void testCreateAdmin_Success() throws Exception {
        User user = new User();
        user.setEmail("test@example.com");
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setPassword("password");

        when(userRepository.findByEmail(user.getEmail())).thenReturn(null);
        when(userRepository.save(any(User.class))).thenReturn(user);

        mockMvc.perform(post("/user/admin_signup")
                .contentType("application/json")
                .content("{\"email\": \"test@example.com\", \"firstName\": \"John\", \"lastName\": \"Doe\", \"password\": \"password\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(user.getEmail()));
    }

    @Test
    public void testCreateAdmin_EmailAlreadyExists() throws Exception {
        User existingUser = new User();
        existingUser.setEmail("test@example.com");

        when(userRepository.findByEmail(existingUser.getEmail())).thenReturn(existingUser);

        mockMvc.perform(post("/user/admin_signup")
                .contentType("application/json")
                .content("{\"email\": \"test@example.com\", \"firstName\": \"John\", \"lastName\": \"Doe\", \"password\": \"password\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Email already in use"));
    }

    @Test
    public void testCreateUser_Success() throws Exception {
        User user = new User();
        user.setEmail("user@example.com");
        user.setFirstName("Jane");
        user.setLastName("Doe");
        user.setPassword("password");

        when(userRepository.findByEmail(user.getEmail())).thenReturn(null);
        when(userRepository.save(any(User.class))).thenReturn(user);

        mockMvc.perform(post("/user/user_signup")
                .contentType("application/json")
                .content("{\"email\": \"user@example.com\", \"firstName\": \"Jane\", \"lastName\": \"Doe\", \"password\": \"password\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(user.getEmail()));
    }

    @Test
    public void testLogin_Success() throws Exception {
        User user = new User();
        user.setEmail("user@example.com");
        user.setPassword("password");

        when(userRepository.findByEmail(user.getEmail())).thenReturn(user);

        mockMvc.perform(post("/user/login")
                .contentType("application/json")
                .content("{\"email\": \"user@example.com\", \"password\": \"password\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(user.getEmail()));
    }

    @Test
    public void testLogin_UserNotFound() throws Exception {
        when(userRepository.findByEmail("user@example.com")).thenReturn(null);

        mockMvc.perform(post("/user/login")
                .contentType("application/json")
                .content("{\"email\": \"user@example.com\", \"password\": \"password\"}"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testGetUser_Success() throws Exception {
        User user = new User();
        user.setId("1");
        user.setEmail("user@example.com");
        user.setFirstName("John");
        user.setLastName("Doe");

        when(userRepository.findById("1")).thenReturn(java.util.Optional.of(user));

        mockMvc.perform(get("/user/get")
                .param("id", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(user.getEmail()));
    }

    @Test
    public void testGetUser_UserNotFound() throws Exception {
        when(userRepository.findById("1")).thenReturn(java.util.Optional.empty());

        mockMvc.perform(get("/user/get")
                .param("id", "1"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("User not found"));
    }

    @Test
    public void testUpdateUser_Success() throws Exception {
        User user = new User();
        user.setId("1");
        user.setEmail("user@example.com");
        user.setFirstName("John");
        user.setLastName("Doe");

        ProfileDTO profileDTO = new ProfileDTO();
        profileDTO.setId("1");
        profileDTO.setEmail("new_email@example.com");

        when(userRepository.findById("1")).thenReturn(java.util.Optional.of(user));

        mockMvc.perform(patch("/user/update")
                .contentType("application/json")
                .content("{\"id\": \"1\", \"email\": \"new_email@example.com\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("new_email@example.com"));
    }

    @Test
    public void testUpdateUser_UserNotFound() throws Exception {
        ProfileDTO profileDTO = new ProfileDTO();
        profileDTO.setId("1");

        when(userRepository.findById("1")).thenReturn(java.util.Optional.empty());

        mockMvc.perform(patch("/user/update")
                .contentType("application/json")
                .content("{\"id\": \"1\"}"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("User not found"));
    }

    @Test
    public void testDeleteUser_Success() throws Exception {
        // Create a mock user object
        User user = new User();
        user.setId("1");

        // Mock the userRepository's findById method to return the mock user
        when(userRepository.findById("1")).thenReturn(java.util.Optional.of(user));

        // Mock deleteAllByUserId for each repository to do nothing
        doNothing().when(checkoutRepository).deleteAllByUserId("1");
        doNothing().when(favoriteRepository).deleteAllByUserId("1");
        doNothing().when(notificationRepository).deleteAllByUserId("1");
        doNothing().when(queueRepository).findAll();
        doNothing().when(ratingRepository).deleteAllByUserId("1");
        doNothing().when(wishlistItemRepository).deleteAllByUserId("1");

        // Perform the delete request
        mockMvc.perform(delete("/user/delete")
                .param("id", "1"))
                .andExpect(status().isOk())  // Expecting a 200 OK status
                .andExpect(content().string("User deleted"));  // Expecting "User deleted" message in response
    }

    @Test
    public void testDeleteUser_UserNotFound() throws Exception {
        String userId = "123";
        when(userRepository.findById(userId)).thenReturn(java.util.Optional.empty());

        mockMvc.perform(delete("/user/delete")
                .param("id", userId))
                .andExpect(status().isNotFound())
                .andExpect(content().string("User not found"));

        verify(userRepository, times(0)).delete(any());
    }

    @Test
    public void testForgotPassword_UserNotFound() throws Exception {
        when(userRepository.findByEmail("user@example.com")).thenReturn(null);

        mockMvc.perform(get("/user/forgot_password")
                .param("email", "user@example.com"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("User not found"));
    }

    @Test
    public void testForgotPassword_Success() throws Exception {
        User user = new User();
        user.setEmail("user@example.com");

        when(userRepository.findByEmail("user@example.com")).thenReturn(user);

        mockMvc.perform(get("/user/forgot_password")
                .param("email", "user@example.com"))
                .andExpect(status().isOk())
                .andExpect(content().string("Password reset link sent to email"));
    }

    @Test
    public void testResetPassword_Success() throws Exception {
        User user = new User();
        user.setId("1");
        user.setPassword("old_password");

        when(userRepository.findById("1")).thenReturn(java.util.Optional.of(user));

        mockMvc.perform(patch("/user/reset_password")
                .param("id", "1")
                .contentType("application/json")
                .content("\"new_password\""))
                .andExpect(status().isOk())
                .andExpect(content().string("Password reset successful"));
    }

    @Test
    public void testResetPassword_UserNotFound() throws Exception {
        when(userRepository.findById("1")).thenReturn(java.util.Optional.empty());

        mockMvc.perform(patch("/user/reset_password")
                .param("id", "1")
                .contentType("application/json")
                .content("\"new_password\""))
                .andExpect(status().isNotFound())
                .andExpect(content().string("User not found"));
    }
}

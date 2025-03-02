package com.example.libstock_backend;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.test.web.servlet.*;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.example.libstock_backend.Controllers.NotificationController;
import com.example.libstock_backend.Models.Notification;
import com.example.libstock_backend.Models.User;
import com.example.libstock_backend.Repositories.NotificationRepository;
import com.example.libstock_backend.Repositories.UserRepository;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class NotificationControllerTest {

    private MockMvc mockMvc;

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private UserRepository userRepository;

    private NotificationController notificationController;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        notificationController = new NotificationController();
        notificationController.notificationRepository = notificationRepository;
        notificationController.userRepository = userRepository;
        mockMvc = MockMvcBuilders.standaloneSetup(notificationController).build();
    }

    // Test for create_notification
    @Test
    public void testCreateNotification_Success() throws Exception {
        Notification notification = new Notification();
        notification.setUserId("1");
        notification.setMessage("New Book Available");

        when(userRepository.findById("1")).thenReturn(java.util.Optional.of(new User()));
        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);

        mockMvc.perform(post("/notification/create")
                .contentType("application/json")
                .content("{\"userId\": \"1\", \"message\": \"New Book Available\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("New Book Available"));

        verify(notificationRepository, times(1)).save(any(Notification.class));
    }

    @Test
    public void testCreateNotification_MissingUserIdOrMessage() throws Exception {
        mockMvc.perform(post("/notification/create")
                .contentType("application/json")
                .content("{\"userId\": null, \"message\": null}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("User ID and message are required."));
    }

    @Test
    public void testCreateNotification_UserNotFound() throws Exception {
        Notification notification = new Notification();
        notification.setUserId("1");
        notification.setMessage("New Book Available");

        when(userRepository.findById("1")).thenReturn(java.util.Optional.empty());

        mockMvc.perform(post("/notification/create")
                .contentType("application/json")
                .content("{\"userId\": \"1\", \"message\": \"New Book Available\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("User not found."));
    }

    // Test for read_notification
    @Test
    public void testReadNotification_Success() throws Exception {
        Notification notification = new Notification();
        notification.setId("1");
        notification.setMessage("New Book Available");

        when(notificationRepository.findById("1")).thenReturn(java.util.Optional.of(notification));

        mockMvc.perform(get("/notification/read")
                .param("id", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("New Book Available"));
    }

    @Test
    public void testReadNotification_NotFound() throws Exception {
        when(notificationRepository.findById("1")).thenReturn(java.util.Optional.empty());

        mockMvc.perform(get("/notification/read")
                .param("id", "1"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testUpdateNotification_NotFound() throws Exception {
        when(notificationRepository.findById("1")).thenReturn(java.util.Optional.empty());

        mockMvc.perform(patch("/notification/update")
                .contentType("application/json")
                .content("{\"id\": \"1\", \"message\": \"Updated Message\"}"))
                .andExpect(status().isNotFound());
    }

    // Test for delete_notification
    @Test
    public void testDeleteNotification_Success() throws Exception {
        Notification notification = new Notification();
        notification.setId("1");
        notification.setMessage("New Book Available");

        when(notificationRepository.findById("1")).thenReturn(java.util.Optional.of(notification));
        doNothing().when(notificationRepository).delete(notification);

        mockMvc.perform(delete("/notification/delete")
                .param("id", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("New Book Available"));

        verify(notificationRepository, times(1)).delete(notification);
    }

    @Test
    public void testDeleteNotification_NotFound() throws Exception {
        when(notificationRepository.findById("1")).thenReturn(java.util.Optional.empty());

        mockMvc.perform(delete("/notification/delete")
                .param("id", "1"))
                .andExpect(status().isNotFound());
    }

    // Test for get_all notifications for a user
    @Test
    public void testGetAllNotifications_Success() throws Exception {
        Notification notification = new Notification();
        notification.setId("1");
        notification.setMessage("New Book Available");

        when(notificationRepository.findByUserId("1")).thenReturn(java.util.List.of(notification));

        mockMvc.perform(get("/notification/get_all")
                .param("userId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].message").value("New Book Available"));
    }

    // Test for is_read notification
    @Test
    public void testMarkNotificationAsRead_Success() throws Exception {
        Notification notification = new Notification();
        notification.setId("1");
        notification.setMessage("New Book Available");
        notification.setRead(false);

        when(notificationRepository.findById("1")).thenReturn(java.util.Optional.of(notification));
        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);

        mockMvc.perform(get("/notification/is_read")
                .param("id", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.read").value(true));
    }

    @Test
    public void testMarkNotificationAsRead_NotFound() throws Exception {
        when(notificationRepository.findById("1")).thenReturn(java.util.Optional.empty());

        mockMvc.perform(get("/notification/is_read")
                .param("id", "1"))
                .andExpect(status().isNotFound());
    }
}

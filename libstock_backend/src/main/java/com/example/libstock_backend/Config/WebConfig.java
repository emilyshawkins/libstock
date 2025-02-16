// Brandon Gascon - wrote //
// Configuration of HTTP frontend requests, request origin management, and JWT //
package com.example.libstock_backend.Config;

// allows us to define a class globally //
import org.springframework.context.annotation.Configuration;
// CORS framework works with Spring MVC to allow us to customize our web app's endpoints and security configurations //
import org.springframework.web.servlet.config.annotation.CorsRegistry;
// MVC is an interface that allows us to customize our web app's configuration //
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000") // only allows backend to be accessed by this frontend url //
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH") // frontend method requests, can add "HEAD" if we wanna check resources //
                .allowedHeaders("*") // allowed for CORS so we can have authentication request from frontend w/ custom "Authentication" header //
                .allowCredentials(true); // allowed so backend can accept cookies from users //
    }
}
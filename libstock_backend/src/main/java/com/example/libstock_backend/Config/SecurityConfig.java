// Brandon Gascon - wrote //
// Configuration and security for endpoints, manages requests from front- to back- end //
package com.example.libstock_backend.Config;

import com.example.libstock_backend.Config.AuthenticationConfig;

// allows us to define a meathod that we can use globally w/ @Bean //
import org.springframework.context.annotation.Bean;
// allows us to define a class globally, we can us Beans in w/ @Configuration //
import org.springframework.context.annotation.Configuration;
// part of spring secuirty, allows us to configure the security of http requests //
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// spring boot security is used here to manage our session customizations //
import org.springframework.security.config.http.SessionCreationPolicy;
// spring boot framework, allows us to define/ configure security filter chains //
import org.springframework.security.web.SecurityFilterChain; 
// used for preauthorizing, isAdmin boolean authentication for users that return true //
// done using "@PreAuthorize" //
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
// //
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// handles hashing and salting for passwords taken from the user //
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {
    // used to filter http requests, allows us to manage endpoints, all other requests //
    private final AuthenticationConfig authenticationConfig;

    public SecurityConfig(AuthenticationConfig authenticationConfig) {
        this.authenticationConfig = authenticationConfig;
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf().disable().cors().and()
            .authorizeHttpRequests(auth -> auth
                // open endpoints for public use //
                .requestMatchers("/user/login", "/user/user_signup", "/user/admin_signup").permitAll()
                .requestMatchers("/author/read", "/author/get_all").permitAll()
                .requestMatchers("/bookauthor/read").permitAll()
                .requestMatchers("/book/read", "/book/get_all").permitAll()
                .requestMatchers("/bookgenre/read").permitAll()
                .requestMatchers("/customList/create", "/customList/read", "/customList/addBook", "/customList/removeBook").permitAll()
                .requestMatchers("/genre/read").permitAll()

                // all other requests made must be authenticated //
                .anyRequest().permitAll()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // Jwt filter to intercept incoming requests, i.e. AuthenticationConfig function //
            .addFilterBefore(authenticationConfig, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // used for hashing/ salting passwords using BCrypt can now be used with "dependency injections" by using Bean //
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
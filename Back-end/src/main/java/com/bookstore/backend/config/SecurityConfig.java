package com.bookstore.backend.config;

import com.bookstore.backend.filter.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.http.HttpMethod;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Spring Security's main configuration file eka krnn yodagnn annotations
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private CorsConfigurationSource corsConfigurationSource;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/users/register", "/api/users/login", "/api/users/create-admin",
                                "/api/users/test-db", "/api/users/test-write")
                        .permitAll()
                        .requestMatchers("/", "/error", "/actuator/health").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/conversations").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/conversations/user/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/conversations/unread/admin").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/books/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/articles/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/faqs/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/contacts").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/books").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/books/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/books/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/categories").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/categories/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/categories/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/articles").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/articles/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/articles/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/contacts/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/contacts/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/faqs").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/faqs/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/faqs/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/conversations").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/conversations/status/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/conversations/active").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/conversations/unread/user").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/conversations/*/messages").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/conversations/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/conversations/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/conversations/search").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
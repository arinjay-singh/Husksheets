package com.husksheets_api_server_scrumlords.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.Customizer;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.beans.factory.annotation.Value;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Http basic authentication config + user/pass loader
 */
@Configuration
public class SpringSecurityConfig {

    @Value("${user.team5.username}")
    private String team5Username;

    @Value("${user.team5.password}")
    private String team5Password;

    @Value("${user.mike.username}")
    private String mikeUsername;

    @Value("${user.mike.password}")
    private String mikePassword;
    /**
     * PasswordEncoder bean to encode passwords.
     */
    @Bean
    public PasswordEncoder encoder() { return new BCryptPasswordEncoder();}

    /**
     * InMemoryUserDetailsManager bean to store user logins in memory (on startup).
     * @author Nicholas O'Sullivan
     * @return InMemoryUserDetailsManager created with our desired users
     */
    @Bean
    public InMemoryUserDetailsManager userDetailsService() {
        UserDetails Team5User = new CustomUserDetails(
                team5Username, team5Password,
                Collections.emptyList()
        );
        UserDetails MikeUser = new CustomUserDetails(
                mikeUsername, mikePassword,
                Collections.emptyList()
        );
        return new InMemoryUserDetailsManager(Team5User, MikeUser);
    }

    /**
     * AuthenticationProvider bean to authenticate users with case-sensitive usernames.
     * @return a CaseSensitiveAuthenticationProvider for use in our filter chain.
     * @author Kaan tural
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        return new CaseSensitiveAuthenticationProvider(userDetailsService(), encoder());
    }

    /**
     * CustomAuthenticationEntryPoint bean to handle unauthorized requests to the server.
     * @author Nicholas O'Sullivan
     */
    @Bean
    public CustomAuthenticationEntryPoint customAuthenticationEntryPoint() {
        return new CustomAuthenticationEntryPoint();
    }

    /**
     * SecurityFilterChain bean to configure the security filter chain.
     * allow CORS, require HTTPS basic auth, handle exceptions, authenticate w/ CaseSensitiveAuth...
     * @param httpSecurity the HttpSecurity object to configure
     * @return SecurityFilterChain configured with our security settings
     * @throws Exception if an exception occurs
     * @author Nicholas O'Sullivan
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .cors(c -> c.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().authenticated()
                )
                .httpBasic(Customizer.withDefaults())
                .exceptionHandling(exceptionHandling -> exceptionHandling.authenticationEntryPoint(customAuthenticationEntryPoint()))
                .authenticationProvider(authenticationProvider())
                .build();
    }

    /**
     * CorsConfigurationSource bean to configure CORS settings.
     * @author Parnika Jaan
     * @return CorsConfigurationSource configured with our CORS settings
     */
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "OPTIONS"));
        configuration.setAllowCredentials(true);
        configuration.setAllowedHeaders(List.of("*"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /**
     * Util used for generating BCrypt for storing passwords
     */
    public static class PasswordEncoderUtil {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String encodedPassword = encoder.encode("");
        System.out.println("Password: " + encodedPassword);
    }
}

}


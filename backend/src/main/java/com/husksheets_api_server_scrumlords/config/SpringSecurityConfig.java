package com.husksheets_api_server_scrumlords.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.Customizer;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Http basic authentication config + user/pass loader
 * author: nicholas o'sullivan, Parnika Jain
 */
@Configuration
public class SpringSecurityConfig {

    /**
     * PasswordEncoder bean to encode passwords for security.
     */
    @Bean
    public PasswordEncoder encoder() { return new BCryptPasswordEncoder();}

    /**
     * InMemoryUserDetailsManager bean to store user details in memory.
     *
     * @return InMemoryUserDetailsManager created with our created users
     */
    @Bean
    public InMemoryUserDetailsManager userDetailsService() {
        UserDetails Team5User = new CustomUserDetails(
                "Team5",
                encoder().encode("5password"),
                Collections.emptyList()
        );
        UserDetails MikeUser = new CustomUserDetails(
                "Mike",
                encoder().encode("12345password"),
                Collections.emptyList()
        );
        return new InMemoryUserDetailsManager(Team5User, MikeUser);
    }

    /**
     * AuthenticationProvider bean to authenticate users with case-sensitive usernames.
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        return new CaseSensitiveAuthenticationProvider(userDetailsService(), encoder());
    }

    /**
     * CustomAuthenticationEntryPoint bean to handle unauthorized requests to the server.
     */
    @Bean
    public CustomAuthenticationEntryPoint customAuthenticationEntryPoint() {
        return new CustomAuthenticationEntryPoint();
    }

    /**
     * SecurityFilterChain bean to configure the security filter chain.
     *
     * @param httpSecurity the HttpSecurity object to configure
     * @return SecurityFilterChain configured with our security settings
     * @throws Exception if an exception occurs
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
     *
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
}


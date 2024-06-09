package com.husksheets_api_server_scrumlords.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.Customizer;

/**
 * Http basic authentication config + user/pass loader
 * author: nicholas o'sullivan
 */
@Configuration
public class SpringSecurityConfig {

    /**
     * CustomAuthenticationEntryPoint bean to handle unauthorized requests to the server.
     */
    @Bean
    public CustomAuthenticationEntryPoint customAuthenticationEntryPoint() {
        return new CustomAuthenticationEntryPoint();
    }

    /**
     * PasswordEncoder bean to encode passwords for security.
     */
    @Bean
    public PasswordEncoder encoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * InMemoryUserDetailsManager bean to store user details in memory.
     *
     * @return InMemoryUserDetailsManager created with our created users
     */
    @Bean
    public InMemoryUserDetailsManager userDetailsService() {
        UserDetails Team5User = User.builder()
                .username("Team5")
                .password(encoder().encode("5password"))
                //.roles("")
                .build();
        UserDetails MikeUser = User.builder()
                .username("Mike")
                .password(encoder().encode("12345password"))
                //.roles("")
                .build();
        return new InMemoryUserDetailsManager(Team5User, MikeUser);
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
                .cors(Customizer.withDefaults())  // Enable CORS with default settings
                .csrf(AbstractHttpConfigurer::disable)  // Disable front-end cross site request forgery
                .authorizeHttpRequests(auth -> auth
                        //.requestMatchers(new AntPathRequestMatcher("/api/v1/register/**")).authenticated()
                        // Any authenticated user can register
                        //.requestMatchers("/api/v1/deleteSheet").hasRole("publisher") <- example
                        .anyRequest().authenticated()
                )
                .httpBasic(Customizer.withDefaults())
                .exceptionHandling(exceptionHandling -> exceptionHandling.authenticationEntryPoint(customAuthenticationEntryPoint()))
                .build();
    }
}

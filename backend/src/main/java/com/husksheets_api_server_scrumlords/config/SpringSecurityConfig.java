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
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;


@Configuration
public class SpringSecurityConfig {

    @Bean
    public PasswordEncoder encoder() { return new BCryptPasswordEncoder();}

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

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
    return httpSecurity
        .csrf(AbstractHttpConfigurer::disable)  //disable front-end cross site request forgery.
        .authorizeHttpRequests(auth -> auth
            .requestMatchers(new AntPathRequestMatcher("/api/v1/register/**")).permitAll()
                //any authenticated user can register
            //.requestMatchers("/api/v1/deleteSheet").hasRole("publisher") <- example
            .anyRequest().authenticated()
        )
     //   .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
     //   .oauth2ResourceServer(OAuth2ResourceServerConfigurer::jwt)
        .httpBasic(Customizer.withDefaults())
        .build();
    }
}


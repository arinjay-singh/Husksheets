package com.husksheets_api_server_scrumlords.config;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * CaseSensitiveAuthenticationProvider class: Authenticate users with case-sensitive usernames.
 * @author Kaan Tural
 */
public class CaseSensitiveAuthenticationProvider implements AuthenticationProvider {
    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;

    /**
     * CaseSensitiveAuthenticationProvider constructor.
     *
     * @param userDetailsService the user details service
     * @param passwordEncoder the password encoder
     */
    public CaseSensitiveAuthenticationProvider(UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Authenticate a user with a case-sensitive username.
     *
     * @param authentication the authentication object
     * @return the authentication token
     * @throws AuthenticationException if the authentication fails
     */
    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String presentedUsername = authentication.getName();
        String presentedPassword = (String) authentication.getCredentials();

        UserDetails userDetails = userDetailsService.loadUserByUsername(presentedUsername);
        if (userDetails == null || !userDetails.getUsername().equals(presentedUsername)) {
            throw new BadCredentialsException("Invalid username or password");
        }

        if (!passwordEncoder.matches(presentedPassword, userDetails.getPassword())) {
            throw new BadCredentialsException("Invalid username or password");
        }

        return new UsernamePasswordAuthenticationToken(userDetails, presentedPassword, userDetails.getAuthorities());
    }

    /**
     * Check if the authentication object is supported.
     *
     * @param authentication the authentication object
     * @return true if the authentication object is supported
     */
    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }
}


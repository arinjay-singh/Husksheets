package com.husksheets_api_server_scrumlords.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;


import java.io.IOException;

/**
 * CustomAuthenticationEntryPoint class: Handle unauthorized requests to the server.
 * author: Nicholas O'Sullivan
 */
@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
    /**
     * Commence method to handle unauthorized requests to the server.
     *
     * @param request the request being sent to the server.
     * @param response the response being sent back to the client.
     * @param authException the exception being thrown.
     * @throws IOException if an input or output exception occurs.
     * @throws ServletException if a servlet exception occurs.
     */
    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException, ServletException {
        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("Unauthorized");
    }
}

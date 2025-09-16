package com.hospiapp.backend.utils;

import org.springframework.stereotype.Component;

@Component
public class ValidationHelper {

    public void validateToken(String token) {
        if (token == null || token.trim().isEmpty()) {
            throw new IllegalArgumentException("Token de autorización requerido");
        }
    }

    public void validateId(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("ID requerido");
        }
    }

    public void validatePagination(int page, int size) {
        if (page < 0) {
            throw new IllegalArgumentException("Página debe ser mayor o igual a 0");
        }
        if (size <= 0 || size > 100) {
            throw new IllegalArgumentException("Tamaño debe estar entre 1 y 100");
        }
    }

    public void validateSearchTerm(String term) {
        if (term == null || term.trim().length() < 2) {
            throw new IllegalArgumentException("Término de búsqueda debe tener al menos 2 caracteres");
        }
    }
}












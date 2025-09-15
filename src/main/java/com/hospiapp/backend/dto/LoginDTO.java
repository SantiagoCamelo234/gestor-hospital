package com.hospiapp.backend.dto;

public class LoginDTO {

    private String username;
    private String password;

    public LoginDTO() {
        // Constructor vacío necesario para deserialización JSON
    }

    public LoginDTO(String username, String password) {
        this.username = username;
        this.password = password;
    }

    // Getters y setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

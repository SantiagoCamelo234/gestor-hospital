package com.hospiapp.backend.dto;

import com.hospiapp.backend.domain.usuario.Usuario;

public class RegistroRequest {
    private String username;
    private String password;
    private Usuario.Rol rol;
    private String asociadoId; // opcional

    // Getters y setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public Usuario.Rol getRol() { return rol; }
    public void setRol(Usuario.Rol rol) { this.rol = rol; }
    public String getAsociadoId() { return asociadoId; }
    public void setAsociadoId(String asociadoId) { this.asociadoId = asociadoId; }
}

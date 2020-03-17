package com.mycompany.wsschallengesantander.dtos;

public class UsuarioDTO {
    private String nombre;
    private String apellido;
    private String mail;

    public UsuarioDTO() {
    }

    public UsuarioDTO(String nombre, String apellido, String mail) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.mail = mail;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getMail() {
        return mail;
    }

    public void setMail(String mail) {
        this.mail = mail;
    }
    
    
}

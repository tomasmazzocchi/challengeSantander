package com.mycompany.wsschallengesantander.controller.auth;

class LoginDTO {
    private String usuario;
    private String password;

    public LoginDTO() {
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

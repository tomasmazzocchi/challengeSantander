package com.mycompany.wsschallengesantander.model;

public class UsuarioAdmin extends Usuario{

    public UsuarioAdmin() {
        super();
    }

    public UsuarioAdmin(String nombre, String apellido, String mail) {
        super(nombre, apellido, mail);
    }
    
    public int birrasAComprar(Meeting m) {
        return m.calcularBirrasAComprar();
    }
    
}

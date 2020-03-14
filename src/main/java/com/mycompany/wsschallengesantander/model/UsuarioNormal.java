package com.mycompany.wsschallengesantander.model;

public class UsuarioNormal extends Usuario{

    public UsuarioNormal() {
        super();
    }

    public UsuarioNormal(String nombre, String apellido, String mail) {
        super(nombre, apellido, mail);
    }
    
    public void hacerCheckIn(Meeting m) {
        m.notifyObservers();
    }
    
}

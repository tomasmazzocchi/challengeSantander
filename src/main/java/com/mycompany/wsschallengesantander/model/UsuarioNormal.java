package com.mycompany.wsschallengesantander.model;

import javax.persistence.Entity;

@Entity
public class UsuarioNormal extends Usuario {

    public UsuarioNormal() {
    }

    public UsuarioNormal(String nombre, String apellido, String mail) {
        super(nombre, apellido, mail);
    }

    public void hacerCheckIn(Meeting m) {
        m.notifyObservers();
    }

    public void inscribirseEnMeeting(Meeting m, Usuario u) {
        m.agregarInvitado(u);
    }

}

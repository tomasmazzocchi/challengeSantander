package com.mycompany.wsschallengesantander.model;

import javax.persistence.Entity;

@Entity
public class UsuarioAdmin extends Usuario {

    public UsuarioAdmin() {
    }

    public UsuarioAdmin(String nombre, String apellido, String mail) {
        super(nombre, apellido, mail);
    }
    
    public int birrasAComprar(Double temperatura, int cantidadPersonas) {
        if (cantidadPersonas < 6) {
            return 1;
        } else {
            if (temperatura > 24) {
                return (int) Math.ceil((cantidadPersonas * 3) / 6);
            } else {
                return (int) Math.ceil((cantidadPersonas) / 6);
            }
        }
    }

}

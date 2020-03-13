package com.mycompany.wsschallengesantander.model;

import com.mycompany.wsschallengesantander.client.MetereologiaClient;
import java.util.Calendar;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;

public class Meeting {
    private String lugar;
    private Calendar fecha;
    private Usuario admin;
    private List<Usuario> usuarios;
    
    @Autowired
    MetereologiaClient metereologiaClient;
    
    public int calcularBirrasAComprar() {
         if(this.conocerTemperatura() > 24){
            return (int) Math.ceil((this.getCantidadUsuarios() * 3) / 6);
        } else {
            return (int) Math.ceil((this.getCantidadUsuarios()) / 6);
         }
    }
    
    public Double conocerTemperatura() {
        return metereologiaClient.obtenerPronosticoPorDiaYLugar(this.getLugar(), this.getFecha()).getTemp();
    }
    
    public int getCantidadUsuarios(){
        return this.getUsuarios().size() + 1;
    }

    public String getLugar() {
        return lugar;
    }

    public void setLugar(String lugar) {
        this.lugar = lugar;
    }

    public Calendar getFecha() {
        return fecha;
    }

    public void setFecha(Calendar fecha) {
        this.fecha = fecha;
    }

    public Usuario getAdmin() {
        return admin;
    }

    public void setAdmin(Usuario admin) {
        this.admin = admin;
    }

    public List<Usuario> getUsuarios() {
        return usuarios;
    }

    public void setUsuarios(List<Usuario> usuarios) {
        this.usuarios = usuarios;
    }
}

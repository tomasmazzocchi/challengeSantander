package com.mycompany.wsschallengesantander.model;

import com.mycompany.wsschallengesantander.client.MetereologiaClient;
import java.util.Calendar;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;

public class Meeting {
    private String lugar;
    private Calendar fecha;
    private int cantidadBirras;
    private Double temperatura;
    private Persona admin;
    private List<Persona> usuarios;
    
    @Autowired
    MetereologiaClient metereologiaClient;
    
    public void calcularBirrasAComprar() {
         if(this.getTemperatura() > 24){
            this.setCantidadBirras((int) Math.ceil((this.getCantidadPersonas() * 3) / 6));
        } else {
            this.setCantidadBirras((int) Math.ceil((this.getCantidadPersonas()) / 6));
         }
    }
    
    public void conocerTemperatura() {
        this.setTemperatura(metereologiaClient.obtenerPronosticoPorDiaYLugar(this.getLugar(), this.getFecha()).getTemp());
    }
    
    public int getCantidadPersonas(){
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

    public Persona getAdmin() {
        return admin;
    }

    public void setAdmin(Persona admin) {
        this.admin = admin;
    }

    public List<Persona> getUsuarios() {
        return usuarios;
    }

    public void setUsuarios(List<Persona> usuarios) {
        this.usuarios = usuarios;
    }

    public int getCantidadBirras() {
        return cantidadBirras;
    }

    public void setCantidadBirras(int cantidadBirras) {
        this.cantidadBirras = cantidadBirras;
    }

    public Double getTemperatura() {
        return temperatura;
    }

    public void setTemperatura(Double temperatura) {
        this.temperatura = temperatura;
    }
    
}

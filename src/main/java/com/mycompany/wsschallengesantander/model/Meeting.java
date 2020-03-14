package com.mycompany.wsschallengesantander.model;

import com.mycompany.wsschallengesantander.client.MetereologiaClient;
import com.mycompany.wsschallengesantander.observer.Observer;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;

public class Meeting {

    private String lugar;
    private Calendar fecha;
    private UsuarioAdmin admin;
    private List<UsuarioNormal> usuarios;
    private List<Observer> observersList = new ArrayList<>();

    @Autowired
    MetereologiaClient metereologiaClient;

    public int calcularBirrasAComprar() {
        if (this.conocerTemperatura() > 24) {
            return (int) Math.ceil((this.getCantidadUsuarios() * 3) / 6);
        } else {
            return (int) Math.ceil((this.getCantidadUsuarios()) / 6);
        }
    }

    public Double conocerTemperatura() {
            return metereologiaClient.obtenerPronosticoPorDiaYLugar(this.getLugar(), this.getFecha()).getTemp();
    }

    public void notifyObservers() {
        observersList.forEach(observer -> observer.notificar());
    }

    public void addObserver(Observer observer) {
        observersList.add(observer);
    }
    
    public void removeObserver(Observer observer) {
        observersList.remove(observer);
    }
    
    public void agregarInvitado(UsuarioNormal usuario) {
        this.getUsuarios().add(usuario);
    }

    public Meeting() {
    }

    public Meeting(String lugar, Calendar fecha, UsuarioAdmin admin, List<UsuarioNormal> usuarios) {
        this.lugar = lugar;
        this.fecha = fecha;
        this.admin = admin;
        this.usuarios = usuarios;
    }

    public int getCantidadUsuarios() {
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

    public UsuarioAdmin getAdmin() {
        return admin;
    }

    public void setAdmin(UsuarioAdmin admin) {
        this.admin = admin;
    }

    public List<UsuarioNormal> getUsuarios() {
        return usuarios;
    }

    public void setUsuarios(List<UsuarioNormal> usuarios) {
        this.usuarios = usuarios;
    }
}

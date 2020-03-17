package com.mycompany.wsschallengesantander.model;

import com.mycompany.wsschallengesantander.observer.Observer;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "MEETING")
public class Meeting {
    
    private Long id;
    private String lugar;
    private Calendar fecha;
    private Usuario admin;
    private List<Usuario> usuarios = new ArrayList<>();
    private List<Observer> observersList = new ArrayList<>();
    private Double temperatura;

    public void notifyObservers() {
        observersList.forEach(observer -> observer.notificar());
    }

    public void addObserver(Observer observer) {
        observersList.add(observer);
    }
    
    public void removeObserver(Observer observer) {
        observersList.remove(observer);
    }
    
    public void agregarInvitado(Usuario usuario) {
        this.getUsuarios().add(usuario);
    }

    public Meeting() {
    }

    public Meeting(String lugar, Calendar fecha, Usuario admin, List<Usuario> usuarios) {
        this.lugar = lugar;
        this.fecha = fecha;
        this.admin = admin;
        this.usuarios = usuarios;
    }
    
    @Id
    @GeneratedValue
    @Column(name = "ID_MEETING", unique = true, nullable = false)
    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Column(name = "CANTIDAD_USUARIOS")
    public String getLugar() {
        return lugar;
    }

    public void setLugar(String lugar) {
        this.lugar = lugar;
    }

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "FECHA")
    public Calendar getFecha() {
        return fecha;
    }

    public void setFecha(Calendar fecha) {
        this.fecha = fecha;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_USUARIO")
    public Usuario getAdmin() {
        return admin;
    }

    public void setAdmin(Usuario admin) {
        this.admin = admin;
    }

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "usuario")
    public List<Usuario> getUsuarios() {
        return usuarios;
    }

    public void setUsuarios(List<Usuario> usuarios) {
        this.usuarios = usuarios;
    }

    @JoinColumn(name = "TEMPERATURA")
    public Double getTemperatura() {
        return temperatura;
    }

    public void setTemperatura(Double temperatura) {
        this.temperatura = temperatura;
    }

    public int getCantidadUsuarios() {
        return this.getUsuarios().size() + 1;
    }
}

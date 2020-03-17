package com.mycompany.wsschallengesantander.dtos;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

public class MeetingDTO {
    private String lugar;
    private Long fecha;
    private UsuarioDTO admin;
    private List<UsuarioDTO> usuarios = new ArrayList<>();
    private Double temperatura;

    public MeetingDTO() {
    }

    public MeetingDTO(String lugar, Long fecha, UsuarioDTO admin, Double temperatura) {
        this.lugar = lugar;
        this.fecha = fecha;
        this.admin = admin;
        this.temperatura = temperatura;
    }

    public String getLugar() {
        return lugar;
    }

    public void setLugar(String lugar) {
        this.lugar = lugar;
    }

    public Long getFecha() {
        return fecha;
    }

    public void setFecha(Long fecha) {
        this.fecha = fecha;
    }

    public UsuarioDTO getAdmin() {
        return admin;
    }

    public void setAdmin(UsuarioDTO admin) {
        this.admin = admin;
    }

    public List<UsuarioDTO> getUsuarios() {
        return usuarios;
    }

    public void setUsuarios(List<UsuarioDTO> usuarios) {
        this.usuarios = usuarios;
    }

    public Double getTemperatura() {
        return temperatura;
    }

    public void setTemperatura(Double temperatura) {
        this.temperatura = temperatura;
    }
    
    
}

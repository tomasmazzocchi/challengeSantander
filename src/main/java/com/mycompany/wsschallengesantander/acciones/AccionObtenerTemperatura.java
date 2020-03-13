package com.mycompany.wsschallengesantander.acciones;

import com.mycompany.wsschallengesantander.model.Meeting;

public class AccionObtenerTemperatura implements AccionUsuarioNormal{
    private Meeting meeting;

    public AccionObtenerTemperatura(Meeting meeting) {
        this.meeting = meeting;
    }
    
    @Override
    public Double obtenerTemperatura() {
        return meeting.conocerTemperatura();
    }
}

package com.mycompany.wsschallengesantander.acciones;

import com.mycompany.wsschallengesantander.model.Meeting;

public class AccionBirrasAComprar implements AccionUsuarioAdmin{
    private Meeting meeting;

    public AccionBirrasAComprar(Meeting meeting) {
        this.meeting = meeting;
    }
    
    @Override
    public int obtenerBirrasAComprar() {
        return meeting.calcularBirrasAComprar();
    }
    
}

package com.mycompany.wsschallengesantander.acciones;

import com.mycompany.wsschallengesantander.model.Meeting;

public class BirrasAComprar implements Accion{
    private Meeting meeting;

    public BirrasAComprar(Meeting meeting) {
        this.meeting = meeting;
    }
    
    @Override
    public void ejectuar() {
        meeting.conocerTemperatura();
        meeting.calcularBirrasAComprar();
    }
    
}

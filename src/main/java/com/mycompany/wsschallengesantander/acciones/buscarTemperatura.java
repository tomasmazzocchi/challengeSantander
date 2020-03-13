package com.mycompany.wsschallengesantander.acciones;

import com.mycompany.wsschallengesantander.model.Meeting;

public class buscarTemperatura implements Accion{
    private Meeting meeting;

    public buscarTemperatura(Meeting meeting) {
        this.meeting = meeting;
    }
    
    @Override
    public void ejectuar() {
        meeting.conocerTemperatura();
    }
}

package com.mycompany.wsschallengesantander.observer;

public class NotificadorMail implements Observer{
    private String mail;

    public NotificadorMail(String mail) {
        this.mail = mail;
    }

    public NotificadorMail() {
    }
    
    @Override
    public void notificar() {
        System.out.println("Enviando correo con notificacion a ".concat(mail));
    }
    
}

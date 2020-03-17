package com.mycompany.wsschallengesantander.controller;

import javax.xml.ws.http.HTTPException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "meeting")
public class MeetingController {
    
    @RequestMapping(value = "", method = RequestMethod.GET)
    public ResponseEntity<?> getAll() throws HTTPException, Exception {
//        ClienteDTO clienteDTO = new ClienteDTO();
//        clienteDTO = clienteClient.obtenerPorId(idCliente.toString());

        return (ResponseEntity<?>) ResponseEntity.ok();
    }
    
}

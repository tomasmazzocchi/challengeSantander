package com.mycompany.wsschallengesantander.controller;

import com.mycompany.wsschallengesantander.dtos.MeetingDTO;
import com.mycompany.wsschallengesantander.dtos.UsuarioDTO;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
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
        List<MeetingDTO> meetings = new ArrayList<>();
        
        UsuarioDTO admin = new UsuarioDTO("tomas", "mazzocchi", "tomasmazzocchi@gmail.com");
        UsuarioDTO user1 = new UsuarioDTO("pepe", "argento", "pepeargento@gmail.com");
        UsuarioDTO user2 = new UsuarioDTO("moni", "argento", "moniargento@gmail.com");
        UsuarioDTO user3 = new UsuarioDTO("elena", "fuseneco", "elenafuseneco@gmail.com");
        Calendar fecha = Calendar.getInstance();
        MeetingDTO meetingDTO = new MeetingDTO("Almagro, CABA", fecha.getTimeInMillis(), admin, 21.0);
        meetingDTO.getUsuarios().add(user1);
        meetingDTO.getUsuarios().add(user2);
        meetingDTO.getUsuarios().add(user3);
        
        meetings.add(meetingDTO);
        
        return ResponseEntity.ok(meetings);
    }

}

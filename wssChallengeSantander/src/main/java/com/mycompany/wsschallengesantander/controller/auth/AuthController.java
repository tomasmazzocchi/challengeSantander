package com.mycompany.wsschallengesantander.controller.auth;

import org.springframework.beans.factory.annotation.Autowired;
import com.mycompany.wsschallengesantander.utils.CalendarUtilidades;
import javax.servlet.http.HttpServletRequest;
import javax.xml.ws.http.HTTPException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Calendar;

@RestController
@RequestMapping(value = "auth")
public class AuthController {

    @Autowired
    HttpServletRequest request;

    @RequestMapping(value = "login", method = RequestMethod.POST)
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) throws HTTPException, Exception {
        Calendar c = CalendarUtilidades.obtenerFechaDelDia();
        c.add(Calendar.MINUTE, 40);
        String token = Jwts.builder().setExpiration(c.getTime())
                .setSubject("adminadmin")
                .signWith(SignatureAlgorithm.HS512, "challengeSantander")
                .compact();
        return ResponseEntity.ok(token);
    }

}

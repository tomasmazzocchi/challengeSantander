package com.mycompany.wsschallengesantander.controller;

import com.mycompany.wsschallengesantander.client.environment.EndpointDTO;
import com.mycompany.wsschallengesantander.client.environment.EnvironmentDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "dominio")
public class DominioController {

    @RequestMapping(value="environment", method = RequestMethod.GET)
    public ResponseEntity<?> getEnvironment() {        
        return ResponseEntity.ok(new EnvironmentDTO(new EndpointDTO(System.getProperty("endpoint")), "/login", System.getProperty("login") != null ? System.getProperty("login") : "", System.getProperty("logout") != null ? System.getProperty("logout") : ""));
    }
    }

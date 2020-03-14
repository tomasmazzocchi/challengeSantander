package com.mycompany.wsschallengesantander.client;

import com.mycompany.wsschallengesantander.client.dtos.MetereologiaDTO;
import com.mycompany.wsschallengesantander.utils.CalendarUtilidades;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Component
public class MetereologiaClient  {
    
    @Autowired
    RestTemplateRequest restTemplateRequest;

    public MetereologiaDTO obtenerPronosticoPorDiaYLugar(String lugar, Calendar fecha) {
        Map<String, String> vars = new HashMap<>();
        vars.put("lugar", lugar);
        vars.put("fecha", CalendarUtilidades.calendarToStr(fecha, CalendarUtilidades.FORMATO_FECHA_HORA_MINUTO_SEGUNDO));
        
        MetereologiaDTO pronostico = restTemplateRequest.getForObject("http://dataservice.accuweather.com/forecasts/v1/daily/1day", MetereologiaDTO.class, vars);
        
        
        return pronostico;
    }
}

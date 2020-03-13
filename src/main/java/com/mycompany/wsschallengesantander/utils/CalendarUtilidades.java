package com.mycompany.wsschallengesantander.utils;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.text.ParseException;

public final class CalendarUtilidades {

    public static final String FORMATO_FECHA = "dd/MM/yyyy";
    public static final String FORMATO_FECHA_HORA_MINUTO = "dd/MM/yyyy HH:mm";
    public static final String FORMATO_FECHA_HORA_MINUTO_SEGUNDO = "dd/MM/yyyy HH:mm:ss";
    public static final String FORMATO_FECHA_HORA_MINUTO_AM_PM = "dd/MM/yyyy hh:mma";
    public static final String FORMATO_FECHA_PLANO_FULL = "yyyyMMddHHmmss";    
    public static final String FORMATO_FECHA_YYYY_MM_DD = "yyyy-MM-dd";    
    public static final String FORMATO_FECHA_YYYY_MM_DDTHH_MM_SS = "yyyy-MM-dd'T'HH:mm:ss";    
    public static final String FORMATO_FECHA_YYYY_MM_DD_HH_MM_SS = "yyyy-MM-dd HH:mm:ss";    

   public static Calendar strToCalendar(String dateString, String formato) throws ParseException {                    
            Calendar cal = obtenerFechaDelDia();
            cal.setTime(new SimpleDateFormat(formato).parse(dateString));
            return cal;        
    }

    public static String calendarToStr(Calendar fecha, String formato) {                
        return new SimpleDateFormat(formato).format(fecha.getTime());        
    }
    
    public static Calendar obtenerFechaDelDia() {       
        return Calendar.getInstance();
    }    
}

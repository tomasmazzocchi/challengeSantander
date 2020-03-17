package com.mycompany.wsschallengesantander.filters;

import com.mycompany.wsschallengesantander.utils.CalendarUtilidades;
import io.jsonwebtoken.ExpiredJwtException;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Calendar;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.apache.http.client.HttpResponseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.util.NestedServletException;
import org.springframework.web.util.UrlPathHelper;


public class SimpleCorsFilter implements Filter {        
    Logger LOGGER = LoggerFactory.getLogger("error");

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
        HttpServletResponse response = (HttpServletResponse) res;
        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("Access-Control-Allow-Origin", "*"); 
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Headers", "x-requested-with, x-auth-token, idDominio, tokenMF, tokenTerm, idDominioMF, idUsuario, idSesion, Content-Type, expiresIn, idInternacion, idEfector");        
        response.setHeader("Access-Control-Expose-Headers", "tokenMF, tokenTerm, idSesion, msg, expiresIn, x-auth-token");                
        req.setCharacterEncoding("UTF-8");
        res.setCharacterEncoding("UTF-8");       
        if ("OPTIONS".equalsIgnoreCase(((HttpServletRequest) req).getMethod())) {
             response.setStatus(HttpServletResponse.SC_OK);
        } else {                      
            UrlPathHelper uph = new UrlPathHelper();
            HttpServletRequest sr = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();            
            LOGGER.info("Inicia ".concat(uph.getOriginatingRequestUri(sr)));
            BufferedRequestWrapper bufferedReqest = new BufferedRequestWrapper(sr);                
            try {                                
                Calendar c = CalendarUtilidades.obtenerFechaDelDia();
                c.add(Calendar.MINUTE, 30);                 
                response.setHeader("expiresIn", Long.toString(c.getTimeInMillis()));
                chain.doFilter(bufferedReqest, response); 
                LOGGER.info("Finaliza ".concat(uph.getOriginatingRequestUri(sr)));
            } catch (ExpiredJwtException e) {
                response.setStatus(498);
                response.sendError(498, "La sesion ha caducado");                       
            }
            catch(NestedServletException httpResExc){
                Throwable thrw = ExceptionUtils.getRootCause(httpResExc);
                if(thrw instanceof IOException) {
                    response.setStatus(503);
                    response.sendError(503);
                }else if (thrw instanceof HttpResponseException ){
                LOGGER.error(getDescripcionError(req, httpResExc).concat("| URL "+ uph.getOriginatingRequestUri(sr) + " | PARAMS: "+ uph.getOriginatingQueryString(sr) + " | JSON: "+ bufferedReqest.getRequestBody()));
                response.setStatus(500);                
                response.sendError(500, thrw.getMessage());                            
                }
                else if (thrw instanceof ResourceAccessException  || httpResExc.getMessage().contains("ResourceAccessException")) {
                LOGGER.error(getDescripcionError(req, httpResExc).concat("| URL "+ uph.getOriginatingRequestUri(sr) + " | PARAMS: "+ uph.getOriginatingQueryString(sr) + " | JSON: "+ bufferedReqest.getRequestBody()));
                response.setStatus(500);                
                response.sendError(500, "//////////////////////No anda ////////////////// <br/>"+httpResExc.getRootCause().getLocalizedMessage());                            
            }else{
                String error = getDescripcionError(req, httpResExc);
                LOGGER.error(error.concat("| URL "+ uph.getOriginatingRequestUri(sr) + " | PARAMS: "+ uph.getOriginatingQueryString(sr) + " | JSON: "+ bufferedReqest.getRequestBody()));                
                response.setStatus(500);
                response.sendError(500, "Ha ocurrido un error inesperado");                            
                }                                           
            }
            catch (IOException | ServletException ex){                      
                String error = getDescripcionError(req, ex);
                LOGGER.error(error.concat("| URL "+ uph.getOriginatingRequestUri(sr) + " | PARAMS: "+ uph.getOriginatingQueryString(sr) + " | JSON: "+ bufferedReqest.getRequestBody()));                
                response.setStatus(500);
                response.sendError(500, "Ha ocurrido un error inesperado");                            
            }catch (Exception exc){                      
                String error = getDescripcionError(req, exc);
                LOGGER.error(error.concat("| URL "+ uph.getOriginatingRequestUri(sr) + " | PARAMS: "+ uph.getOriginatingQueryString(sr) + " | JSON: "+ bufferedReqest.getRequestBody()));                
                response.setStatus(500);
                response.sendError(500, "Ha ocurrido un error inesperado");                            
            } finally {                 
            }
        }
    }

    @Override
    public void init(FilterConfig filterConfig) {       
    }

    @Override
    public void destroy() {
    }

    public SimpleCorsFilter() {
        super();
    }
    
    private static String getDescripcionError(ServletRequest req, Exception e)
    {
        char[] eol = new char[2];
        eol[0] = (char) 0x0d;
        eol[1] = (char) 0x0a;
        String eolString = String.valueOf(eol[0]) + String.valueOf(eol[1]);
        
        StringWriter errors = new StringWriter();
        e.printStackTrace(new PrintWriter(errors));
        
        String error = "********************************************* ERROR ******************************************************"  + eolString +
                        "Hora:" + CalendarUtilidades.calendarToStr(CalendarUtilidades.obtenerFechaDelDia(), CalendarUtilidades.FORMATO_FECHA_HORA_MINUTO) + ", "  + eolString +
                        "Instance Name:" + System.getProperty("com.sun.aas.instanceName") + ", "  + eolString + 
                        "Stack Trace: " + eolString + errors.toString();
        
        return error;
    }
    
}

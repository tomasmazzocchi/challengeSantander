package conf;

import com.fasterxml.jackson.databind.cfg.HandlerInstantiator;
import com.mycompany.wsschallengesantander.client.RestTemplateRequest;
import java.nio.charset.StandardCharsets;
import static org.junit.Assert.assertTrue;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.http.converter.json.SpringHandlerInstantiator;
import org.springframework.web.client.RestTemplate;

@Configuration
@ComponentScan(basePackages = {"com.mycompany.wsschallengesantander"})
public class TestConfig {

    @Bean
    public HandlerInstantiator handlerInstantiator(ApplicationContext applicationContext) {
        return new SpringHandlerInstantiator(applicationContext.getAutowireCapableBeanFactory());
    }

    @Bean
    public Jackson2ObjectMapperBuilder objectMapperBuilder(HandlerInstantiator handlerInstantiator) {
        Jackson2ObjectMapperBuilder builder = new Jackson2ObjectMapperBuilder();
        builder.handlerInstantiator(handlerInstantiator);
        return builder;
    }

    @Autowired
    public void restTemplateRequest(RestTemplateRequest restTemplateRequest) {
        RestTemplate restTemplate = restTemplateRequest;
        restTemplate.getMessageConverters().add(0, new StringHttpMessageConverter(StandardCharsets.UTF_8));
    }

//    @Bean
//    public HttpServletRequest getHttpServletRequest() {
//        MockHttpServletRequest m = new MockHttpServletRequest();
//        return m;
//    }
//
//    @Bean
//    public HttpServletResponse getHttpServletResponse() {
//        MockHttpServletResponse m = new MockHttpServletResponse();
//        return m;
//    }

    @Test
    public void avoidAnnoyingErrorMessageWhenRunningTestsInAnt() {
        assertTrue(true); // do nothing;
    }

}

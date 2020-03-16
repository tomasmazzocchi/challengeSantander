package testUnitarios;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.wsschallengesantander.client.MetereologiaClient;
import com.mycompany.wsschallengesantander.client.RestTemplateRequest;
import com.mycompany.wsschallengesantander.client.dtos.MetereologiaDTO;
import conf.TestConfig;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Calendar;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockServletContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.AnnotationConfigContextLoader;
import org.springframework.test.web.client.ExpectedCount;
import org.springframework.test.web.client.MockRestServiceServer;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;
import org.springframework.util.Assert;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = TestConfig.class, loader=AnnotationConfigContextLoader.class)
@SpringApplicationConfiguration( classes = { MockServletContext.class } )
public class MetereologiaServiceMockTest {

    @Autowired
    MetereologiaClient metereologiaClient;
    @Autowired
    RestTemplateRequest restTemplate;
    
    MockRestServiceServer mockServer;
    ObjectMapper mapper = new ObjectMapper();
    MetereologiaDTO metereologiaDTO;
    
    @Before
    public void init() {
        mockServer = MockRestServiceServer.createServer(restTemplate);
    }
     
    @Test                                                                                         
    public void givenMockingIsDoneByMockRestServiceServer_whenGetIsCalled_thenReturnsMockedObject() throws JsonProcessingException, URISyntaxException {   
        MetereologiaDTO met = new MetereologiaDTO(21.5, 1013.0, 50.1, 19.7, 24.0);
        
        mockServer.expect(ExpectedCount.once(), 
          requestTo(new URI("http://dataservice.accuweather.com/forecasts/v1/daily/1day")))
          .andExpect(method(HttpMethod.GET))
          .andRespond(withStatus(HttpStatus.OK)
          .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
          .body(mapper.writeValueAsString(met))
        );                                   
                        
        metereologiaDTO = metereologiaClient.obtenerPronosticoPorDiaYLugar("Almagro, Buenos Aires", Calendar.getInstance());
        mockServer.verify();
        Assert.state(metereologiaDTO.getTemp().toString().equals("21.5"));
    }
}

package testUnitarios;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.wsschallengesantander.client.MetereologiaClient;
import com.mycompany.wsschallengesantander.client.RestTemplateRequest;
import com.mycompany.wsschallengesantander.client.dtos.MetereologiaDTO;
import com.mycompany.wsschallengesantander.model.Meeting;
import com.mycompany.wsschallengesantander.model.Usuario;
import com.mycompany.wsschallengesantander.model.UsuarioAdmin;
import com.mycompany.wsschallengesantander.model.UsuarioNormal;
import com.mycompany.wsschallengesantander.observer.NotificadorMail;
import com.mycompany.wsschallengesantander.repositories.RepositoryMeetings;
import conf.TestConfig;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import org.junit.Assert;
import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.contrib.java.lang.system.SystemOutRule;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockServletContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.AnnotationConfigContextLoader;
import org.springframework.test.web.client.ExpectedCount;
import org.springframework.test.web.client.MockRestServiceServer;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = TestConfig.class, loader = AnnotationConfigContextLoader.class)
@ActiveProfiles("2.16.840.1.113883.2.10.27")
@SpringApplicationConfiguration(classes = {MockServletContext.class})
public class TestUlnitarios {

    @Autowired
    RestTemplateRequest restTemplate;
    @Autowired
    MetereologiaClient metereologiaClient;

    MockRestServiceServer mockServer;
    ObjectMapper mapper = new ObjectMapper();

    RepositoryMeetings repoMeetings = RepositoryMeetings.getInstance();
    List<Usuario> usuariosMeetings1 = new ArrayList<>();
    UsuarioAdmin admin1 = new UsuarioAdmin("tomas", "mazzocchi", "tomasmazzocchi@gmail.com");
    UsuarioNormal user1 = new UsuarioNormal("pepe", "argento", "pepeargento@gmail.com");
    UsuarioNormal user2 = new UsuarioNormal("moni", "argento", "moniargento@gmail.com");
    UsuarioNormal user3 = new UsuarioNormal("elena", "fuseneco", "elenafuseneco@gmail.com");
    Meeting meet1 = new Meeting();

    @Before
    public void setUp() {
        mockServer = MockRestServiceServer.createServer(restTemplate);
    }

    @After
    public void after() {
        meet1.getUsuarios().clear();
        usuariosMeetings1.clear();
    }

    @Test
    public void obtenerTemperatura() throws URISyntaxException, JsonProcessingException {
        MetereologiaDTO met = new MetereologiaDTO(21.5, 1013.0, 50.1, 19.7, 24.0);
        mockServer.expect(requestTo(new URI("http://dataservice.accuweather.com/forecasts/v1/daily/1day")))
                .andExpect(method(HttpMethod.GET))
                .andRespond(withStatus(HttpStatus.OK)
                        .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                        .body(mapper.writeValueAsString(met))
                );

        Double temperatura = metereologiaClient.obtenerPronosticoPorDiaYLugar("Almagro, Buenos Aires", Calendar.getInstance()).getTemp();

        mockServer.verify();

        Assert.assertEquals("21.5", temperatura.toString());
    }

    @Test
    public void usuarioAdminCalculaPackBirrasAComprarMenos24Grados() throws URISyntaxException, JsonProcessingException {
        MetereologiaDTO met = new MetereologiaDTO(21.5, 1013.0, 50.1, 19.7, 24.0);
        mockServer.expect(ExpectedCount.once(),
                requestTo(new URI("http://dataservice.accuweather.com/forecasts/v1/daily/1day")))
                .andExpect(method(HttpMethod.GET))
                .andRespond(withStatus(HttpStatus.OK)
                        .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                        .body(mapper.writeValueAsString(met))
                );

        meet1.setAdmin(admin1);
        meet1.setFecha(Calendar.getInstance());
        meet1.setLugar("Almagro, Buenos Aires");
        meet1.agregarInvitado(user1);
        meet1.agregarInvitado(user2);
        meet1.agregarInvitado(user3);
        int cantidadPacksBirras = admin1.birrasAComprar(metereologiaClient.obtenerPronosticoPorDiaYLugar("Almagro, Buenos Aires", Calendar.getInstance()).getTemp(), meet1.getCantidadUsuarios());
        mockServer.verify();

        Assert.assertEquals(1, cantidadPacksBirras);
    }

    @Test
    public void usuarioAdminCalculaPackBirrasAComprarMas24GradosYMasDe6Invitados() throws URISyntaxException, JsonProcessingException {
        MetereologiaDTO met = new MetereologiaDTO(29.0, 1013.0, 50.1, 19.7, 24.0);
        mockServer.expect(ExpectedCount.once(),
                requestTo(new URI("http://dataservice.accuweather.com/forecasts/v1/daily/1day")))
                .andExpect(method(HttpMethod.GET))
                .andRespond(withStatus(HttpStatus.OK)
                        .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                        .body(mapper.writeValueAsString(met))
                );

        meet1.setAdmin(admin1);
        meet1.setFecha(Calendar.getInstance());
        meet1.setLugar("Almagro, Buenos Aires");
        meet1.agregarInvitado(user1);
        meet1.agregarInvitado(user2);
        meet1.agregarInvitado(user3);
        meet1.agregarInvitado(user3);
        meet1.agregarInvitado(user3);
        meet1.agregarInvitado(user3);
        int cantidadPacksBirras = admin1.birrasAComprar(metereologiaClient.obtenerPronosticoPorDiaYLugar("Almagro, Buenos Aires", Calendar.getInstance()).getTemp(), meet1.getCantidadUsuarios());
        mockServer.verify();

        Assert.assertEquals(3, cantidadPacksBirras);
    }

    @Test
    public void usuarioAdminAveriguaTemperaturaDeMeeting() throws URISyntaxException, JsonProcessingException {
        MetereologiaDTO met = new MetereologiaDTO(29.0, 1013.0, 50.1, 19.7, 24.0);
        mockServer.expect(ExpectedCount.once(),
                requestTo(new URI("http://dataservice.accuweather.com/forecasts/v1/daily/1day")))
                .andExpect(method(HttpMethod.GET))
                .andRespond(withStatus(HttpStatus.OK)
                        .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                        .body(mapper.writeValueAsString(met))
                );

        meet1.setAdmin(admin1);
        meet1.setFecha(Calendar.getInstance());
        meet1.setLugar("Almagro, Buenos Aires");
        meet1.agregarInvitado(user1);
        meet1.setTemperatura(metereologiaClient.obtenerPronosticoPorDiaYLugar("Almagro, Buenos Aires", Calendar.getInstance()).getTemp());
        mockServer.verify();

        Assert.assertEquals(29.0, admin1.conocerTemperatura(meet1), 0.0);
    }

    @Test
    public void usuarioNormalAveriguaTemperaturaDeMeeting() throws URISyntaxException, JsonProcessingException {
        MetereologiaDTO met = new MetereologiaDTO(19.0, 1013.0, 50.1, 19.7, 24.0);
        mockServer.expect(ExpectedCount.once(),
                requestTo(new URI("http://dataservice.accuweather.com/forecasts/v1/daily/1day")))
                .andExpect(method(HttpMethod.GET))
                .andRespond(withStatus(HttpStatus.OK)
                        .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                        .body(mapper.writeValueAsString(met))
                );

        meet1.setAdmin(admin1);
        meet1.setFecha(Calendar.getInstance());
        meet1.setLugar("Almagro, Buenos Aires");
        meet1.agregarInvitado(user1);
        meet1.setTemperatura(metereologiaClient.obtenerPronosticoPorDiaYLugar("Almagro, Buenos Aires", Calendar.getInstance()).getTemp());
        mockServer.verify();

        Assert.assertEquals(19.0, user1.conocerTemperatura(meet1), 0.0);
    }

    @Rule
    public final SystemOutRule systemOutRule = new SystemOutRule().enableLog();

    @Test
    public void enviarNotificacionMailAUsuarioYAdmin() {
        usuariosMeetings1.add(user1);
        repoMeetings.getMeetings().add(meet1);
        NotificadorMail observer1 = new NotificadorMail(user1.getMail());
        NotificadorMail observer2 = new NotificadorMail(admin1.getMail());
        repoMeetings.getMeetings().get(0).addObserver(observer1);
        repoMeetings.getMeetings().get(0).addObserver(observer2);

        repoMeetings.getMeetings().get(0).notifyObservers();

        Assert.assertTrue(systemOutRule.getLog().contains("pepeargento@gmail.com") && systemOutRule.getLog().contains("tomasmazzocchi@gmail.com"));
    }

    @Test
    public void usuarioNormalHaceChekInAvisandoQueEstuvoAlli() {
        repoMeetings.getMeetings().add(meet1);
        usuariosMeetings1.add(user1);
        usuariosMeetings1.add(user2);
        usuariosMeetings1.add(user3);
        NotificadorMail observer1 = new NotificadorMail(user1.getMail());
        NotificadorMail observer2 = new NotificadorMail(admin1.getMail());
        NotificadorMail observer3 = new NotificadorMail(user2.getMail());
        NotificadorMail observer4 = new NotificadorMail(user3.getMail());
        repoMeetings.getMeetings().get(0).addObserver(observer1);
        repoMeetings.getMeetings().get(0).addObserver(observer2);
        repoMeetings.getMeetings().get(0).addObserver(observer3);
        repoMeetings.getMeetings().get(0).addObserver(observer4);

        user3.hacerCheckIn(repoMeetings.getMeetings().get(0));

        Assert.assertTrue(systemOutRule.getLog().contains("pepeargento@gmail.com") && systemOutRule.getLog().contains("tomasmazzocchi@gmail.com") && systemOutRule.getLog().contains("moniargento@gmail.com") && systemOutRule.getLog().contains("elenafuseneco@gmail.com"));
    }

    @Test
    public void usuarioNormalSeInscribeEnUnaMeeting() {
        repoMeetings.getMeetings().add(meet1);
        UsuarioNormal prueba = new UsuarioNormal("prueba", "incripcion", "pruebainscripcion@gmail.com");
        prueba.inscribirseEnMeeting(repoMeetings.getMeetings().get(0), prueba);

        Assert.assertTrue(repoMeetings.getMeetings().get(0).getUsuarios().contains(prueba));
    }

}

package com.mycompany.wsschallengesantander.config;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mycompany.wsschallengesantander.client.RestTemplateRequest;
import com.mycompany.wsschallengesantander.dao.generic.GenericDao;
import com.mycompany.wsschallengesantander.interfaces.generic.GenericService;
import com.mycompany.wsschallengesantander.interfaces.generic.impl.GenericServiceImpl;
import java.nio.charset.StandardCharsets;
import javax.naming.NamingException;
import javax.sql.DataSource;
import net.sf.ehcache.Cache;
import net.sf.ehcache.CacheManager;
import net.sf.ehcache.config.CacheConfiguration;
import net.sf.ehcache.config.PersistenceConfiguration;
import net.sf.ehcache.config.PersistenceConfiguration.Strategy;
import net.sf.ehcache.store.MemoryStoreEvictionPolicy;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.jdbc.datasource.lookup.JndiDataSourceLookup;
import org.springframework.orm.hibernate4.HibernateTransactionManager;
import org.springframework.orm.hibernate4.LocalSessionFactoryBuilder;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.client.RestTemplate;

@Configuration
@ComponentScan(basePackages = {"com.mycompany.wsschallengesantander"})
@EnableTransactionManagement
@EnableAspectJAutoProxy(proxyTargetClass = true)
@EnableScheduling
public class ContextConfiguration {

    private static final String DATASOURCE = "jdbc/pool/santanderPool";
    private static final String USUARIO_CACHE = "usuarioCache";
    private static final String PROP_SHOW_SQL = "hibernate.show_sql";
    private static final String PROP_SECOND_CACHE = "hibernate.cache.use_second_level_cache";
    private static final String PROP_CACHE_PROVIDER = "hibernate.cache.provider_class";
    private static final String CACHE_PROVIDER = "org.hibernate.cache.EhCacheProvider";

    public ContextConfiguration() {
        super();
    }

    @Bean
    public CacheManager getCacheManager() {
        CacheManager manager = CacheManager.create();
        Cache usuarioCache = new Cache(
                new CacheConfiguration(USUARIO_CACHE, 1000)
                        .memoryStoreEvictionPolicy(MemoryStoreEvictionPolicy.LFU)
                        .eternal(false)
                        .timeToLiveSeconds(60)
                        .timeToIdleSeconds(30)
                        .diskExpiryThreadIntervalSeconds(0)
                        .persistence(new PersistenceConfiguration().strategy(Strategy.LOCALTEMPSWAP)));
        if (manager.getCache(USUARIO_CACHE) == null) {
             manager.addCache(usuarioCache);
        }
        return manager;
    }

    @Bean(name = "usuarioCache")
    public Cache getUsuarioCache(CacheManager cacheManager) {
        return cacheManager.getCache(USUARIO_CACHE);
    }

    @Bean
    public DataSource getDataSource() throws NamingException {
        JndiDataSourceLookup dsLookup = new JndiDataSourceLookup();
        DataSource dataSource = dsLookup.getDataSource(DATASOURCE);
        return dataSource;
    }

    @Bean(name = "sessionFactory")
    public SessionFactory getSessionFactory(DataSource dataSource) {

        LocalSessionFactoryBuilder sessionBuilder = new LocalSessionFactoryBuilder(dataSource);

        sessionBuilder.setProperty(PROP_SHOW_SQL, Boolean.TRUE.toString());
        sessionBuilder.setProperty(PROP_SECOND_CACHE, Boolean.FALSE.toString());
        sessionBuilder.setProperty(PROP_CACHE_PROVIDER, CACHE_PROVIDER);

        return sessionBuilder.buildSessionFactory();
    }

    @Bean
    public HibernateTransactionManager getTransactionManager(SessionFactory sessionFactory) {
        HibernateTransactionManager transactionManager = new HibernateTransactionManager(sessionFactory);
        return transactionManager;
    }

    @Bean
    public Jackson2ObjectMapperBuilder objectMapperBuilder() {
        Jackson2ObjectMapperBuilder builder = new Jackson2ObjectMapperBuilder();
        builder.serializationInclusion(JsonInclude.Include.NON_NULL);
        builder.failOnUnknownProperties(false);
        return builder;
    }

//    private GenericService initializeService(GenericService service, GenericDao genericDao) {
//        ((GenericServiceImpl) service).setGenericDao(genericDao);
//        return service;
//    }
//    @Autowired
//    public void clienteService(ClienteService clienteService, ClienteDao clienteDao) {
//        initializeService(clienteService, clienteDao);
//    }
    @Autowired
    public void restTemplateRequest(RestTemplateRequest restTemplateRequest) {
        RestTemplate restTemplate = restTemplateRequest;
        restTemplate.getMessageConverters().add(0, new StringHttpMessageConverter(StandardCharsets.UTF_8));
    }
}

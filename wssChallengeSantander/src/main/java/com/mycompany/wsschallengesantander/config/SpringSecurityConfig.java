package com.mycompany.wsschallengesantander.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
@EnableWebSecurity
@Import(ContextConfiguration.class)
public class SpringSecurityConfig extends WebSecurityConfigurerAdapter {


    public SpringSecurityConfig() {
        super();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .exceptionHandling().and()
                .anonymous().and()
                .servletApi().and()
                .headers().cacheControl().and()
                .authorizeRequests()
                // Allow anonymous resource requests
                .antMatchers("/").permitAll()                                               
                .antMatchers("/logbackAdmin.jsp").permitAll()                
                // Allow anonymous logins
                .antMatchers("/resources/**").permitAll()
                .antMatchers("/api/log").permitAll()                           
                .antMatchers("/api/auth/login").permitAll()                           
                .antMatchers("/api/documento/download/**").permitAll()                           
                // All other request need to be authenticated
                .anyRequest().authenticated().and();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService()).passwordEncoder(new BCryptPasswordEncoder());
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
}

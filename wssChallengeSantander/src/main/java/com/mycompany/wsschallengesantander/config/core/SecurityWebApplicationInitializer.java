package com.mycompany.wsschallengesantander.config.core;

import org.springframework.security.web.context.AbstractSecurityWebApplicationInitializer;
import com.mycompany.wsschallengesantander.config.SpringSecurityConfig;

public class SecurityWebApplicationInitializer extends
		AbstractSecurityWebApplicationInitializer {

	public SecurityWebApplicationInitializer() {
		super(SpringSecurityConfig.class);
	}

}
package com.mycompany.wsschallengesantander.client;

import java.util.Map;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class RestTemplateRequest extends RestTemplate {

    private Map<String, String> headers;

    public RestTemplateRequest addHeaders(Map<String, String> headers) {
        this.headers = headers;
        return this;
    }

    public Map<String, String> getHeaders() {
        return this.headers;
    }
}



package com.mycompany.wsschallengesantander.client.environment;

public class EnvironmentDTO {

    private EndpointDTO endpoint;
    private String oid;
    private String loginPath;
    private String loginType;
    private String logoutPath;

    public EnvironmentDTO() {
    }

    public EnvironmentDTO(EndpointDTO endpoint, String loginPath, String loginType, String logoutPath) {
        this.endpoint = endpoint;
        this.oid = oid;
        this.loginPath = loginPath;
        this.loginType = loginType;
        this.logoutPath = logoutPath;
    }

    public EndpointDTO getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(EndpointDTO endpoint) {
        this.endpoint = endpoint;
    }

    public String getOid() {
        return oid;
    }

    public void setOid(String oid) {
        this.oid = oid;
    }

    public String getLoginPath() {
        return loginPath;
    }

    public void setLoginPath(String loginPath) {
        this.loginPath = loginPath;
    }

    public String getLoginType() {
        return loginType;
    }

    public void setLoginType(String loginType) {
        this.loginType = loginType;
    }

    public String getLogoutPath() {
        return logoutPath;
    }

    public void setLogoutPath(String logoutPath) {
        this.logoutPath = logoutPath;
    }
}

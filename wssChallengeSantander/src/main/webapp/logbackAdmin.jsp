<%@page import="java.util.ArrayList"%>
<%@page import="org.slf4j.event.LoggingEvent"%>
<%@page import="ch.qos.logback.core.Appender"%>
<%@page import="java.util.Iterator"%>
<%@page import="ch.qos.logback.classic.Level"%>
<%@page import="ch.qos.logback.classic.Logger"%>
<%@page import="java.util.List"%>
<%@page import="org.slf4j.LoggerFactory"%>
<%@page import="ch.qos.logback.classic.LoggerContext"%>
<%@ page language="java" contentType="text/html;charset=UTF-8" %>

<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.Enumeration" %>
<%@ page import="java.util.Set" %>
<%@ page import="java.util.Arrays" %>
<%
    long beginPageLoadTime = System.currentTimeMillis();%>

<html>
    <head>
        <title>Administrador de Logback</title>
<!--        <link rel="stylesheet" href="bootstrap.min.css">-->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    </head>
    <body onLoad="javascript:document.logFilterForm.logNameFilter.focus();">

        <%!
            public static String obtenerBotonBootstrapParaLogger(String nivelLog) {
                String claseBoton = "btn-default";
                if (nivelLog.equals("Debug")) {
                    claseBoton = "btn-success";
                }
                if (nivelLog.equals("Info")) {
                    claseBoton = "btn-info";
                }
                if (nivelLog.equals("Trace")) {
                    claseBoton = "btn-primary";
                }
                if (nivelLog.equals("Warn")) {
                    claseBoton = "btn-warning";
                }
                if (nivelLog.equals("Error")) {
                    claseBoton = "btn-danger";
                }
                return claseBoton;
            }

        %>
        <%
            String containsFilter = "Contiene";
            String beginsWithFilter = "Empieza con";

            String[] logLevels = {"Debug", "Info", "Trace", "Warn", "Error", "All", "Off"};
            String targetOperation = (String) request.getParameter("operation");
            String targetLogger = (String) request.getParameter("logger");
            String targetLogLevel = (String) request.getParameter("newLogLevel");
            String logNameFilter = (String) request.getParameter("logNameFilter");
            String logNameFilterType = (String) request.getParameter("logNameFilterType");

        %>
        <div id="content" class="col-md-12">
            <h1>Administrador de Logback</h1>

            <div class="filterForm">

                <form action="logbackAdmin.jsp" name="logFilterForm" class="form-inline">
                    <div class="form-group">
                        <label for="logNameFilter">Filtrar loggers</label>
                        <input class="form-control" name="logNameFilter" type="text" size="50" value="<%=(logNameFilter == null ? "" : logNameFilter)%>"class="filterText"/>
                    </div>
                    <button name="logNameFilterType" value="<%=beginsWithFilter%>" type="submit" class="btn btn-default"><%=beginsWithFilter%></button>
                    <button name="logNameFilterType" value="<%=containsFilter%>" type="submit" class="btn btn-default"><%=containsFilter%></button>
                    <button onclick="javascript:document.logFilterForm.logNameFilter.value = '';" name="logNameClear" value="Clear" type="submit" class="btn btn-default">Resetear</button>
                    <param name="operation" value="changeLogLevel"/>
                </form>
            </div>

            <table cellspacing="1" class="table table-bordered table-condensed table-striped">
                <tr>
                    <th width="25%">Logger</th>

                    <th width="25%">Appenders</th>
                    <th width="15%">Effective Level</th>

                    <th width="35%">Change Log Level To</th>
                </tr>

                <%
                    LoggerContext loggerContext = (LoggerContext) LoggerFactory.getILoggerFactory();
                    List loggers = loggerContext.getLoggerList();

                    HashMap loggersMap = new HashMap(256);
                    Logger rootLogger = (Logger) LoggerFactory.getLogger(Logger.ROOT_LOGGER_NAME);

                    if (!loggersMap.containsKey(rootLogger.getName())) {

                        loggersMap.put(rootLogger.getName(), rootLogger);
                    }

                    for (int i = 0;
                            i < loggers.size();
                            i++) {
                        Logger logger = (Logger) loggers.get(i);

                        if (logNameFilter == null || logNameFilter.trim().length() == 0) {

                            loggersMap.put(logger.getName(), logger);
                        } else if (containsFilter.equals(logNameFilterType)) {

                            if (logger.getName().toUpperCase().indexOf(logNameFilter.toUpperCase()) >= 0) {

                                loggersMap.put(logger.getName(), logger);
                            }

                        } else {
                            // Either was no filter in IF, contains filter in ELSE IF, or begins with in ELSE
                            if (logger.getName().startsWith(logNameFilter)) {

                                loggersMap.put(logger.getName(), logger);
                            }

                        }
                    }
                    Set loggerKeys = loggersMap.keySet();

                    String[] keys = new String[loggerKeys.size()];

                    keys = (String[]) loggerKeys.toArray(keys);

                    Arrays.sort(keys, String.CASE_INSENSITIVE_ORDER);
                    for (int i = 0;
                            i < keys.length;
                            i++) {

                        Logger logger = (Logger) loggersMap.get(keys[i]);

                        // MUST CHANGE THE LOG LEVEL ON LOGGER BEFORE GENERATING THE LINKS AND THE
                        // CURRENT LOG LEVEL OR DISABLED LINK WON'T MATCH THE NEWLY CHANGED VALUES
                        if ("changeLogLevel".equals(targetOperation) && targetLogger.equals(logger.getName())) {

                            Logger selectedLogger = (Logger) loggersMap.get(targetLogger);

                            selectedLogger.setLevel(Level.toLevel(targetLogLevel));
                        }

                        String loggerName = null;
                        String loggerEffectiveLevel = null;
                        String loggerAppenders = "";
                        if (logger != null) {
                            loggerName = logger.getName();
                            loggerEffectiveLevel = String.valueOf(logger.getEffectiveLevel());

                            // appenders
                            Iterator iterator = logger.iteratorForAppenders();
                            while (iterator.hasNext()) {
                                loggerAppenders += (loggerAppenders.length() != 0 ? ":" : "") + ((Appender) iterator.next()).getName();
                            }
                        }
                %>
                <tr>
                    <td style="max-width:500px; overflow-x:auto; "><%=loggerName%>
                    </td>

                    <td><%=loggerAppenders%>
                    </td>
                    <td><%=loggerEffectiveLevel%>

                    </td>
                    <td class="center">
                        <%
                            for (int cnt = 0; cnt < logLevels.length; cnt++) {

                                String url = "logbackAdmin.jsp?operation=changeLogLevel&logger=" + loggerName + "&newLogLevel=" + logLevels[cnt] + "&logNameFilter=" + (logNameFilter != null ? logNameFilter : "") + "&logNameFilterType=" + (logNameFilterType != null ? logNameFilterType : "");

                                if (logger.getLevel() == Level.toLevel(logLevels[cnt]) || logger.getEffectiveLevel() == Level.toLevel(logLevels[cnt])) {

                        %>
                        <!--[<%=logLevels[cnt].toUpperCase()%>]-->
                        <button disabled type="button" class="btn btn-md <%=obtenerBotonBootstrapParaLogger(logLevels[cnt])%>"><%=logLevels[cnt]%></button>
                        <%
                        } else {
                        %>
                        <a href='<%=url%>' style="text-decoration: none;">
                            <button type="button" class="btn btn-md <%=obtenerBotonBootstrapParaLogger(logLevels[cnt])%>"><%=logLevels[cnt]%></button>
                        </a>
                        <%
                                }
                            }
                        %>
                    </td>
                </tr>

                <%
                    }
                %>
            </table>
        </div>
    </body>
</html>


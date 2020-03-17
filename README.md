# challengeSantander
#Con respecto al frontend, por un tema de tiempos, arme la estructura de como lo utilizo actualmente.
#
#Run:
#   Para poder levantar el proyecto front, utilizo la tarea Grunt Serve la cuál corre un servidor de aplicacion glassfish 4 en este caso que cuenta con las propiedades del endpoint del backend y el JDBC con la conexión a la base de datos.
#   El backend se asocia a la misma instancia del servidor de aplicaciones la cual levanta al darle run al proyecto con el Path: /wssChallengeSantander.
#
#Deploy:
# Para el deploy del frontend, ejecuto la tarea Grunt Build la cual genera un .war; el que subo al servidor de apliciones. Haciendo exactamente lo mismo para el backend.
#
#Aclaraciones sobre el codigo:
# Por una cuestión de performance decidí mapear la herencia de Usuario a través de una única tabla en la cual diferenciaría al tipo de Usuario por medio di un flag como puede ser un CHAR TIPO_USUARIO.
# Con respecto a la API del tiempo arme un Client el cual utiliza un un @Autowired de RestTemplateRequest con el que en caso de ser necesario se agregan los headers que requiera el servicio.
# NOTIFICADOR DE MAIL: implementé solamente la interfaz ya que al no contar con el tiempo suficiente no consideré importante perder desarrollar como armar el mensaje y enviarlo por medio de por ejemplo la API de google para gmail.

# challengeSantander
#     appChallenge ------------- Front-End
#     wssChallengeSantander ---- Back-End
#
#
##BACKEND:
# Los paquetes donde se encuentra lo desarrollado son:
#     ../mycompany/wsschallengesantander/model
#     ../mycompany/wsschallengesantander/client
#     ../mycompany/wsschallengesantander/observer
#     ../mycompany/wsschallengesantander/utils
#
# Por una cuestión de performance decidí mapear la herencia de Usuario a través de una "única tabla" en la cual diferenciaría al tipo de Usuario por medio di un flag como puede ser un CHAR TIPO_USUARIO.
# Con respecto a la API del tiempo arme un Client el cual utiliza @Autowired de RestTemplateRequest con el que en caso de ser necesario se agregan los headers que requiera el servicio y realizó la petición. Decidí utilizar la API desde el back-end por seguridad, evitando que quede expuesta en el front.
# NOTIFICADOR DE MAIL: implementé solamente la interfaz ya que al no contar con el tiempo suficiente no consideré importante desarrollar el armado del mensaje y enviarlo por medio de por ejemplo la API de Google.
#
#
#FRONTEND:
#   Por cuestión de tiempos, priorice el back por sobre el front. Desarrollando la estructura base de como lo llevaría a cabo. La misma cuenta con state's de angularJs (con los cuales asocio Controller, HTML y en caso de utilizarse Contents-View) para la navegación intermodulo, modificando el path del aplicativo.
#   A través de distintos "Service.Resource" realizó las diferentes peticiones (GET, POST, PUT, DELETE) con las que por medio del Endpoint del back leído desde el servidor de aplicaciones accedo al Controller correspondiente (utilizando un token generado al momento de iniciar la aplicación)
#
#
#RUN:
#   Para poder levantar el proyecto front, utilizo la tarea Grunt Serve la cuál corre un servidor de aplicacion glassfish 4 en este caso que cuenta con las propiedades del endpoint del backend y el JDBC con la conexión a la base de datos.
#   El backend se asocia a la misma instancia del servidor de aplicaciones la cual levanta al darle run al proyecto con el Path: /wssChallengeSantander.
#
#
#DEPLOY:
# Para el deploy del frontend, ejecuto la tarea Grunt Build la cual genera un .war; el que subo al servidor de apliciones. Haciendo exactamente lo mismo para el backend.
#
# 

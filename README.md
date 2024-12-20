# Sistema de Gestion de Tareas

## Explicación del Funcionamiento: 

El  Sistema de Gestión de Tareas (SGT) es una herramienta que ayuda a organizar el trabajo en equipo dentro de la empresa XYZ. Funciona como un asistente virtual que permite crear tareas, asignarlas a las personas correctas y hacerles seguimiento de manera eficiente. Todo esto ocurre en un entorno seguro, donde cada usuario tiene permisos específicos dependiendo de su rol.<br>

Gestión de Tareas<br>
○ Cada tarea tiene detalles como Título, Descripción, Usuario Asignado, Estado  (Inicializada, Pendiente, Pausada, En progreso, Completada), y Fecha de Vencimiento.<br>
○ Al crear una tarea, usamos Tarea Padre como una referencia que aúna varias tareas menores. Por ejemplo, Preparar presentación de la última iteración de software, que agrupará varias tareas como Preparar documentación, Preparar presentación gráfica, Preparar el despliegue o el entorno de la computadora para que se pueda ejecutar el código, entre otras. De otro modo, una tarea, sería muy genérica pero no detallaría nada o muy específica.<br>
○ Las personas asignadas pueden actualizar el progreso y marcar las tareas como terminadas.<br>
○ Existe un historial que registra todos los cambios realizados para que siempre se sepa qué pasó y cuándo.<br>

Responsabilidades y Permisos:<br>
○ Cada Usuario tiene un permiso que define lo que puede hacer:<br>
■ Administrador: Puede crear, editar y eliminar Tareas, además de gestionar Usuarios.<br>
■ Responsable: Supervisa tareas de su área y puede hacer ajustes.<br>
■ Asignado: Actualiza el avance de las tareas que le corresponden.<br>
○ Este sistema es granular, lo que significa que los permisos están definidos con mucho detalle. Por ejemplo, un Usuario solo puede modificar las Tareas que están en su área o que se le han asignado.<br>

Seguridad:<br>
○ Los Usuarios deben iniciar sesión para acceder al sistema.<br>
○ Cada acción (como crear o editar una Tarea) está protegida por permisos, evitando que alguien haga cambios no autorizados.<br>
○ Las contraseñas están encriptadas, así que nadie puede acceder a ellas directamente.<br>

Interfaz Amigable:<br>
○ Los Usuarios ven una Lista deTareas con toda la información necesaria.<br>
○ Los botones (como Editar o Eliminar) solo están activos si el Usuario tiene permiso para usarlos.<br>
○ Formularios sencillos permiten crear o actualizar tareas rápidamente.<br>

Qué hace especial al Sistema de Gestión de Tareas?<br>

● Modularidad y Escalabilidad: Está diseñado para crecer con las necesidades de la empresa. Si en el futuro se necesitan nuevas funciones, es fácil añadirlas.<br>
● Historial Completo: Nunca se pierde la información porque todo queda registrado.<br>
● Filtros: Se pueden buscar tareas utilizando diferentes filtros: Área, Usuario, Fecha o Estado.<br>
● Pruebas y Mejora Continua: El Sistema se prueba constantemente para garantizar que funciona sin errores.<br>

Beneficios del Sistema de Gestión de Tareas<br>

Organización: Todo está en un solo lugar, y cada tarea tiene un responsable claro.<br>
Seguridad: Las acciones están controladas según el Rol de cada Usuario.
Eficiencia: La interfaz es intuitiva y facilita el trabajo diario.<br>
Trazabilidad: Siempre podemos ver qué ocurrió con una Tarea y quién la modificó.<br>

En resumen, el Sistema de Gestión de Tareas es como un sistema de administración centralizado que mantiene a todos en la misma página y asegura que cada Tarea llegue a buen término de manera eficiente y segura.<br>

Instruciones para correrlo con docker

1- En el raiz del proyecto crear la imagen de node:
docker build -t gestor-image .

2- Correr el contenedor con esa imagen:
docker run -d -p 3000:3000 --env-file .env gestor-image

3- La base de datos ya esta configurada para correr en Mongo Atlas.

4- Correr la aplicacion en el navegador
loclahost:3000

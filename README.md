# Ecommerce de JGDA

Este es un proyecto de Ecommerce desarrollado como parte del curso de Backend de Coderhouse. El proyecto implementa varias funcionalidades comunes en una tienda en línea utilizando tecnologías como Node.js, Express, MongoDB, Mongoose, Handlebars y Socket.io.

## Descripción breve del proyecto

El proyecto de Ecommerce de JGDA permite a los usuarios navegar por productos, añadir productos a su carrito, y finalizar compras. Incluye autenticación de usuarios, manejo de sesiones, y comunicación en tiempo real con WebSockets.

## Instalación

Para instalar y configurar el proyecto, sigue estos pasos:

1. Clona el repositorio:

    git clone https://github.com/josediazangarita/proyectoBackendJoseDiazAngarita.git
    cd proyectoBackendJoseDiazAngarita

2. Instala las dependencias:

    npm install

3. Configura las variables de entorno creando un archivo `.env` en la raíz del proyecto con el siguiente formato:

    PORT=8080
    MONGODB_URI=mongodb_uri
    MONGODB_URI_TEST=mongodb_uri
    SESSION_SECRET=tu_secreto_de_sesion
    GITHUB_CLIENT_ID=XXXXXXXXX
    GITHUB_CLIENT_SECRET=XXXXXXXXX

## Uso

Para iniciar el servidor usamos un patrón Factory para escoger la persistencia a utilizar. Utilizaremos los siguientes comandos:

    npm start mongo (para utilizar el DAO de Mongo)
 
    (npm start memory (para utilizar el DAO de FileSystem) Aún se encuentra en desarrollo...)

Esto iniciará el servidor en modo desarrollo utilizando `nodemon`, lo que permite la recarga automática cuando se detectan cambios en el código.

## Scripts Disponibles

En el archivo `package.json` se definen los siguientes scripts:

    ```json
    {
    "scripts": {
        "start": "NODE_ENV=production node src/app.js",
        "dev": "NODE_ENV=development nodemon src/app.js",
        "test": "mocha test/**"
  },
    }
    ```
- **start**: Inicia la aplicación en modo production con `node` y la colección `test` de MongoDB Atlas (comando inicialización: `npm start mongo`).
- **dev**: Inicia la aplicación en modo desarrollo con `nodemon` y la colección `Ecommerce` de MongoDB Atlas (comando inicialización: `npm run dev mongo`).
- **test**: Inicia los test: comando inicialización test unitario (no requiere app levantada en el servidor) y de integración (requiere app con servidor activo en modo development): `npm test`, comando inicialización test integración sólamente (requiere servidor activo en modo development): `mocha test ./test/integration/ecommerce.supertest.test.js`.

## Dependencias

Las dependencias principales del proyecto incluyen:

- `bcrypt`: Para el hashing de contraseñas.
- `connect-mongo`: Para almacenar sesiones en MongoDB.
- `cookie-parser`: Para el manejo de cookies.
- `dotenv`: Para cargar variables de entorno.
- `express`: Framework de servidor web.
- `express-handlebars`: Motor de plantillas.
- `express-session`: Para el manejo de sesiones.
- `express-socket.io-session`: Para compartir sesiones entre Express y Socket.io.
- `handlebars`: Motor de plantillas.
- `mongodb` y `mongoose`: Para el manejo de la base de datos MongoDB.
- `mongoose-paginate-v2`: Para la paginación de resultados en Mongoose.
- `multer`: Para el manejo de archivos.
- `passport`, `passport-github2`, `passport-local`: Para la autenticación de usuarios.
- `session-file-store`: Para almacenar sesiones en el sistema de archivos.
- `socket.io`: Para la comunicación en tiempo real.
- `sweetalert2`: Para alertas personalizadas en el front-end.
- `uuid`: Para generar identificadores únicos.

## Estructura del Proyecto

    project-root/
    │
    ├── src/                    # Código fuente del proyecto
    │   ├── config/             # Configuraciones de la aplicación
    │   ├── controllers/        # Controladores de la aplicación
    │   ├── dao/                # Acceso a datos (Data Access Object)
    │   ├── data/               # Acceso a datos formato json para FileSystem
    │   ├── dto/                # Objetos de transferencia de datos (Data Transfer Object)
    │   ├── middlewares/        # Middlewares de la aplicación
    │   ├── models/             # Modelos de datos
    │   ├── routes/             # Definición de rutas
    │   ├── services/           # Lógica de negocios
    │   ├── utils/              # Utilidades varias
    │   ├── views/              # Vistas de la aplicación
    │   └── app.js              # Punto de entrada principal
    │
    ├── public/                 # Archivos estáticos
    │
    │
    ├── .env                    # Variables de entorno
    ├── package.json            # Dependencias y scripts del proyecto
    └── README.md               # Documentación del proyecto

## Contribuir

Si deseas contribuir al proyecto, sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/tu-feature`).
3. Realiza tus cambios y haz commit (`git commit -m 'Agrega tu feature'`).
4. Haz push a la rama (`git push origin feature/tu-feature`).
5. Abre un Pull Request.

## Licencia

Este proyecto aún no tiene licencia.

## Contacto

Para consultas o soporte, puedes contactarme a través de:

- Nombre: José Gregorio Díaz
- Correo: josediazangarita@gmail.com
- GitHub: [josediazangarita](https://github.com/josediazangarita)
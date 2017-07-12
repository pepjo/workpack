
Workpack
--------

This project was originaly developed to suit the needs of a collage subject. It's a webpage that manages the workpacks, tasks and resources of a project and outputs a latex document to be handed to the professor. As a webpage, it should be installed on a server.

The project is not being supported, you may open an issue for questions or open pull requests for changes but I will not make more changes to it.

FOR DEVELOPERS
--------------
Hi developers, (follows in catalan, google translate it)

després de fer `git clone` recorda fer `npm install`.

Has de posar un fixer `.env` a la carpeta principal que sigui així:

```
NODE_ENV=development
DATABASE_URL=<databaseURL>
```

RECORDA CANVIAR <databaseURL> per una direcció de postgres vàlida!!

Pots buscar un servei per internet o instalar postgres en local.

La url te la forma:
DATABASE_URL=postgres://postgres:postgres@localhost:5432/workpacks

Un cop tingis aixo configurat has executar `npm run knex -- migrate:latest`

Ja pots fer `npm start` !! Per executar el server a localhost:3000 !! :)

LICENSE
-------

You should not use, modify or distribute any contents of this repository without explicit premisson from the author. Please open an issue if you want to use this code.



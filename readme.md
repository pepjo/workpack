Hi sebas,

després de fer `git clone` recorda fer `npm install`.

Has de posar un fixer `.env` a la carpeta principal que sigui així:

```
NODE_ENV=development
DATABASE_URL=<databaseURL>
```

RECORDA CANVIAR <databaseURL> per una direcció de postgres valida!!

Pots buscar un servei per internet o instalar postgres en local.

La url te la forma:
DATABASE_URL=postgres://postgres:postgres@localhost:5432/workpacks

Un cop tingis aixo configurat has executar `npm run knex -- migrate:latest`

Ja pots fer `npm start` !! Per executar el server a localhost:3000 !! :) 

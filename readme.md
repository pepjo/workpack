Hi developers,

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


NOTA:
He canviat 
```
"bookshelf": "^0.10.3",
"bookshelf-cascade-delete": "^2.0.1",
```

per:
```
"bookshelf": "github:tgriesser/bookshelf#a01208bf651aff59843dff0811f72e7aec48c1e6",
"bookshelf-cascade-delete": "github:seegno/bookshelf-cascade-delete#f1983f9eab5d6348e9941ed2354b12742ee7d1c4",
```

per poder tenir cascade delete amb mes relations

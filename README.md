# Loot Tables

A website made to create, share, and use random tables for loot or random encounters in DnD.

## Running

To run, the following environmental variables should be defined:
* `DATABASE_URL` - A url to a suitable mongoDB database.
* `JWT_SECRET` - A secret key used in signing jwt tokens
* `PORT` - (optional, defaults to 5000) The port for the backend to listen on. In dev mode, the frontend assumes this to be 5000.

These can be defined in a `.env` file. After that is set up, you need to run `npm install` in both the root and `/frontend` directories. Then in the root directory run:

```npm run dev```

### Production

When the environmental variable `NODE_ENV` is `production`, the backend will be able to serve the frontend itself. To do this, the frontend will need to be built using the command:

```npm install --prefix frontend && npm run build --prefix frontend```

Then you simply need to run `npm start`.
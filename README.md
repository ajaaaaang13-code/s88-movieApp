# Reel Catalog

Vue 3 client for the movie catalog API.

## Run locally

```sh
npm install
npm run dev
```

Run `npm run build` to create the production bundle.

## Routes

- `/register` — create an account with email, password, and a client-side password confirmation.
- `/login` — sign in with email and password.
- `/movies` — browse and search the catalog.
- `/movies/:id` — view a movie's details and comments (login required).
- `/admin` — view the catalog in a table (admin required).
- `/addMovie` — create a movie (admin required).

The API base URL is configured in `movieAppClient.json`; API routes are called directly in the page components. The client uses `/users/register`, `/users/login`, `/movies/getMovies`, `/movies/getMovie/:id`, and `/movies/addMovie`. Login credentials use the API's email/password fields; the confirmation field is not sent to the server. Authenticated requests attach the returned token as a Bearer token. Admin access is determined from the login response or token's `role`, `roles`, `admin`, or `isAdmin` claims.

The current Render deployment should be reachable at the configured URL; if a route returns an error, verify the deployed API's route and request contract before relying on live data.

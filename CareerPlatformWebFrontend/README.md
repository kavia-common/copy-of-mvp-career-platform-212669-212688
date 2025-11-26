# Lightweight React Template for KAVIA

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

## Features

- Lightweight: No heavy UI frameworks - uses only vanilla CSS and React
- Modern UI: Clean, responsive design with KAVIA brand styling
- Fast: Minimal dependencies for quick loading times
- Simple: Easy to understand and modify

## Getting Started

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open http://localhost:3000 to view it in your browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## Environment configuration (.env)

The frontend must know where to reach the backend API. You can configure this using one of the following:

1) Single variable (recommended):
- REACT_APP_API_BASE_URL: Full base URL including the API version path, e.g. https://your-backend.example.com/api/v1

2) Composed variables:
- REACT_APP_BACKEND_URL: Backend origin, e.g. https://your-backend.example.com or https://host:3001
- REACT_APP_API_BASE: API base path (defaults to /api/v1)

Notes:
- The client normalizes leading/trailing slashes to prevent double slashes in requests.
- In local dev, if the frontend is on port 3000 and no env variables are set, it will automatically assume the backend is on the same host at port 3001 and use /api/v1 (i.e., https://<host>:3001/api/v1).

Create a `.env` file based on `.env.example`:

```
REACT_APP_API_BASE_URL=https://vscode-internal-12567-beta.beta01.cloud.kavia.ai:3001/api/v1
# OR
# REACT_APP_BACKEND_URL=https://vscode-internal-12567-beta.beta01.cloud.kavia.ai:3001
# REACT_APP_API_BASE=/api/v1
```

Restart the dev server after changing `.env`.

## Login flow and troubleshooting

- Route: `/login` is public (not behind authentication).
- The login form submits to `POST /api/v1/auth/login`.
- On success, the token is stored in `localStorage` (key: `token`) and the app navigates to `/roles`.
- The login request does not attach the `Authorization` header.
- On error, a clear message is shown and the button is disabled while submitting.

If the button does not appear to work:
- Verify the API base URL is correct by setting `.env` as above.
- Ensure the backend is reachable and returns 200 + a JSON containing `token` (or `access_token`).
- Check the browser console/network tab to confirm the request URL looks like: `https://<host>:3001/api/v1/auth/login` and not a 404 on the frontend origin.
- If using a different backend path or response shape, update the environment variables accordingly.

## Customization

### Colors

The main brand colors are defined as CSS variables in `src/App.css`:

```css
:root {
  --kavia-orange: #E87A41;
  --kavia-dark: #1A1A1A;
  --text-color: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --border-color: rgba(255, 255, 255, 0.1);
}
```

### Components

This template uses pure HTML/CSS components instead of a UI framework. You can find component styles in `src/App.css`. 

Common components include:
- Buttons (`.btn`, `.btn-large`)
- Container (`.container`)
- Navigation (`.navbar`)
- Typography (`.title`, `.subtitle`, `.description`)

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

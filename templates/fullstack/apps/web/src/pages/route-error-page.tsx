import { isRouteErrorResponse, Link, useRouteError } from "react-router";

export function RouteErrorPage() {
    const error = useRouteError();
    let message = 'Something went wrong.';

    if (isRouteErrorResponse(error)) {
        message = error.statusText || String(error.status);
    } else if (error instanceof Error) {
        message = error.message;
    }

    return (
        <main style={{ padding: 24 }}>
            <h1>Error</h1>
            <p role='alert'>{message}</p>
            <Link to='/'>Go home</Link>
        </main>
    )
}
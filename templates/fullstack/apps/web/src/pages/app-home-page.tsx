import { Link } from "react-router";

export function AppHomePage() {
    return (
        <main style={{ padding: 24 }}>
            <h1>App (signed in)</h1>
            <p>Protected area for any logged-in user.</p>
            <Link to='/'>Back to home</Link>
        </main>
    )
}
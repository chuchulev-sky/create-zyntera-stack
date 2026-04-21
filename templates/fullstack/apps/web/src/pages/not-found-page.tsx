import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>404</h1>
      <Link to="/">Go home</Link>
    </main>
  )
}

import type { Route } from "./+types/home";
import NavBar from "../components/NavBar.jsx";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumaid" },
    { name: "description", content: "Smart feedback to your dream job." },
  ];
}

export default function Home() {
  return <main className="bg-[url('./public/images/bg-main.svg')] bg-cover">
    <NavBar/>
    <section className="main-section " >
      <div className="page-heading">
      <h1>Track Your Application & Resume Ratings</h1>
<h2>Review your sumbmissions and check AI-powered feedback</h2>
      </div>
    </section>
  </main>;
}

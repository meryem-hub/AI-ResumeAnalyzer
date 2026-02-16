import type { Route } from "./+types/home";
import NavBar from "../components/NavBar.jsx";
import { resumes } from "../constants";
import ResumeCard from "../components/ResumeCard";
import { resume } from "react-dom/server";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumaid" },
    { name: "description", content: "Smart feedback to your dream job." },
  ];
}

export default function Home() {
  return  <main className="bg-[url('./public/images/bg-main.svg')] bg-cover">
    <NavBar/>
    <section className="main-section " >
      <div className="page-heading py-16">
      <h1>Track Your Application & Resume Ratings</h1>
<h2>Review your sumbmissions and check AI-powered feedback</h2>
      </div>
       {resumes.length >0 &&(
      <div className="resumes-section ">

  {
    resumes.map((resume) => (
      <div key={resume.id}>
      <ResumeCard resume={resume} key={resume.id}/>
      </div>
    ))
  }
      </div>
    )}
    </section>

   

  </main>;
}

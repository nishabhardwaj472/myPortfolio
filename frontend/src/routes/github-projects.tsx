import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import useGitHubRepos from "@/hooks/useGitHubRepos";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/github-projects")({
  component: GithubProjects,
});

function GithubProjects() {
  const { repositories: repos, loading, error } = useGitHubRepos();
  const [search, setSearch] = useState("");
  const [languageFilter, setLanguageFilter] = useState("All");

  // Derive language options
  const languages = Array.from(
    new Set(repos.flatMap((r) => (r.language ? [r.language] : [])))
  ).sort();

  const filtered = repos.filter((repo) => {
    const matchesSearch =
      repo.name.toLowerCase().includes(search.toLowerCase()) ||
      (repo.description && repo.description.toLowerCase().includes(search.toLowerCase()));
    const matchesLang = languageFilter === "All" || repo.language === languageFilter;
    return matchesSearch && matchesLang;
  });

  return (
    <main className="portfolio" id="github-projects-page">
      <section className="projects-section section-wrap">
        <div className="section-kicker">
          <span>04 / GITHUB PROJECTS</span>
          <span className="kicker-rule" />
        </div>
        <div className="projects-heading">
          <div>
            <p className="section-eyebrow">OPEN SOURCE SHOWCASE</p>
            <h2>
              All<br />
              <em>GitHub Projects</em>
            </h2>
          </div>
        </div>
        <div className="projects-intro">
          <p>{loading && "Loading..."} {error && `Error: ${error}`}</p>
        </div>
        {!loading && !error && (
          <>
            <div className="search-filter" style={{ marginBottom: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}>
              <input
                type="text"
                placeholder="Search projects…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-search"
                style={{ flex: 1, padding: "0.5rem", borderRadius: "4px" }}
              />
              <select
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
                className="select-language"
                style={{ padding: "0.5rem", borderRadius: "4px" }}
              >
                <option value="All">All Languages</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
            <p>{filtered.length} project{filtered.length !== 1 ? "s" : ""} matched</p>
            <div className="case-studies">
              {filtered.map((repo) => (
                <article className="case-study project-fork" id={repo.id.toString()} key={repo.id}>
                  <div className="case-content">
                    <h3>{repo.name}</h3>
                    <p className="case-subtitle">{repo.description || "No description"}</p>
                    <ul className="case-highlights">
                      <li><span>★ {repo.stargazers_count}</span> Stars</li>
                      <li><span>{repo.language || "Unknown"}</span> Language</li>
                    </ul>
                    <div className="tech-list">{repo.topics?.join(" • ")}</div>
                    <a className="button-primary" href={repo.html_url} target="_blank" rel="noreferrer">
                      View Code
                    </a>
                    {repo.verifiedDemoUrl && (
                      <a className="button-primary" href={repo.verifiedDemoUrl} target="_blank" rel="noreferrer">
                        Live Demo
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
            <a className="button-primary" href="/" data-cursor="BACK HOME">
              <ArrowLeft size={15} /> Back to Portfolio
            </a>
          </>
        )}
      </section>
    </main>
  );
}

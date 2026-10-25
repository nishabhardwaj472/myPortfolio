import { useEffect, useState } from 'react';

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  topics: string[];
  updated_at: string;
  fork: boolean;
  archived: boolean;
  homepage: string | null;
  verifiedDemoUrl?: string;
}

/**
 * Hook to fetch all public repositories for a given GitHub username.
 * It handles pagination, excludes forks/archived by default (configurable via env vars).
 * For each repository, it attempts to verify the `homepage` URL by performing a GET request.
 */
export default function useGitHubRepos() {
  const [repositories, setRepositories] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const username = 'nishabhardwaj472';
  const excludeForks = true; // can be toggled later via config
  const excludeArchived = true;

  useEffect(() => {
    let isCancelled = false;
    const perPage = 100; // max per GitHub API
    const allRepos: GitHubRepo[] = [];

    async function fetchPage(page: number) {
      const url = `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }
        const data: any[] = await response.json();
        const filtered = data.filter((repo) => {
          if (excludeForks && repo.fork) return false;
          if (excludeArchived && repo.archived) return false;
          return true;
        });
        allRepos.push(...filtered);
        // Check if there is a next page via Link header
        const linkHeader = response.headers.get('link');
        const hasNext = linkHeader && linkHeader.includes('rel="next"');
        if (hasNext) {
          await fetchPage(page + 1);
        }
      } catch (err: any) {
        if (!isCancelled) {
          setError(err.message);
        }
      }
    }

    async function verifyDemo(repo: GitHubRepo): Promise<GitHubRepo> {
      if (repo.homepage) {
        try {
          const res = await fetch(repo.homepage, { method: 'HEAD' });
          if (res.ok) {
            repo.verifiedDemoUrl = repo.homepage;
          }
        } catch {
          // ignore failures – not verified
        }
      }
      return repo;
    }

    async function init() {
      setLoading(true);
      await fetchPage(1);
      // Verify demos in parallel (limited concurrency)
      const verified = await Promise.all(allRepos.map(verifyDemo));
      if (!isCancelled) {
        setRepositories(verified);
        setLoading(false);
      }
    }
    init();
    return () => {
      isCancelled = true;
    };
  }, []);

  return { repositories, loading, error };
}

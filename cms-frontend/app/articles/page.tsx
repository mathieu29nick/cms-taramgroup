"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/services/api";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    apiFetch("/articles").then(res => setArticles(res.data));
  }, []);

  const filtered = articles.filter(a => {
    return (
      (!status || a.status === status) &&
      (a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.content.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div>
      <h1>Articles</h1>

      <input
        placeholder="Search..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <select onChange={e => setStatus(e.target.value)}>
        <option value="">All</option>
        <option value="draft">Draft</option>
        <option value="published">Published</option>
        <option value="archived">Archived</option>
      </select>

      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Network</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(a => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.status}</td>
              <td>{a.network}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
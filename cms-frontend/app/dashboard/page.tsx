"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/services/api";

export default function Dashboard() {
  const [articles, setArticles] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    apiFetch("/articles").then(res => setArticles(res.data));
    apiFetch("/notifications").then(setNotifications);
  }, []);

  const total = articles.length;

  const byStatus = {
    draft: articles.filter(a => a.status === "draft").length,
    published: articles.filter(a => a.status === "published").length,
    archived: articles.filter(a => a.status === "archived").length,
  };

  const last5 = articles
    .filter(a => a.status === "published")
    .slice(-5)
    .reverse();

  return (
    <div>
      <h1>Dashboard</h1>

      <h3>Total Articles: {total}</h3>

      <div>
        <p>Draft: {byStatus.draft}</p>
        <p>Published: {byStatus.published}</p>
        <p>Archived: {byStatus.archived}</p>
      </div>

      <h3>Last 5 Published</h3>
      <ul>
        {last5.map(a => (
          <li key={a.id}>{a.title}</li>
        ))}
      </ul>

      <h3>Last Notifications</h3>
      <ul>
        {notifications.slice(-5).map(n => (
          <li key={n.id}>{n.subject}</li>
        ))}
      </ul>
    </div>
  );
}
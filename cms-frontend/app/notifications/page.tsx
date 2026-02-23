"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/services/api";

export default function Notifications() {
  const [data, setData] = useState([]);

  useEffect(() => {
    apiFetch("/notifications").then(setData);
  }, []);

  return (
    <div>
      <h1>Notifications</h1>
      {data.map((n: any) => (
        <div key={n.id}>
          {n.subject} ({n.recipients.length} recipients)
        </div>
      ))}
    </div>
  );
}
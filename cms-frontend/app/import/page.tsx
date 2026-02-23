"use client";

import { useState } from "react";
import { apiFetch } from "@/services/api";

export default function ImportPage() {
  const [message, setMessage] = useState("");

  const handleFile = async (e: any) => {
    const file = e.target.files[0];
    const text = await file.text();
    const json = JSON.parse(text);

    const res = await apiFetch("/import/articles", {
      method: "POST",
      body: JSON.stringify(json),
    });

    setMessage(`Imported ${res.count} articles`);
  };

  return (
    <div>
      <h1>Import JSON</h1>
      <input type="file" onChange={handleFile} />
      <p>{message}</p>
    </div>
  );
}
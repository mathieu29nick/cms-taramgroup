"use client";

import { useState } from "react";
import { apiFetch } from "@/services/api";
import { useRouter } from "next/navigation";

export default function CreateArticle() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    author: "",
    categories: [],
    network: "",
    featured: false
  });

  const [error, setError] = useState("");

  const validate = () => {
    if (form.title.length < 5)
      return "Title must be at least 5 characters";
    if (form.content.length < 50)
      return "Content must be at least 50 characters";
    if (!form.network)
      return "Network required";
    return "";
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) return setError(err);

    await apiFetch("/articles", {
      method: "POST",
      body: JSON.stringify(form),
    });

    router.push("/articles");
  };

  return (
    <div>
      <h1>Create Article</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        placeholder="Title"
        onChange={e => setForm({ ...form, title: e.target.value })}
      />

      <textarea
        placeholder="Content"
        onChange={e => setForm({ ...form, content: e.target.value })}
      />

      <input
        placeholder="Author"
        onChange={e => setForm({ ...form, author: e.target.value })}
      />

      <button onClick={handleSubmit}>Save</button>

      <h3>Preview</h3>
      <h4>{form.title}</h4>
      <p>{form.content}</p>
    </div>
  );
}
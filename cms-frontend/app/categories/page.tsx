"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/services/api";

export default function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    apiFetch("/categories").then(setCategories);
  }, []);

  return (
    <div>
      <h1>Categories</h1>
      {categories.map((c: any) => (
        <div key={c.id} style={{ color: c.color }}>
          {c.name}
        </div>
      ))}
    </div>
  );
}
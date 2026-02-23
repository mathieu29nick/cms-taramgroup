"use client";

import { useEffect, useState } from "react";
import ArticleForm from "@/components/articles/ArticleForm";
import { apiFetch } from "@/services/api";
import { useRouter } from "next/navigation";

export default function NewArticlePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [networks, setNetworks] = useState<any[]>([]);

  useEffect(() => {
    apiFetch("/categories").then(setCategories);
    apiFetch("/networks").then(setNetworks);
  }, []);

  return (
    <ArticleForm
      categories={categories}
      networks={networks}
      onSuccess={() => router.push("/articles")}
    />
  );
}
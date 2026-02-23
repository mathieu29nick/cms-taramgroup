"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ArticleForm from "@/components/articles/ArticleForm";
import { apiFetch } from "@/services/api";

export default function EditArticlePage() {
  const { id } = useParams();
  const router = useRouter();

  const [article, setArticle] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [networks, setNetworks] = useState<any[]>([]);

  useEffect(() => {
    apiFetch(`/articles/${id}`).then(setArticle);
    apiFetch("/categories").then(setCategories);
    apiFetch("/networks").then(setNetworks);
  }, [id]);

  if (!article) return <div>Loading...</div>;

  return (
    <ArticleForm
      article={article}
      categories={categories}
      networks={networks}
      onSuccess={() => router.push("/articles")}
    />
  );
}
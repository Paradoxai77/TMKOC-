import React from "react";
import CategoryDetailClient from "./CategoryDetailClient";
import { CATEGORIES_META } from "@/data/questionsData";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <CategoryDetailClient id={resolvedParams.id} />;
}

export function generateStaticParams() {
  return CATEGORIES_META.map((cat) => ({
    id: cat.id,
  }));
}

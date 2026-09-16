import type { Metadata } from "next";
import { AdminResourceManager } from "@/components/admin/admin-resource-manager";

export const metadata: Metadata = { title: "Manage Categories | Ananda Yoga Demo" };
export default function AdminCategoriesPage() { return <AdminResourceManager resource="categories" />; }

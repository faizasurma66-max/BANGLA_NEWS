import { getAllCategories } from "@/lib/queries";
import { HeaderClient } from "./header-client";

export async function SiteHeader() {
  const cats = await getAllCategories();
  const mainCategories = cats
    .filter((c) => !c.parent_slug && c.slug !== "local-newspaper")
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((c) => ({ slug: c.slug, title: c.title, title_bn: c.title_bn, accent: c.accent }));
  const divisions = cats
    .filter((c) => c.parent_slug === "local-newspaper")
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((c) => ({ slug: c.slug, title: c.title, title_bn: c.title_bn, accent: c.accent }));

  return <HeaderClient mainCategories={mainCategories} divisions={divisions} />;
}

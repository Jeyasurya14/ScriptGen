import { redirect } from "next/navigation";

export default async function AppPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = new URLSearchParams();
  const resolved = await searchParams;

  for (const [key, value] of Object.entries(resolved)) {
    if (typeof value === "string") {
      params.set(key, value);
    }
  }

  redirect(params.size ? `/generate?${params.toString()}` : "/generate");
}

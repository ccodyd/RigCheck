import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { DashboardChrome } from "@/components/dashboard/DashboardChrome";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in?redirect=/dashboard");

  return <DashboardChrome>{children}</DashboardChrome>;
}

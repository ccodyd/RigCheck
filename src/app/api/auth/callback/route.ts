import { NextRequest, NextResponse } from "next/server";
import { createServerClient, createServiceClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const redirect = searchParams.get("redirect") ?? "/dashboard";
  const guestSession = searchParams.get("guestSession");

  if (code) {
    const supabase = await createServerClient();
    await supabase.auth.exchangeCodeForSession(code);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const service = await createServiceClient();

      const { data: profile } = await service
        .from("users")
        .select("id, org_id")
        .eq("id", user.id)
        .single();

      let orgId = profile?.org_id ?? null;

      if (!profile) {
        const fullName: string = user.user_metadata?.full_name ?? user.email ?? "My Account";
        const { data: org } = await service
          .from("organizations")
          .insert({ name: `${fullName}'s Account` })
          .select("id")
          .single();

        orgId = org?.id ?? null;

        if (orgId) {
          await service.from("users").insert({
            id: user.id,
            full_name: user.user_metadata?.full_name ?? null,
            org_id: orgId,
            role: "owner",
          });
        }
      }

      if (guestSession && orgId) {
        await service
          .from("estimates")
          .update({ org_id: orgId })
          .eq("guest_session_id", guestSession)
          .is("org_id", null);
      }
    }
  }

  return NextResponse.redirect(`${origin}${redirect}`);
}

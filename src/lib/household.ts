import { queryOptions, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Task = Tables<"tasks">;
export type Member = { id: string; name: string; email: string; role: "admin" | "morador" };

export type HouseholdContext = {
  userId: string;
  userName: string;
  household: Tables<"households"> | null;
  role: "admin" | "morador" | null;
  isAdmin: boolean;
  members: Member[];
};

export const householdQuery = queryOptions({
  queryKey: ["household"],
  queryFn: async (): Promise<HouseholdContext> => {
    const { data: auth, error: authError } = await supabase.auth.getUser();
    if (authError || !auth.user) throw new Error("Sessão expirada. Entre novamente.");
    const userId = auth.user.id;

    const { data: profile } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", userId)
      .maybeSingle();
    const userName = profile?.name ?? auth.user.email ?? "";

    const { data: membership, error } = await supabase
      .from("memberships")
      .select("household_id, role")
      .eq("user_id", userId)
      .eq("status", "ativo")
      .maybeSingle();
    if (error) throw error;
    if (!membership) {
      return { userId, userName, household: null, role: null, isAdmin: false, members: [] };
    }

    const [householdRes, membersRes] = await Promise.all([
      supabase.from("households").select("*").eq("id", membership.household_id).single(),
      supabase
        .from("memberships")
        .select("user_id, role, created_at, profiles(id, name, email)")
        .eq("household_id", membership.household_id)
        .eq("status", "ativo")
        .order("created_at"),
    ]);
    if (householdRes.error) throw householdRes.error;
    if (membersRes.error) throw membersRes.error;

    const members: Member[] = (membersRes.data ?? []).map((m) => ({
      id: m.user_id,
      name: m.profiles?.name ?? "Morador",
      email: m.profiles?.email ?? "",
      role: m.role as Member["role"],
    }));

    const role = membership.role as Member["role"];
    return {
      userId,
      userName,
      household: householdRes.data,
      role,
      isAdmin: role === "admin",
      members,
    };
  },
});

export function useHousehold() {
  return useQuery(householdQuery);
}

export function tasksQuery(householdId: string) {
  return queryOptions({
    queryKey: ["tasks", householdId],
    queryFn: async (): Promise<Task[]> => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("household_id", householdId)
        .order("due_date", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useTasks(householdId: string | undefined) {
  return useQuery({ ...tasksQuery(householdId ?? ""), enabled: !!householdId });
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

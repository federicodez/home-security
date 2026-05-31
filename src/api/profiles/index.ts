import { supabase } from "@/utils/supabase";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import type { VolunteerWithAssignments } from "@/types";

export type VolunteerAssignment = {
  user_id: string;
  full_name: string | null;
  service_id: string;
  service_name: string;
  station: string | null;
};

export const useProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,

    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) throw error;

      // create profile if missing
      if (!data) {
        const { data: newProfile, error: insertError } = await supabase
          .from("profiles")
          .upsert(
            {
              id: user.id,
              email: user.email,
              full_name:
                user.user_metadata?.full_name ??
                user.user_metadata?.name ??
                null,
              avatar_url:
                user.user_metadata?.avatar_url ??
                user.user_metadata?.picture ??
                null,
            },
            { onConflict: "id" },
          )
          .select()
          .single();

        if (insertError) throw insertError;

        return newProfile;
      }

      return data;
    },
  });
};

export async function fetchVolunteerAssignments() {
  const { data, error } = await supabase.rpc(
    "get_volunteer_service_assignments",
  );

  if (error) {
    throw error;
  }

  return (data ?? []) as VolunteerAssignment[];
}

export function useVolunteerAssignments() {
  return useQuery({
    queryKey: ["volunteer-assignments"],
    queryFn: fetchVolunteerAssignments,
  });
}

export const useVolunteers = () => {
  return useQuery({
    queryKey: ["volunteers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          `
          id,
          full_name,
          email,
          avatar_url,
          role,
          volunteering,

          assignments (
            station,
            service_id,

            service:service_id (
              id,
              name,
              starts_at
            )
          )
        `,
        )
        .eq("volunteering", true)
        .order("full_name");

      if (error) throw error;

      return data as unknown as VolunteerWithAssignments[];
    },
  });
};

export const useUpdateVolunteering = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (volunteering: boolean) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No logged in user");

      const { data, error } = await supabase
        .from("profiles")
        .update({ volunteering })
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
    },
  });
};

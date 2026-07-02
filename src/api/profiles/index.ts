import { supabase } from "@/utils/supabase";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import type { VolunteerWithAssignments, AvailabilityUpdate } from "@/types";

type ProfileUpdate = {
  full_name: string;
};

export type PositionPreference = {
  station: string;
  rank: number;
};

type PositionPreferencesUpdate = {
  stations: string[];
};

type InviteVolunteerInput = {
  email: string;
  full_name: string;
  role?: "admin" | "volunteer";
};

export type VolunteerService = {
  service_id: string;
  service_name: string;
  station: string | null;
};

export type VolunteerAssignments = {
  user_id: string;
  full_name: string | null;
  services: VolunteerService[];
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

  return (data ?? []) as VolunteerAssignments[];
}

export function useVolunteerAssignments() {
  return useQuery({
    queryKey: ["volunteer-assignments"],
    queryFn: fetchVolunteerAssignments,
  });
}

export const useVolunteers = (serviceId: string) => {
  return useQuery({
    queryKey: ["volunteers", serviceId],
    enabled: !!serviceId,
    queryFn: async () => {
      const { data: service, error: serviceError } = await supabase
        .from("services")
        .select("availability_column")
        .eq("id", serviceId)
        .single();

      if (serviceError) throw serviceError;

      const { data, error } = await supabase
        .from("profiles")
        .select(
          `
          id,
          full_name,
          email,
          avatar_url,
          role,

          assignments (
            station,
            service_id,

            service:service_id (
              id,
              name,
              starts_at
            )
          ),

          position_preferences (
            station,
            rank
          )
        `,
        )
        .eq(service.availability_column, true)
        .order("full_name");

      if (error) throw error;

      return data as unknown as VolunteerWithAssignments[];
    },
  });
};

export function usePositionPreferences() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["position-preferences", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("position_preferences")
        .select("station, rank")
        .eq("user_id", user.id)
        .order("rank");

      if (error) throw error;

      return (data ?? []) as PositionPreference[];
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ProfileUpdate) => {
      const fullName = values.full_name.trim();

      if (!fullName) {
        throw new Error("Full name is required");
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No user");

      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName })
        .eq("id", user.id);

      if (error) throw error;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["volunteer-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["volunteers"] });
    },
  });
}

export function useUpdatePositionPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: PositionPreferencesUpdate) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No user");

      const { error: deleteError } = await supabase
        .from("position_preferences")
        .delete()
        .eq("user_id", user.id);

      if (deleteError) throw deleteError;

      const rows = values.stations.map((station, index) => ({
        user_id: user.id,
        station,
        rank: index + 1,
      }));

      if (rows.length === 0) return;

      const { error: insertError } = await supabase
        .from("position_preferences")
        .insert(rows);

      if (insertError) throw insertError;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["position-preferences"] });
      queryClient.invalidateQueries({ queryKey: ["volunteers"] });
    },
  });
}

export function useInviteVolunteer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: InviteVolunteerInput) => {
      const email = values.email.trim().toLowerCase();
      const fullName = values.full_name.trim();

      if (!email) throw new Error("Email is required");
      if (!fullName) throw new Error("Full name is required");

      const { data, error } = await supabase.functions.invoke(
        "invite-volunteer",
        {
          body: {
            email,
            full_name: fullName,
            role: values.role ?? "volunteer",
          },
        },
      );

      if (error) throw error;

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["volunteer-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["volunteers"] });
    },
  });
}

export function useUpdateAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: AvailabilityUpdate) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No user");

      const { error } = await supabase
        .from("profiles")
        .update(values)
        .eq("id", user?.id);

      if (error) throw error;
    },

    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey: ["profile"] });

      const previousProfile = queryClient.getQueryData(["profile"]);

      queryClient.setQueryData(["profile"], (old: any) => ({
        ...old,
        ...values,
      }));

      return { previousProfile };
    },

    onError: (_error, _values, context) => {
      queryClient.setQueryData(["profile"], context?.previousProfile);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["volunteer-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["volunteers"] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      queryClient.invalidateQueries({ queryKey: ["volunteer-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["volunteers"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

import { supabase } from "@/utils/supabase";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import type { VolunteerWithAssignments, AvailabilityUpdate } from "@/types";

type ProfileUpdate = {
  full_name: string;
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

    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey: ["profile"] });

      const previousProfile = queryClient.getQueryData(["profile"]);
      const fullName = values.full_name.trim();

      queryClient.setQueryData(["profile"], (old: any) => ({
        ...old,
        full_name: fullName,
      }));

      return { previousProfile };
    },

    onError: (_error, _values, context) => {
      queryClient.setQueryData(["profile"], context?.previousProfile);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
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

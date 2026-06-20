import { supabase } from "@/utils/supabase";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { AssignmentWithRelations } from "@/types";

export const useAssignmentList = (serviceId?: string) => {
  return useQuery({
    queryKey: ["assignments", serviceId],

    queryFn: async () => {
      let query = supabase
        .from("assignments")
        .select(
          `
          id,
          station,
          service_id,
          user_id,
          service:service_id (
            id,
            name,
            starts_at
          ),
          profile:user_id (
            id,
            full_name,
            email,
            avatar_url,
            role,
            available_8am,
            available_930am,
            available_11am
          ),
          position:station (
            station,
            x,
            y
          )
        `,
        )
        .order("station");

      if (serviceId) {
        query = query.eq("service_id", serviceId);
      }

      const { data, error } = await query;

      if (error) throw new Error(error.message);

      return data as unknown as AssignmentWithRelations[];
    },

    staleTime: 0,
    refetchOnMount: "always",
    refetchOnReconnect: true,
  });
};

export const useUpdateAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      serviceId,
      station,
      profileId,
    }: {
      serviceId: string;
      station: string;
      profileId: string | null;
    }) => {
      const { error } = await supabase.rpc("assign_user_to_station", {
        p_user: profileId,
        p_service: serviceId,
        p_station: station,
      });

      if (error) throw error;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      queryClient.invalidateQueries({ queryKey: ["volunteer-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["volunteers"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

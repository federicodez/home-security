import { supabase } from "@/utils/supabase";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { AssignmentWithRelations } from "@/types";

export const useAssignmentList = () => {
  return useQuery({
    queryKey: ["assignments"],
    queryFn: async () => {
      const { data, error } = await supabase
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
            volunteering
          ),
          position:station (
            station,
            x,
            y
          )
        `,
        )
        .order("station");

      if (error) {
        throw new Error(error.message);
      }
      return data as unknown as AssignmentWithRelations[];
    },
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
    },
  });
};

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
          service:service_id (
            id,
            name,
            starts_at
          ),
          user:user_id (
            id,
            name
          ),
          position:station (
            station,
            x,
            y
          )
        `,
        )
        .order("starts_at", {
          ascending: true,
          foreignTable: "service",
        });

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
      userId,
    }: {
      serviceId: string;
      station: string;
      userId: string | null;
    }) => {
      const { error } = await supabase.rpc("assign_user_to_station", {
        p_user: userId,
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

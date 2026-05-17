import { supabase } from "@/utils/supabase";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

export const useGetServices = () => {
  return useQuery({
    queryKey: ["service"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("starts_at", { ascending: true });

      return data;
    },
  });
};

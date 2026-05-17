import { supabase } from "@/utils/supabase";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

export const getUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase.from("users").select("*");
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

import { supabase } from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";

export const getTeamMembers = () => {
  return useQuery({
    queryKey: ["team_members"],
    queryFn: async () => {
      const { data, error } = await supabase.from("team_members").select("*");
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

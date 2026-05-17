import { supabase } from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";

export const usePositionList = () => {
  return useQuery({
    queryKey: ["positions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("positions").select("*");

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

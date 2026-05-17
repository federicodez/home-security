import { useState, useEffect } from "react";
import { Redirect, Stack, Slot } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";

const Authlayout = () => {
  const { session } = useAuth();
  // const [session, setSession] = useState<Session | null>(null);
  //
  // useEffect(() => {
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     setSession(session);
  //   });
  //
  //   supabase.auth.onAuthStateChange((_event, session) => {
  //     setSession(session);
  //   });
  // }, []);
  // console.log("auth layout: ", session);
  // const { session } = useAuth();
  return session ? <Redirect href={"/"} /> : <Stack />;
};

export default Authlayout;

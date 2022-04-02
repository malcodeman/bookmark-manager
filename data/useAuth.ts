import { useSession } from "../hooks/useSession";

import { supabase } from "../utils/supabaseClient";

const useAuth = () => {
  const session = useSession();

  const signUp = async (values: { email: string; password: string }) => {
    return await supabase.auth.signUp(values);
  };

  const signIn = async (values: { email: string; password: string }) => {
    return await supabase.auth.signIn(values);
  };

  const insertUser = async (values: { id: string; email: string }) => {
    const { id, email } = values;
    return await supabase.from("users").insert([{ id, email }]).single();
  };

  return {
    session,
    signUp,
    signIn,
    insertUser,
  };
};

export default useAuth;

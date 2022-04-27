import { useSession } from "../hooks/useSession";

import { supabase } from "../utils/supabaseClient";

const useAuth = () => {
  const session = useSession();

  const signUp = async (values: { email: string; password: string }) => {
    const taken = await supabase
      .from("users")
      .select("id, email")
      .eq("email", values.email)
      .single();
    if (taken.data) {
      return {
        user: null,
        session: null,
        error: { message: "Email has already been taken" },
      };
    }
    const resp = await supabase.auth.signUp(values, {
      redirectTo: window.location.origin,
    });
    if (resp.user?.email) {
      await insertUser({
        id: resp.user.id,
        email: resp.user.email,
      });
    }
    return resp;
  };

  const signIn = async (values: { email: string; password: string }) => {
    return await supabase.auth.signIn(values, {
      redirectTo: window.location.origin,
    });
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

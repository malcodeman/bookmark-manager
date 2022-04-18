import useSWR from "swr";
import { and } from "ramda";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

import { supabase } from "../utils/supabaseClient";
import { useSession } from "../hooks/useSession";

type User = {
  id: string;
  email: string;
  name: string;
};

const useUser = (): {
  user: User;
  isLoading: boolean;
  error: Error;
  updateUser: (values: {
    name?: string;
  }) => Promise<PostgrestSingleResponse<any>>;
} => {
  const session = useSession();
  const id = session?.user?.id;
  const key = `/users/${id}`;
  const { data, error, mutate } = useSWR(id ? key : null, () => getUser());

  const getUser = async () => {
    const resp = await supabase
      .from("users")
      .select(`id, email, name`)
      .eq("id", id)
      .single();
    if (resp.error) {
      throw resp.error;
    }
    if (resp.data) {
      return resp.data;
    }
  };

  const updateUser = async (values: { name?: string }) => {
    const resp = await supabase.from("users").update(values).eq("id", id);
    mutate(
      (current: User) => {
        return { ...current, ...values };
      },
      { revalidate: false }
    );
    return resp;
  };

  return {
    user: data || {},
    isLoading: and(!error, !data),
    error,
    updateUser,
  };
};

export default useUser;

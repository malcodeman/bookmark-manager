import useSWR from "swr";
import { and } from "ramda";

import { supabase } from "../utils/supabaseClient";

type Collection = {
  id: number;
  name: string;
  created_at: string;
};

const useCollection = (
  id: string | string[] | undefined
): {
  collection: Collection;
  isLoading: boolean;
  error: Error;
} => {
  const key = `/collections/${id}`;
  const { data, error } = useSWR(id ? key : null, () => getCollection());

  const getCollection = async () => {
    const resp = await supabase
      .from("collections")
      .select(`id, name, created_at`)
      .eq("id", id)
      .single();
    if (resp.error) {
      throw resp.error;
    }
    if (resp.data) {
      return resp.data;
    }
  };

  return {
    collection: data || {},
    isLoading: and(!error, !data),
    error,
  };
};

export default useCollection;

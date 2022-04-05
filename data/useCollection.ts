import useSWR, { useSWRConfig } from "swr";
import { and } from "ramda";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

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
  updateCollection: (values: {
    name?: string;
  }) => Promise<PostgrestSingleResponse<any>>;
} => {
  const key = `/collections/${id}`;
  const { data, error } = useSWR(id ? key : null, () => getCollection());
  const { mutate } = useSWRConfig();

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

  const updateCollection = async (values: { name?: string }) => {
    const resp = await supabase.from("collections").update(values).eq("id", id);
    mutate(
      key,
      (current: Collection) => {
        return { ...current, ...values };
      },
      { revalidate: false }
    );
    return resp;
  };

  return {
    collection: data || {},
    isLoading: and(!error, !data),
    error,
    updateCollection,
  };
};

export default useCollection;

import useSWR, { useSWRConfig } from "swr";
import { and } from "ramda";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

import { useSession } from "../hooks/useSession";
import { supabase } from "../utils/supabaseClient";

type Collection = {
  id: number;
  name: string;
};

const useCollections = (): {
  collections: Collection[];
  isLoading: boolean;
  error: Error;
  insertCollection: (name?: string) => Promise<PostgrestSingleResponse<any>>;
  deleteCollection: (id: number) => Promise<PostgrestSingleResponse<any>>;
} => {
  const session = useSession();
  const { data, error } = useSWR("collections", () => getCollections());
  const { mutate } = useSWRConfig();

  const getCollections = async () => {
    const resp = await supabase
      .from("collections")
      .select(`id, name`)
      .eq("user_id", session?.user?.id);
    if (resp.error) {
      throw resp.error;
    }
    if (resp.data) {
      return resp.data;
    }
  };

  const insertCollection = async (name = "Untitled") => {
    const resp = await supabase
      .from("collections")
      .insert([{ user_id: session?.user?.id, name }])
      .single();
    mutate("collections");
    return resp;
  };

  const deleteCollection = async (id: number) => {
    await supabase.from("links").delete().eq("collection_id", id);
    const resp = await supabase
      .from("collections")
      .delete()
      .eq("id", id)
      .single();
    mutate("collections");
    return resp;
  };

  return {
    collections: data || [],
    isLoading: and(!error, !data),
    error,
    insertCollection,
    deleteCollection,
  };
};

export default useCollections;

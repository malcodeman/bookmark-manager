import useSWR, { useSWRConfig } from "swr";
import { and, reject } from "ramda";
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
  const key = "/collections";
  const { data, error } = useSWR(session?.user?.id ? key : null, () =>
    getCollections()
  );
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
    mutate(
      key,
      (items: Collection[]) => {
        return [...items, resp.data];
      },
      { revalidate: false }
    );
    mutate(
      `/collections/${resp.data.id}`,
      () => {
        return { name };
      },
      { revalidate: false }
    );
    mutate(
      `/collections/${resp.data.id}/links`,
      () => {
        return [];
      },
      { revalidate: false }
    );
    return resp;
  };

  const deleteCollection = async (id: number) => {
    await supabase.from("links").delete().eq("collection_id", id);
    const resp = await supabase
      .from("collections")
      .delete()
      .eq("id", id)
      .single();
    mutate(
      key,
      (items: Collection[]) => {
        return reject((item: Collection) => item.id === resp.data.id, items);
      },
      { revalidate: false }
    );
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

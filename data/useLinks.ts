import useSWR, { useSWRConfig } from "swr";
import { and } from "ramda";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

import { supabase } from "../utils/supabaseClient";

type Link = {
  id: number;
  link: string;
};

const useLinks = (
  id: string | string[] | undefined
): {
  links: Link[];
  isLoading: boolean;
  error: Error;
  insertLink: (link: string) => Promise<PostgrestSingleResponse<any>>;
  deleteLink: (id: number) => Promise<PostgrestSingleResponse<any>>;
} => {
  const key = `/collections${id}/links`;
  const { data, error } = useSWR(id ? key : null, () => getLinks());
  const { mutate } = useSWRConfig();

  const getLinks = async () => {
    const resp = await supabase
      .from("links")
      .select(`id, link`)
      .eq("collection_id", id);
    if (resp.error) {
      throw resp.error;
    }
    if (resp.data) {
      return resp.data;
    }
  };

  const insertLink = async (link: string) => {
    const resp = await supabase
      .from("links")
      .insert([{ collection_id: id, link }])
      .single();
    mutate(key);
    return resp;
  };

  const deleteLink = async (id: number) => {
    const resp = await supabase.from("links").delete().eq("id", id);
    mutate(key);
    return resp;
  };

  return {
    links: data || [],
    isLoading: and(!error, !data),
    error,
    insertLink,
    deleteLink,
  };
};

export default useLinks;

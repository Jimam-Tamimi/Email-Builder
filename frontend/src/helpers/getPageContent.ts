"use server"

import axios from "axios";
import { getLocale } from "next-intl/server";
import { cache } from "react";

const getPageContent = cache(async (page: string, locale?:string): Promise<any> => {
  if(!locale){
    locale = await getLocale();
  }
  try {
    const response = await axios.get(`${process?.env?.NEXT_PUBLIC_BASE_URL}/content/${locale}/${page}.json`);
    return response.data;
  } catch (error) {
    // throw error;
  } finally {
  }
  return {}
});


export  default getPageContent
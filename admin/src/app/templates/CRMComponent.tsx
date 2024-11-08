"use client";
import React, { useEffect, useState } from "react";
import CRMList from "./components/CRMList";
import { Button, Flex, Menu, Tabs } from "@mantine/core";
import { RiCustomerService2Fill } from "react-icons/ri";
import { BiAddToQueue } from "react-icons/bi";
import { CgCrown } from "react-icons/cg";
import AddCustomer from "./components/AddCustomer";
import {
  getAllCountries,
  getAllLanguages,
  getAllPositions,
  getAllSectors,
  getAllSources,
} from "./helpers";
import axios from "axios";
import TemplateList from "./components/TemplateList";
import CreateTemplate from "./components/CreateTemplate";
import SearchBar from "./components/SearchBar";
// import { DatesRangeValue } from '@mantine/dates'

export interface CustomerType {
  id: number | null;
  name: string;
  surname?: string | null;
  email?: string | null;
  mobile?: string | null;
  phone?: string | null;
  business_website?: string | null;
  countries?: number[] | CountryType[]; // Assuming countries is an array of strings
  languages?: number[] | LanguageType[]; // Assuming languages is an array of strings
  position?: number | PositionType | null; // Assuming position is a string
  sectors?: number[] | SectorType[]; // Assuming sectors is an array of strings
  source?: number | SourceType | null; // Assuming source is a string
  timestamp?: string; // Assuming timestamp is a string
  situation?: string | null;
  our_client?: boolean;
  note?: string | null;
}
export interface CustomersDataType {
  count: number;
  next: string | null;
  previous: string | null;
  results: CustomerType[];
}

export interface CountryType {
  id: number;
  name: string;
  country_image_url: string;
}

export interface LanguageType {
  id: number;
  lang: string;
  locale: string;
}
export interface PositionType {
  id: number;
  position: string;
}
export interface SectorType {
  id: number;
  sector: string;
}
export interface SourceType {
  id: number;
  source: string;
}

export interface RequiredFormDataType {
  languages: LanguageType[];
  countries: CountryType[];
  positions: PositionType[];
  sectors: SectorType[];
  sources: SourceType[];
}

export default function CRMComponent() {
  const [requiredFormData, setRequiredFormData] =
    useState<RequiredFormDataType>({
      languages: [],
      countries: [],
      positions: [],
      sectors: [],
      sources: [],
    });

  const [customersData, setCustomersData] = useState<CustomersDataType>({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });

  useEffect(() => {
    async function run() {
      const promises = [
        getAllLanguages(),
        getAllCountries(),
        getAllPositions(),
        getAllSectors(),
        getAllSources(),
      ];
      try {
        const res = await Promise.all(promises);

        setRequiredFormData((prevState) => ({
          ...prevState,
          languages: res[0],
          countries: res[1],
          positions: res[2],
          sectors: res[3],
          sources: res[4],
        }));
      } catch (err) {}
    }
    run();

    return () => {};
  }, []);

  return (
    <>
      <Flex my={15} gap={10} align={"flex-end"} justify={"stretch"}>
        <SearchBar />

        <div>
          <CreateTemplate />
        </div>
        <div>
          <Button color="pink"  >
            Import{" "}
          </Button>
        </div>
    
      </Flex>

      <TemplateList />
    </>
  );
}

import { rem, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import React from "react";

export default function SearchBar() {
  return (
    <>
      <TextInput
        placeholder="Search by any field"
        leftSection={
          <IconSearch
            style={{ width: rem(16), height: rem(16) }}
            stroke={1.5}
          />
        }
        w={"-webkit-fill-available"}
        onKeyDown={async (e) => {
          if (e.key === "Enter") {
            
          }
        }}
      />
    </>
  );
}

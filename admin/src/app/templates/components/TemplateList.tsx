"use client";

import {
  Checkbox,
  Flex,
  Loader,
  Modal,
  Table,
  Text,
  Tooltip,
} from "@mantine/core";
import dayjs from "dayjs";
import InfiniteScroll from "react-infinite-scroll-component";
import { useFetchTemplatesInfinite } from "@/hooks/builder/useFetchTemplatesInfinite";
import { useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import classes from "../../table.module.css";
import { MdDeleteOutline } from "react-icons/md";
import Link from "next/link";

export default function TemplateList() {
  const { data, fetchNextPage, hasNextPage } = useFetchTemplatesInfinite();

  // Aggregate all templates from the paginated response
  const templates = data?.pages.flatMap((page) => page.results) || [];

  useEffect(() => {
    console.log({ data });

    return () => {};
  }, [data]);

  return (
    <>
      <Text mb={3}>
        Showing {templates.length} results out of {data?.pages[0].count || 0}.
      </Text>
      <InfiniteScroll
        dataLength={templates.length} // Total number of loaded items
        next={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }} // Fetch next page on scroll
        hasMore={Boolean(hasNextPage)} // Determines if more data is available
        loader={
          <Flex justify="center" align="center">
            <Loader size={30} />
          </Flex>
        }
        style={{ overflowY: "hidden", margin: "5px 0px 0px 0px" }}
      >
        <Table
          highlightOnHover
          withTableBorder
          withRowBorders
          withColumnBorders
          verticalSpacing="md"
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th px="15px">
                <Checkbox />
              </Table.Th>
              <Table.Th>Title</Table.Th>
              <Table.Th>Creator</Table.Th>
              <Table.Th>Created At</Table.Th>
              <Table.Th>Updated At</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {templates.map((template, i) => (
              <Table.Tr key={template?.id}>
                <Table.Td px="15px">
                  <Checkbox />
                </Table.Td>
                <Table.Td>{template?.title}</Table.Td>
                <Table.Td>{template?.creator}</Table.Td>
                <Table.Td>
                  {dayjs(template?.created_at).format("DD/MM/YYYY hh:mm A")}
                </Table.Td>
                <Table.Td>
                  {dayjs(template?.updated_at).format("DD/MM/YYYY hh:mm A")}
                </Table.Td>

                <Table.Td>
                  <Tooltip
                    withArrow
                    transitionProps={{
                      duration: 300,
                      transition: "pop-bottom-left",
                    }}
                    label="Edit Template"
                  >
                    <Link
                      target="_blank"
                      href={`${process?.env?.NEXT_PUBLIC_BUILDER_URL}/${template?.id}/`}
                      className={classes.button}
                    >
                      <FaRegEdit
                        className={classes.action}
                        style={{ color: "var(--mantine-color-green-6)" }}
                      />
                    </Link>
                  </Tooltip>

                  <Tooltip
                    withArrow
                    transitionProps={{
                      duration: 300,
                      transition: "pop-bottom-right",
                    }}
                    label="Delete Template"
                  >
                    <button
                      className={classes.button}
                      onClick={() => {
                        if (
                          confirm(
                            "Are you sure you want to delete this customer?"
                          )
                        ) {
                        }
                      }}
                    >
                      <MdDeleteOutline
                        className={classes.action}
                        style={{ color: "var(--mantine-color-red-7)" }}
                      />
                    </button>
                  </Tooltip>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </InfiniteScroll>
    </>
  );
}

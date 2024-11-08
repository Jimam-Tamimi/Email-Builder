import useCreateTemplate from "@/hooks/builder/useCreateTemplate";
import {
  Button,
  Flex,
  Modal,
  MultiSelect,
  SimpleGrid,
  Textarea,
  TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function CreateTemplate() {
  const [opened, setOpened] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  
  const createTemplate = useCreateTemplate();
  
  
  const onSubmit =  async (data: any) => {
    await createTemplate.mutateAsync({
        title: data.title,
        description: data.description,
        data: [],
      },
      {
        onSuccess: () => {
            reset();
            setOpened(false);
            notifications.show({
                title: 'Success',
                message: "Template Created Successfully",
                color: 'green',
                icon: <IconCheck />,
            })
        }
      }
    );
    console.log(data);
    
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Create Template"
      >
        <Flex
          direction={"column"}
          component="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <SimpleGrid cols={{ base: 1 }} mt="md">
            <TextInput
              type="text"
              error={errors["title"]?.message as React.ReactNode}
              label={`Title`}
              placeholder={`Title`}
              required
              {...register("title")}
            />
          </SimpleGrid>

          <Textarea
            mt={"md"}
            autosize
            minRows={3}
            error={errors["description"]?.message as React.ReactNode}
            required
            label={`Description`}
            placeholder={`Description`}
            {...register("description")}
          ></Textarea>

          {/* <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
            <MultiSelect
              label="Data"
              placeholder="Data"
              data={[]}
              searchable
              defaultValue={['']}
              nothingFoundMessage="Nothing found..."
              onChange={(selectedData) => {
                setValue("data", selectedData);
              }}
              comboboxProps={{
                transitionProps: { transition: "scale-y", duration: 200 },
              }}
            />
          </SimpleGrid> */}

          <Flex justify={"end"}>
            <Button
              style={{ alignSelf: "end", marginTop: "1.3rem" }}
              type="submit"
            >
              Create
            </Button>
          </Flex>
        </Flex>
      </Modal>
      <Button onClick={(e) => setOpened(true)}>Create Template</Button>
    </>
  );
}

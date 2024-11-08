import React, { useRef, useState } from 'react';
import { Text, Group, Button, rem, useMantineTheme, SimpleGrid, Image } from '@mantine/core';
import { Dropzone, FileWithPath, MIME_TYPES } from '@mantine/dropzone';
import { IconCloudUpload, IconX, IconDownload } from '@tabler/icons-react';
import classes from './DropZone.module.css';


interface DropzonePropType {
    accept?: string[],
    title?: string,
    maxSize?:number,
    maxFiles?:number, 
    setFiles?: any
    files?: any[]
}


const CustomDropzone:React.FC<DropzonePropType> = ({ setFiles, files, title, accept, maxFiles}={
  accept:[MIME_TYPES.jpeg, MIME_TYPES.avif, MIME_TYPES.png, MIME_TYPES.svg, MIME_TYPES.webp]
}) => {
  const theme = useMantineTheme();
  const openRef = useRef<() => void>(null); 
  let previews : any = files?.map((file, index) => {
    if(typeof(file)=='string'){
      return <Image key={Math.random()} src={file}  />
    }
    const imageUrl = window.URL.createObjectURL(file);
    return <Image key={index} src={imageUrl}  onLoad={() => window.URL.revokeObjectURL(imageUrl)} />;
  });
 
  return (
    <div className={classes.wrapper}>
      <Dropzone
        openRef={openRef}
        onDrop={(files) => {setFiles(files);  }}
        className={classes.dropzone}
        radius="md"
        accept={accept} 
        maxSize={30 * 1024 ** 2}
        maxFiles={1}
      >
        <div style={{ pointerEvents: 'none' }}>
          <Group justify="center">
            <Dropzone.Accept>
              <IconDownload
                style={{ width: rem(50), height: rem(50) }}
                color={theme.colors.blue[6]}
                stroke={1.5}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                style={{ width: rem(50), height: rem(50) }}
                color={theme.colors.red[6]}
                stroke={1.5}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconCloudUpload style={{ width: rem(50), height: rem(50) }} stroke={1.5} />
            </Dropzone.Idle>
          </Group>

          <Text ta="center" fw={700} fz="lg" mt="xl">
            <Dropzone.Accept>Drop files here</Dropzone.Accept>
            <Dropzone.Reject>You can'tupload this file</Dropzone.Reject>
            <Dropzone.Idle>{title}</Dropzone.Idle>
          </Text>
          <Text ta="center" fz="sm" mt="xs" c="dimmed">
            Drag&apos;n&apos;drop files here to upload. </Text>
        </div>
      </Dropzone>
    {
      previews?.length  == 0 ?
      <Button className={classes.control} size="sm" radius="xl" onClick={() => openRef.current?.()}>
        Select file
      </Button> : 
      <SimpleGrid cols={{ base: 1, sm: 4 }} mt={previews?.length > 0 ? 'xl' : 0}>
        {previews?.reverse()[0]}
      </SimpleGrid>
      }
    </div>
  );
}


export default CustomDropzone
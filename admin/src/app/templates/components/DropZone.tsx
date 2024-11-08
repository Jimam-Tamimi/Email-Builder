import { useRef } from 'react';
import { Text, Group, Button, rem, useMantineTheme } from '@mantine/core';
import { Dropzone, FileWithPath, MIME_TYPES } from '@mantine/dropzone';
import { IconCloudUpload, IconX, IconDownload } from '@tabler/icons-react';
import classes from './DropzoneButton.module.css';

interface PropTypes {
    setFiles: React.Dispatch<React.SetStateAction<FileWithPath[]>>;
    files: FileWithPath[];
}

export default function DataDropzone({ setFiles, files }: PropTypes) {
    const theme = useMantineTheme();
    const openRef = useRef<() => void>(null);
    return (
        <>
            <div className={classes.wrapper}>
                <Dropzone
                    openRef={openRef}
                    onDrop={(f) => { setFiles(f) }}
                    className={classes.dropzone}
                    radius="md"
                    accept={[MIME_TYPES.csv, MIME_TYPES.xls, MIME_TYPES.xlsx]}
                    maxSize={100 * 1024 ** 2}
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
                            <Dropzone.Accept>Drop file here</Dropzone.Accept>
                            <Dropzone.Reject>csv/xls/xlsx file less than 100mb</Dropzone.Reject>
                            <Dropzone.Idle>Upload File</Dropzone.Idle>
                        </Text>
                        <Text ta="center" fz="sm" mt="xs" c="dimmed">
                            Drag&apos;n&apos;drop your file here to upload. We can accept only <i>.csv, .xls, .xlsx</i> file that
                            are less than 100mb in size.
                        </Text>
                    </div>
                </Dropzone>
                {
                    files.length == 0 &&
                    <Button className={classes.control} size="md" radius="xl" onClick={() => openRef.current?.()}>
                        Select files
                    </Button>
                }
            </div>
            {
                files?.map(file => (
                    <Text>{file.path}</Text>
                ))
            }
        </>
    );
}
import { Dropzone, FileWithPath } from '@mantine/dropzone'
import React, { useEffect, useRef, useState } from 'react'
import DataDropzone from './DropZone';
import { Button, Checkbox, Flex, LoadingOverlay } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '@/redux/store';
import { setLoader } from '@/redux/slices/loaderSlice';
import axios from 'axios';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconCross } from '@tabler/icons-react';
import { toCapitalize } from '@/app/address/AddressComponent';
import { CustomersDataType } from '../CRMComponent';
import { sIfPlural } from '../helpers';
import { useDisclosure } from '@mantine/hooks';

interface ImportDataType {
    file: FileWithPath;
    run_process_inside_thread: boolean;
}
interface PropTypes {
    setCustomersData: React.Dispatch<React.SetStateAction<CustomersDataType>>

    setShowImportDataModal: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ImportData({ setCustomersData, setShowImportDataModal }: PropTypes) {
    const [files, setFiles] = useState<FileWithPath[]>([])

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors },
    } = useForm<ImportDataType>({});


    const dispatch = useAppDispatch()
    const [visible, { toggle, close, open }] = useDisclosure(false);

    const onSubmit = async (data: ImportDataType) => {
        if (!data['file']) {
            return
        }
        open()

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}admin/crm/customers/import-customers-data/`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            if (res?.status == 201) {
                setCustomersData(prevState => ({ ...prevState, count: prevState?.count + res?.data?.length, results: [...res?.data.reverse(), ...prevState?.results] }))
                setShowImportDataModal(false)

                notifications.show({
                    title: 'Success',
                    message: `${res?.data?.length} New Customer${sIfPlural(res?.data)} Added`,
                    color: 'green',
                    icon: <IconCheck />,
                })
            } 
           else if (res?.status == 200 && res?.data?.run_process_inside_thread) {
                setShowImportDataModal(false)
                notifications.show({
                    title: 'Success',
                    message: `Customers data will be imported in some time.`,
                    color: 'green',
                    icon: <IconCheck />,
                })
            } 

        } catch (error: any) {
            if (error?.response?.status === 400) {
                notifications.show({
                    title: `Failled`,
                    message: "Please check your file",
                    color: 'red',
                    icon: <IconCross />,
                })
            } else {
                notifications.show({
                    title: `Failled`,
                    message: "Something went wrong",
                    color: 'red',
                    icon: <IconCross />,
                })
            }
        }
        close()
    };



    useEffect(() => {
        if (files.length > 0) {
            setValue("file", files[0])
        }

        return () => {

        }
    }, [files])

    return (
        <Flex onSubmit={handleSubmit(onSubmit)} component='form' direction={'column'} justify={'center'} gap={10} align={"start"}>
            <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

            <DataDropzone files={files} setFiles={setFiles} />
            <Checkbox 
                label="Run Process In Background"
                defaultChecked
                {...register("run_process_inside_thread")}
            />
            <Button style={{alignSelf: "end"}} type='submit'>Submit</Button>

        </Flex>
    )
}

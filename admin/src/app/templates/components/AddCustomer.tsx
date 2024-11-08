import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Form, useForm } from 'react-hook-form';
import { CountryType, CustomerType, CustomersDataType, LanguageType, RequiredFormDataType } from '../CRMComponent';
import { Button, Checkbox, Flex, MultiSelect, Select, SimpleGrid, TagsInput, TextInput, Textarea } from '@mantine/core';
import { getAllCountries } from '../helpers';
import axios from 'axios';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconCross } from '@tabler/icons-react';
import { useAppDispatch } from '@/redux/store';




interface PropTypes {
    requiredFormData: RequiredFormDataType;
    setRequiredFormData: React.Dispatch<React.SetStateAction<RequiredFormDataType>>;
    editableCustomer?: CustomerType;
    setEditableCustomer?: React.Dispatch<React.SetStateAction<CustomerType | undefined>>
    setCustomersData: React.Dispatch<React.SetStateAction<CustomersDataType>>

}

const AddCustomer: React.FC<PropTypes> = ({ requiredFormData, setRequiredFormData, editableCustomer, setCustomersData, setEditableCustomer }) => {

    const { languages, countries, positions, sectors, sources } = requiredFormData

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors },
    } = useForm<CustomerType>({
        defaultValues: editableCustomer ? editableCustomer : {}
    });

    function areObjEqual(obj1: any, obj2: any) {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    }


    const dispatch = useAppDispatch()
    const onSubmit = async (data: CustomerType) => {
        // Handle form submission here 
        try {
            if (editableCustomer) {
                if (areObjEqual(data['countries'], editableCustomer?.countries)) {
                    delete data['countries']
                }
                if (areObjEqual(data['languages'], editableCustomer?.languages)) {
                    delete data['languages']
                }
                if (areObjEqual(data['position'], editableCustomer?.position)) {
                    delete data['position']
                }
                if (areObjEqual(data['sectors'], editableCustomer?.sectors)) {
                    delete data['sectors']
                }
                if (areObjEqual(data['source'], editableCustomer?.source)) {
                    delete data['source']
                }

                const res = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}admin/crm/customers/${editableCustomer?.id}/`, data);
                if (res?.status == 200) {
                    setCustomersData(prevState => {
                        return { ...prevState, results: prevState?.results?.map((customer: CustomerType) => customer.id == res.data.id ? res.data : customer) }
                    })
                    if (setEditableCustomer) {
                        setEditableCustomer(undefined)
                    }

                    notifications.show({
                        title: 'Success',
                        message: "Customer Updated",
                        color: 'green',
                        icon: <IconCheck />,
                    })
                }
            } else {
                const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}admin/crm/customers/`, data);
                if (res?.status == 201) {
                    setCustomersData(prevState => ({ ...prevState, count: prevState?.count + 1, results: [res?.data, ...prevState?.results] }))

                    notifications.show({
                        title: 'Success',
                        message: "New Customer Added",
                        color: 'green',
                        icon: <IconCheck />,
                    })
                }

            }
        } catch (error: any) {
            if (error?.response?.status === 400) {
                const obj = error?.response?.data
                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        notifications.show({
                            title: `Failled`,
                            message: toCapitalize(obj[key][0]),
                            color: 'red',
                            icon: <IconCross />,
                        })
                    }
                }

            }
        }
    };

    const toCapitalize = (str: any): string => {
        return str?.charAt(0)?.toUpperCase() + str?.slice(1);
    };


    return (
        <>
            <Flex direction={"column"} component='form' onSubmit={handleSubmit(onSubmit)}>

                <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                    <TextInput
                        type="text"
                        error={errors["name"]?.message as React.ReactNode}
                        label={`Name`}
                        placeholder={`Name`}
                        required
                        {...register("name")}
                    />

                    <TextInput
                        type="text"
                        error={errors["surname"]?.message as React.ReactNode}
                        label={`Surname`}
                        placeholder={`Surname`}
                        {...register("surname")}
                    />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
                    <TextInput
                        type="text"
                        error={errors["email"]?.message as React.ReactNode}
                        label={`Email`}
                        placeholder={`Email`}

                        {...register("email")}
                    />

                    <TextInput
                        type="tel"
                        error={errors["mobile"]?.message as React.ReactNode}
                        label={`Mobile`}
                        placeholder={`Mobile`}
                        {...register("mobile")}
                    />
                </SimpleGrid>

                <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
                    <TextInput
                        type="tel"
                        error={errors["phone"]?.message as React.ReactNode}
                        label={`Phone`}
                        placeholder={`Phone`}

                        {...register("phone")}
                    />

                    <TextInput
                        type="tel"
                        error={errors["business_website"]?.message as React.ReactNode}
                        label={`Business Website`}
                        placeholder={`Business Website`}
                        {...register("business_website")}
                    />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">

                    <MultiSelect
                        label="Countries"
                        placeholder="Countries"
                        data={countries?.map((country: any) => country?.name)}
                        searchable
                        defaultValue={editableCustomer?.countries ? editableCustomer?.countries?.map((country) => typeof (country) != "number" ? country?.name : '') : []}
                        nothingFoundMessage="Nothing found..."
                        onChange={selectedCountries => {
                            let finalCountryArray = []
                            for (let i = 0; i < selectedCountries.length; i++) {
                                const selectedCountry = selectedCountries[i];
                                let country = countries.find(count => count.name == selectedCountry)
                                if (country) {
                                    finalCountryArray.push(country.id)
                                }
                            }
                            setValue("countries", finalCountryArray)
                        }}
                        comboboxProps={{ transitionProps: { transition: 'scale-y', duration: 200 } }}
                    />
                    <MultiSelect
                        label="Languages"
                        placeholder="Languages"
                        searchable
                        data={languages?.map((language: any) => language?.lang)}
                        nothingFoundMessage="Nothing found..."
                        defaultValue={editableCustomer?.languages ? editableCustomer?.languages?.map((language) => typeof (language) != "number" ? language?.lang : '') : []}
                        onChange={selectedLanguages => {
                            let finalLanguagesArray = []
                            for (let i = 0; i < selectedLanguages.length; i++) {
                                const selectedLang = selectedLanguages[i];
                                let lang = languages.find(lang => lang.lang == selectedLang)
                                if (lang) {
                                    finalLanguagesArray.push(lang.id)
                                }
                            }
                            setValue("languages", finalLanguagesArray)
                        }} comboboxProps={{ transitionProps: { transition: 'scale-y', duration: 200 } }}

                    />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
                    <TagsInput
                        label="Position"
                        placeholder="Position"
                        data={positions?.map((position) => position?.position)}


                        defaultValue={editableCustomer?.position && typeof (editableCustomer?.position) !== "number" ? [editableCustomer?.position?.position] : []}

                        onChange={async selectedPositions => {
                            let finalSelectedPositionId: number | null = null;
                            for (let i = 0; i < selectedPositions.length; i++) {
                                const selectedPosition = toCapitalize(selectedPositions[i]);
                                let position = positions.find(position => position?.position == selectedPosition)
                                if (position) {
                                    finalSelectedPositionId = position.id
                                } else {
                                    try {
                                        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}admin/crm/positions/`, {
                                            position: selectedPosition
                                        });
                                        if (res?.status == 201) {
                                            setRequiredFormData((prevState: RequiredFormDataType) => ({
                                                ...prevState,
                                                positions: [
                                                    res?.data,
                                                    ...prevState.positions,
                                                ]
                                            }))
                                            finalSelectedPositionId = res?.data?.id
                                            notifications.show({
                                                title: 'Success',
                                                message: "New Position Added",
                                                color: 'green',
                                                icon: <IconCheck />,
                                            })
                                        }
                                    } catch (error: any) {
                                        if (error?.response?.status === 400) {
                                            const obj = error?.response?.data
                                            for (const key in obj) {
                                                if (obj.hasOwnProperty(key)) {
                                                    notifications.show({
                                                        title: `Failled`,
                                                        message: toCapitalize(obj[key][0]),
                                                        color: 'red',
                                                        icon: <IconCross />,
                                                    })
                                                }
                                            }

                                        }
                                    }
                                }
                            }
                            setValue("position", finalSelectedPositionId)
                        }}
                        allowDuplicates
                        clearable
                        maxTags={1}
                        comboboxProps={{ transitionProps: { transition: 'scale-y', duration: 200 } }}

                    />
                    <TagsInput
                        label="Sectors"
                        placeholder="Sectors"
                        data={sectors?.map((sector) => sector?.sector)}
                        defaultValue={editableCustomer?.sectors ? editableCustomer?.sectors?.map((sector) => typeof (sector) != "number" ? sector?.sector : '') : []}
                        onChange={async selectedSectors => {
                            let finalSectorsArray = []
                            for (let i = 0; i < selectedSectors.length; i++) {
                                const selectedSec = toCapitalize(selectedSectors[i]);
                                let sec = sectors.find(sec => sec.sector == selectedSec)
                                if (sec) {
                                    finalSectorsArray.push(sec.id)
                                } else {
                                    try {
                                        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}admin/crm/sectors/`, {
                                            sector: selectedSec
                                        });
                                        if (res?.status == 201) {
                                            setRequiredFormData((prevState: RequiredFormDataType) => ({
                                                ...prevState,
                                                sectors: [
                                                    res?.data,
                                                    ...prevState.sectors,
                                                ]
                                            }))
                                            finalSectorsArray.push(res?.data.id)
                                            notifications.show({
                                                title: 'Success',
                                                message: "New Sector Added",
                                                color: 'green',
                                                icon: <IconCheck />,
                                            })
                                        }
                                    } catch (error: any) {
                                        if (error?.response?.status === 400) {
                                            const obj = error?.response?.data
                                            for (const key in obj) {
                                                if (obj.hasOwnProperty(key)) {
                                                    notifications.show({
                                                        title: `Failled`,
                                                        message: toCapitalize(obj[key][0]),
                                                        color: 'red',
                                                        icon: <IconCross />,
                                                    })
                                                }
                                            }

                                        }
                                    }
                                }
                            }
                            setValue("sectors", finalSectorsArray)
                        }}
                        comboboxProps={{ transitionProps: { transition: 'scale-y', duration: 200 } }}
                    />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
                    <TagsInput
                        label="Source"
                        placeholder="Source"
                        data={sources?.map((source) => source?.source)}

                        defaultValue={editableCustomer?.source && typeof (editableCustomer?.source) !== "number" ? [editableCustomer?.source?.source] : [] as string[]}
                        onChange={async selectedSources => {
                            let finalSelectedSourceId: number | null = null;
                            for (let i = 0; i < selectedSources.length; i++) {
                                const selectedSource = toCapitalize(selectedSources[i]);
                                let source = sources.find(source => source.source == selectedSource)
                                if (source) {
                                    finalSelectedSourceId = source.id
                                } else {
                                    try {
                                        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}admin/crm/sources/`, {
                                            source: selectedSource
                                        });
                                        if (res?.status == 201) {
                                            setRequiredFormData((prevState: RequiredFormDataType) => ({
                                                ...prevState,
                                                sources: [
                                                    res?.data,
                                                    ...prevState.sources,
                                                ]
                                            }))
                                            finalSelectedSourceId = res?.data?.id
                                            notifications.show({
                                                title: 'Success',
                                                message: "New Source Added",
                                                color: 'green',
                                                icon: <IconCheck />,
                                            })
                                        }
                                    } catch (error: any) {
                                        if (error?.response?.status === 400) {
                                            const obj = error?.response?.data
                                            for (const key in obj) {
                                                if (obj.hasOwnProperty(key)) {
                                                    notifications.show({
                                                        title: `Failled`,
                                                        message: toCapitalize(obj[key][0]),
                                                        color: 'red',
                                                        icon: <IconCross />,
                                                    })
                                                }
                                            }

                                        }
                                    }
                                }
                            }
                            setValue("source", finalSelectedSourceId)
                        }}
                        allowDuplicates
                        clearable
                        maxTags={1}
                        comboboxProps={{ transitionProps: { transition: 'scale-y', duration: 200 } }}

                    />
                    <Select
                        label="Situation"
                        placeholder="Situation"
                        data={['ACTIVE', 'PASSIVE']}
                        allowDeselect
                        searchable
                        defaultValue={editableCustomer?.situation ? editableCustomer?.situation : ''}
                        comboboxProps={{ transitionProps: { transition: 'scale-y', duration: 200 } }}
                        onChange={e => setValue("situation", e)}

                    />
                </SimpleGrid>
                <Checkbox
                    mt={"xl"}
                    label="Our Client"
                    {...register("our_client")}
                />
                <Textarea
                    mt={'xl'}
                    autosize
                    minRows={5}
                    error={
                        errors["note"]?.message as React.ReactNode
                    }
                    label={`Note`}
                    placeholder={`Note`}
                    {...register("note")}
                ></Textarea>
                <Flex justify={'end'}>
                    {/* <Button style={{ alignSelf: "end", marginTop: "1.3rem", marginRight:"20px" }} onClick={e => {
                        reset({})
                        setValue("countries", [])
                        setValue("languages", [])
                        setValue("position", null)
                        setValue("sectors", [])
                        setValue("source", null)
                        setValue("situation", '')
                    }} color='red' type="reset">Reset</Button> */}
                    <Button style={{ alignSelf: "end", marginTop: "1.3rem" }} type="submit">{editableCustomer ? "Update" : "Add"}</Button>
                </Flex>
            </Flex>


        </>
    )
}


export default AddCustomer
"use client"

import { useAppDispatch } from '@/redux/store'
import { Button, Flex, Select, rem } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconCheck } from '@tabler/icons-react'
import axios from 'axios'
import React, { useRef, useState } from 'react'
import { RiAuctionLine } from 'react-icons/ri'
import { CustomersDataType } from '../CRMComponent'
import { IconCross } from '@tabler/icons-react'
import { useForm } from 'react-hook-form'
import { downloadCSVFile, sIfPlural } from '../helpers'

interface PropTypes {
    setSelectedCustomers: React.Dispatch<React.SetStateAction<number[]>>
    selectedCustomers: number[]
    setCustomersData: React.Dispatch<React.SetStateAction<CustomersDataType>>
    fetchNextCustomerData: () => Promise<void>;
}
type ActionType = "EXPORT" | "DELETE"

export default function BulkAction({ selectedCustomers, setCustomersData, fetchNextCustomerData, setSelectedCustomers }: PropTypes) {
    
    const [selectedAction, setSelectedAction] = useState<ActionType>()
    const dispatch = useAppDispatch()

    
    const bulkDeleteCustomer = async (selectedCustomersArg: number[]) => {
        setActionButtonLoading(true)
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}admin/crm/customers/bulk-delete/`, { customers: selectedCustomersArg });
            if (res?.status == 200) {
                notifications.show({
                    title: `Customers Removed`,
                    message: `${res?.data?.deletedCustomerCount} Customers Removed Successfully!`,
                    color: 'teal',
                    icon: <IconCheck />,
                })
                setCustomersData(prevState => {
                    const result = prevState?.results?.filter(customer => !selectedCustomers?.includes(customer?.id as number))
                    if(result.length<10){
                        fetchNextCustomerData()
                    }
                    return {
                        ...prevState,
                        results: result,
                        count: result?.length,
                    }
                })
                setSelectedCustomers([])
                
            }
        } catch (error: any) {
            notifications.show({
                title: 'Action Failled',
                message: "Failled to remove customers!",
                color: 'red',
                icon: <IconCross />,
            })
        }

        setActionButtonLoading(false)
    }


    const exportSelectedCustomers = async (selectedCustomersArg: number[]) => {
        setActionButtonLoading(true)
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}admin/crm/customers/export-selected-customers/`, { customers: selectedCustomersArg });
            downloadCSVFile(res?.data, 'ExportedRows.csv')
            if (res?.status == 200) {
                notifications.show({
                    title: `Export Successfull!`,
                    message: `${selectedCustomers.length} Customer${sIfPlural(selectedCustomers)} Data Exported Successfully.`,
                    color: 'teal',
                    icon: <IconCheck />,
                }) 
                setSelectedCustomers([])
                
            }
        } catch (error: any) {
            notifications.show({
                title: 'Action Failled',
                message: "Failled to remove customers!",
                color: 'red',
                icon: <IconCross />,
            })
        }

        setActionButtonLoading(false)
    }


    const [actionButtonLoading, setActionButtonLoading] = useState(false)
    return (
        <>

            <Flex my={selectedCustomers?.length > 0 ? 15 : 0} align={"flex-end"} justify={"stretch"}
                style={{
                    visibility: `${selectedCustomers?.length > 0 ? 'visible' : 'hidden'}`,
                    transform: `scaleY(${selectedCustomers?.length > 0 ? '1' : '0'})`,
                    height: `${selectedCustomers?.length > 0 ? '40px' : '0'}`,
                    transition: `all .3s ease-in-out`,
                }} >


                <Select
                    searchable 
                    placeholder="Action"
                    leftSection={<RiAuctionLine style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                    w={"-webkit-fill-available"}
                    mr={selectedAction? 15:0}
                    data={['EXPORT', 'DELETE'] as ActionType[]}
                    allowDeselect
                    onChange={e => setSelectedAction(e as ActionType)}
                    
                />
                <div>
                {
                    selectedAction&&   
                    <Button loading={actionButtonLoading} loaderProps={{type:'dots', size:30}} onClick={e => { 
                        selectedAction=='DELETE'?     bulkDeleteCustomer(selectedCustomers):
                        selectedAction=='EXPORT'?     exportSelectedCustomers(selectedCustomers):''

                    }} color='red'>
                        {
                            selectedAction=='DELETE'? 
                            `Delete ${selectedCustomers.length} Row${selectedCustomers.length>1?'s':''}`
                            :selectedAction=='EXPORT'? 
                            `Export ${selectedCustomers.length} Row${selectedCustomers.length>1?'s':''}`
                            :''
                        }
                    </Button>
                }
                </div>
            </Flex>

        </>
    )
}

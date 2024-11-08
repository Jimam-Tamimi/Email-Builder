"use client"


import { Anchor, Button, Checkbox, Flex, Loader, Menu, Modal, MultiSelect, NavLink, Pill, ScrollArea, Select, Table, Text, TextInput, Tooltip, rem } from '@mantine/core'
import { IconActivity, IconArrowsLeftRight, IconCheck, IconSearch, IconSettings } from '@tabler/icons-react'
import React, { useEffect, useRef, useState } from 'react'
import { CountryType, CustomerType, CustomersDataType, RequiredFormDataType } from '../CRMComponent'
import { FaRegEdit } from 'react-icons/fa'
import { MdDelete, MdDeleteOutline } from 'react-icons/md'
import AddCustomer from './AddCustomer'
import dayjs from 'dayjs'
import axios from 'axios'
import { notifications } from '@mantine/notifications'
import { IconCross } from '@tabler/icons-react'
import { useAppDispatch } from '@/redux/store'
import InfiniteScroll from 'react-infinite-scroll-component';
import { RiAuctionLine } from 'react-icons/ri'
import Filter from './Filter'
import BulkAction from './BulkAction'
import { downloadCSVFile, sIfPlural } from '../helpers'
import ImportData from './ImportData'
import { useDisclosure } from '@mantine/hooks'
import Link from 'next/link'
import { LuView } from 'react-icons/lu'

import classes from '../../table.module.css';
interface PropTypes {
    customersData: CustomersDataType;
    setCustomersData: React.Dispatch<React.SetStateAction<CustomersDataType>>
    requiredFormData: RequiredFormDataType;
    setRequiredFormData: React.Dispatch<React.SetStateAction<RequiredFormDataType>>;


}

interface RightClickContextMenuType {
    clientX: number, clientY: number, customer: CustomerType,
}
export default function CRMList({
    customersData, setCustomersData, requiredFormData, setRequiredFormData

}: PropTypes) {

    const [rightClickContextMenu, setRightClickContextMenu] = useState<RightClickContextMenuType | any>(null)

    const [editableCustomer, setEditableCustomer] = useState<CustomerType | undefined>()
    const [filters, setFilters] = useState<object | undefined>()
    const [filterQuery, setFilterQuery] = useState('')
    const [showImportDataModal, setShowImportDataModal] = useState(false)




    const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
    const toggleRow = (id: number) =>
        setSelectedCustomers((current: any) =>
            current.includes(id) ? current.filter((item: any) => item !== id) : [...current, id]
        );
    const toggleAll = () =>
        setSelectedCustomers((current: any) => (current.length === customersData?.results?.length ? [] : customersData?.results?.map((item) => item.id)));


    const fetchNextCustomerData = async () => {
        if (!customersData?.next) {
            return
        }
        try {
            const res = await axios.get(customersData?.next);

            setCustomersData(prevState => ({ ...res?.data, results: [...prevState?.results, ...res?.data?.results] }))
        } catch (err) {

        }

    }

    const dispatch = useAppDispatch()

    useEffect(() => {
        async function run() {
            try {

                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}admin/crm/customers/`);
                setCustomersData(res?.data)
            } catch (err) {

            }

        }
        run()
        return () => {
            setCustomersData({ count: 0, next: null, previous: null, results: [] })

        }
    }, [])

    const removeCustomer = async (customer: CustomerType) => {
        try {
            const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}admin/crm/customers/${customer?.id}/`);
            setCustomersData((prevState) => {
                return { ...prevState, count: prevState.count - 1, results: prevState?.results.filter((c: CustomerType) => c.id !== customer.id) }
            })
            notifications.show({
                title: 'Customer Removed ',
                message: "Customer Removed Successfully!",
                color: 'teal',
                icon: <IconCheck />,
            })
        } catch (error: any) {
            notifications.show({
                title: 'Action Failled',
                message: "Failled to remove customer!",
                color: 'red',
                icon: <IconCross />,
            })
        }

    }

    const [exportAllBtnLoading, setExportAllBtnLoading] = useState(false)
    return (
        <>
            <CustomerRowContextMenu removeCustomer={removeCustomer} setCustomersData={setCustomersData} setEditableCustomer={setEditableCustomer} rightClickContextMenu={rightClickContextMenu} setRightClickContextMenu={setRightClickContextMenu} />

            <Modal size={"xl"} opened={editableCustomer !== undefined} onClose={() => setEditableCustomer(undefined)} title="Edit Customer">
                <AddCustomer setEditableCustomer={setEditableCustomer} setCustomersData={setCustomersData} editableCustomer={editableCustomer} requiredFormData={requiredFormData} setRequiredFormData={setRequiredFormData} />
            </Modal>

            <Modal keepMounted size={"xl"} opened={filters !== undefined} onClose={() => setFilters(undefined)} title="Filter">
                <Filter setFilterQuery={setFilterQuery} setFilters={setFilters} filters={filters} setCustomersData={setCustomersData} requiredFormData={requiredFormData} setRequiredFormData={setRequiredFormData} />
            </Modal>



            <Modal keepMounted={false} size={"xl"} opened={showImportDataModal} onClose={() => setShowImportDataModal(false)} title="Import Data">
                <ImportData setShowImportDataModal={setShowImportDataModal} setCustomersData={setCustomersData} />
            </Modal>



            <Flex my={15} gap={10} align={"flex-end"} justify={"stretch"}>


                <TextInput

                    placeholder="Search by any field"
                    leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                    w={"-webkit-fill-available"}

                    onKeyDown={async e => {
                        if (e.key === "Enter") {
                            try {

                                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}admin/crm/customers/?search=${e?.currentTarget?.value}`);
                                if (res?.status == 200) {
                                    setCustomersData(prevState => res?.data)
                                }
                            } catch (error: any) {
                                if (error?.response?.status === 400) {
                                    const obj = error?.response?.data
                                    for (const key in obj) {
                                        if (obj.hasOwnProperty(key)) {
                                            notifications.show({
                                                title: `Failled`,
                                                color: 'red',
                                                icon: <IconCross />,
                                            })
                                        }
                                    }
                                } else {
                                    notifications.show({
                                        title: `Failled`,
                                        message: "Something went wrong!",
                                        color: 'red',
                                        icon: <IconCross />,
                                    })

                                }
                            }

                        }

                    }}
                />

                <div>
                    <Button onClick={e => setFilters({})} >Filter</Button>
                </div>
                <div>
                    <Button color='pink' onClick={e => setShowImportDataModal(true)} >Import </Button>
                </div>
                <div>
                    <Button disabled={customersData?.count <= 0} loading={exportAllBtnLoading} loaderProps={{ type: "dots", size: 30 }} color='teal' onClick={async e => {
                        dispatch(setLoader(35))
                        setExportAllBtnLoading(true)
                        try {
                            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}admin/crm/customers/export-filtered-customers/?${filterQuery}`,);
                            downloadCSVFile(res?.data, 'ExportedRows.csv')
                            if (res?.status == 200) {
                                notifications.show({
                                    title: `Export Successfull!`,
                                    message: `${customersData.count} Customer${sIfPlural(selectedCustomers)} Data Exported Successfully.`,
                                    color: 'teal',
                                    icon: <IconCheck />,
                                })
                                setSelectedCustomers([])

                            }
                        } catch (error: any) {
                            notifications.show({
                                title: 'Failled',
                                message: "Failled to export customers data!",
                                color: 'red',
                                icon: <IconCross />,
                            })
                        }
                        setExportAllBtnLoading(false)

                    }} >Export {customersData?.count} Row{customersData?.count > 1 ? 's' : ''} </Button>
                </div>
            </Flex>

            <BulkAction fetchNextCustomerData={fetchNextCustomerData} setSelectedCustomers={setSelectedCustomers} selectedCustomers={selectedCustomers} setCustomersData={setCustomersData} />

            <Text mb={3} >Showing {customersData?.results?.length} results of {customersData?.count} {selectedCustomers.length > 0 ? `and ${selectedCustomers?.length} row${selectedCustomers?.length != 1 ? 's' : ''} selected` : ''} </Text>
            <InfiniteScroll

                dataLength={customersData?.results?.length} //This is important field to render the next data
                next={fetchNextCustomerData}
                hasMore={customersData?.next != null}
                style={{ overflowY: "hidden", margin: '5px 0px 0px 0px' }}
                loader={<Flex justify={'center'} align={"center"} >
                    <Loader size={30} />
                </Flex>
                }

            >
                <div>

                    <Table highlightOnHover stickyHeader withTableBorder withRowBorders withColumnBorders verticalSpacing={"md"} style={{ overflow: "scroll" }}>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th px={"15px"}  >
                                    <Checkbox
                                        onChange={toggleAll}
                                        checked={customersData?.results?.length > 0 && selectedCustomers.length === customersData?.results?.length}
                                        indeterminate={selectedCustomers.length > 0 && selectedCustomers.length !== customersData?.results?.length}
                                    />
                                </Table.Th>
                                <Table.Th>ID</Table.Th>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Surname</Table.Th>
                                <Table.Th>Email</Table.Th>
                                <Table.Th>Mobile</Table.Th>
                                <Table.Th>Phone</Table.Th>
                                <Table.Th>Buisness Website</Table.Th>
                                <Table.Th>Countriy</Table.Th>
                                <Table.Th>Languages</Table.Th>
                                <Table.Th>Position</Table.Th>
                                <Table.Th>Sectors</Table.Th>
                                <Table.Th>Source</Table.Th>
                                <Table.Th>Timestamp</Table.Th>
                                <Table.Th>Situation</Table.Th>
                                <Table.Th>Our Client</Table.Th>
                                <Table.Th miw={"200px"}>Our Note</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>



                            {
                                customersData?.results?.map((customer, i) => (
                                    <Table.Tr onContextMenu={e => {
                                        e.preventDefault()


                                        setRightClickContextMenu({ clientX: e.clientX + window?.scrollX, clientY: e.clientY + window?.scrollY, customer: customer });
                                    }} key={i} >
                                        <Table.Td px={"15px"}>
                                            <Checkbox checked={selectedCustomers.includes(customer?.id as number)} onChange={() => toggleRow(customer.id as number)} />
                                        </Table.Td>
                                        <Table.Td>{customer?.id}</Table.Td>
                                        <Table.Td>{customer?.name}</Table.Td>
                                        <Table.Td>{customer?.surname}</Table.Td>
                                        <Table.Td>{customer?.email}</Table.Td>
                                        <Table.Td>{customer?.mobile}</Table.Td>
                                        <Table.Td>{customer?.phone}</Table.Td>
                                        <Table.Td>
                                            {
                                                customer?.business_website ?
                                                    <Anchor href={customer?.business_website ? customer?.business_website : ''} target="_blank">
                                                        {
                                                            customer?.business_website?.slice(0, 20)}
                                                        {
                                                            customer?.business_website?.length && customer?.business_website?.length > 20 && "..."
                                                        }
                                                    </Anchor> : ''
                                            }
                                        </Table.Td>
                                        <Table.Td>
                                            <Pill.Group >
                                                {customer?.countries?.map((country, i) => (
                                                    <Pill styles={{ root: { background: "#d4efff", color: "black", }, }} key={i} >{typeof (country) !== 'number' ? country?.name : ''}</Pill>
                                                ))}
                                            </Pill.Group>
                                        </Table.Td>
                                        <Table.Td>
                                            <Pill.Group >
                                                {customer?.languages?.map((language, i) => (
                                                    <Pill styles={{ root: { background: "#ffdede", color: "black" } }} key={i} >{typeof (language) !== 'number' ? language?.lang : ''}</Pill>
                                                ))}
                                            </Pill.Group>
                                        </Table.Td>
                                        <Table.Td>{typeof (customer?.position) != 'number' ? customer?.position?.position : ''}</Table.Td>
                                        <Table.Td>
                                            <Pill.Group >
                                                {customer?.sectors?.map((sector, i) => (
                                                    <Pill styles={{ root: { background: "#deffe0", color: "black" } }} key={i} >{typeof (sector) !== 'number' ? sector?.sector : ''}</Pill>
                                                ))}
                                            </Pill.Group>
                                        </Table.Td>
                                        <Table.Td>{typeof (customer?.source) != 'number' ? customer?.source?.source : ''}</Table.Td>

                                        <Table.Td>{typeof (customer?.timestamp) == 'string' ? dayjs(customer?.timestamp).format('DD/MM/YYYY hh:mm A') : ''}</Table.Td>
                                        <Table.Td>{customer?.situation}</Table.Td>
                                        <Table.Td>{customer?.our_client ? <Text c={"green"} size='sm' >YES</Text> : <Text c={"red"} size='sm' >NO</Text>}</Table.Td>
                                        <Table.Td>{customer?.note}</Table.Td>
                                        <Table.Td>
                                            <Tooltip
                                                withArrow
                                                transitionProps={{ duration: 300, transition: "pop" }}
                                                label="Edit Article"
                                            >
                                                <button

                                                    onClick={e => setEditableCustomer(customer)}
                                                    className={classes.button} >

                                                    <FaRegEdit className={classes.action} style={{ color: 'var(--mantine-color-green-6)' }} />
                                                </button>
                                            </Tooltip>

                                            <Tooltip
                                                withArrow
                                                transitionProps={{ duration: 300, transition: "pop-bottom-right" }}
                                                label="Delete Article Group"
                                            >
                                                <button
                                                    className={classes.button}
                                                    onClick={() => { if (confirm("Are you sure you want to delete this customer?")) { removeCustomer(customer) } }}
                                                >
                                                    <MdDeleteOutline className={classes.action} style={{ color: 'var(--mantine-color-red-7)' }} />

                                                </button>
                                            </Tooltip>
                                        </Table.Td>
                                    </Table.Tr>

                                ))
                            }
                        </Table.Tbody>
                    </Table >
                </div>
            </InfiniteScroll>




        </>
    )
}

function CustomerRowContextMenu({ rightClickContextMenu, setRightClickContextMenu, setEditableCustomer, setCustomersData, removeCustomer }: {
    rightClickContextMenu: RightClickContextMenuType,
    setRightClickContextMenu: any,
    setEditableCustomer: React.Dispatch<React.SetStateAction<CustomerType | undefined>>
    removeCustomer: (customer: CustomerType) => Promise<void>;  
    setCustomersData: React.Dispatch<React.SetStateAction<CustomersDataType>>;


}) {
    const contextMenuElm = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
        if (rightClickContextMenu) {
            window.addEventListener("click", e => {
                setRightClickContextMenu(null)
            })
        }
        return () => {

        }
    }, [rightClickContextMenu])


    const dispatch = useAppDispatch()



    return (
        <>

            <Flex w={'300px'} component='div' ref={contextMenuElm} direction={"column"} style={{
                position: 'absolute',
                left: rightClickContextMenu?.clientX ? `${rightClickContextMenu?.clientX}px` : '-100px',
                top: rightClickContextMenu?.clientY ? `${rightClickContextMenu?.clientY}px` : '-100px',
                transition: "opacity .3s ease-in-out, visibility .3s ease-in-out",
                opacity: rightClickContextMenu ? "1" : '0',
                visibility: rightClickContextMenu ? "visible" : "hidden",
                zIndex: 1,
                background: "#0f0e1894",
                backdropFilter: "blur(10px)",
                borderRadius: "5px",
                padding: '2px 0px'
            }}
                gap={1}
            >
                <NavLink
                    component='span'
                    label="Edit Customer"
                    leftSection={<FaRegEdit size="1rem" stroke={1.5} />}
                    variant="subtle"
                    active
                    onClick={e => setEditableCustomer(rightClickContextMenu?.customer)}

                />
                <NavLink
                    href="#required-for-focus"
                    label="Delete Customer"
                    leftSection={<MdDelete size="1rem" stroke={1.5} />}
                    color='red'
                    variant="subtle"
                    active
                    onClick={e => removeCustomer(rightClickContextMenu?.customer)}

                />
            </Flex >


        </>
    )
}

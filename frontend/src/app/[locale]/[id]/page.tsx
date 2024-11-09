"use client"
import Builder from '@/components/Builder/Builder'
import React from 'react'

export default function page({ params }: { params: { id: string } }) {
  const { id } = params;
  
  return (
    <>
        <Builder id={id} />
    </>
  )
}

import React from 'react'
import type { Metadata } from 'next'
import CRMComponent from './CRMComponent';

export const metadata : Metadata  = {
    title: 'CRM | Admin | MFY',
};


export default function page() {
  return (
    <>

    <CRMComponent />
    
    </>
  )
}

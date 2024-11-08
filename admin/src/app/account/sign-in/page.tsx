import React from 'react'
import type { Metadata } from 'next'
import SignIn from './SignIn';

export const metadata : Metadata  = {
    title: 'Sigin IN | MFY Admin',
};


export default function page() {
  return (
    <>

    <SignIn />
    
    </>
  )
}

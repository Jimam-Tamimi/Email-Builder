import { Button } from '@nextui-org/button'
import React from 'react'
import { unstable_setRequestLocale } from 'next-intl/server';

export default async function page({params: {locale}}: {params: {locale: string}}) {
  unstable_setRequestLocale(locale);

  return (
    <>
 
    </>
  )
}
  
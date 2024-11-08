"use client"

import { useState } from 'react';
import {   NavLink } from '@mantine/core';
import { 
  IconLogout,
} from '@tabler/icons-react';
import { HiOutlineNewspaper } from "react-icons/hi2";
import { BiLocationPlus, BiMessageRoundedDetail } from "react-icons/bi";
import { FaHammer, FaRegUserCircle } from "react-icons/fa";
import classes from './Navbar.module.css';
import { TfiWrite } from "react-icons/tfi";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { RootState, useAppDispatch } from '@/redux/store';
import { CgEditNoise } from "react-icons/cg";
import { RiGraduationCapLine } from "react-icons/ri";
import { FaReadme } from "react-icons/fa";
import { CiSettings } from 'react-icons/ci';
import { signOut } from '@/redux/slices/authSlice';
import { MdOutlineEmail } from "react-icons/md";

const data = [
  { link: '/templates', label: 'Templates', icon: MdOutlineEmail, allowedRoles:["ADMIN", "MODERATOR", "USER"] }, 
];

export function Navbar() {
  const pathname = usePathname()
  const dispatch = useAppDispatch()

  const [active, setActive] = useState('Billing');

  const links = data.map((item, i)  => (
    <NavLink 
    component={Link}
    
      className={classes.link}
      active={item.link=== pathname}
      href={item.link}
      key={i}
      label={item.label}
      leftSection={<item.icon size="1.3rem" />}

    />
  ))

  return (
    <>
      <div className={classes.navbarMain}>
         
        {links}
      </div>

      <div className={classes.footer}>
        {/* <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
          <span>Change account</span>
        </a> */}

        <p  className={classes.link} onClick={(event) => (dispatch(signOut()))}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </p>
      </div>
    </>
  );
}
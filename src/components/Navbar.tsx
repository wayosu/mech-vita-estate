'use client';

import Image from 'next/image';
import React from 'react'
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';

const Navbar: React.FC = () => {
  const { user, isSignedIn } = useUser();

  const path = usePathname();

  return (
    <nav className='flex justify-between items-center py-6 px-10 shadow-sm fixed top-0 w-full bg-white'>
      <div className='flex gap-10 items-center'>
        <Image
          src={'/logo.svg'}
          alt='logo'
          width={150}
          height={150}
        />
        <ul className='hidden md:flex gap-10'>
          <Link href={'/'}>
            <li className={`hover:underline text-sm cursor-pointer ${path === '/' && 'font-semibold underline'}`}>For Sale</li>
          </Link>
          <Link href={'/for-rent'}>
            <li className={`hover:underline text-sm cursor-pointer ${path === '/disewakan' && 'font-semibold underline'}`}>For Rent</li>
          </Link>
          <Link href={'/agent-finder'}>
            <li className={`hover:underline text-sm cursor-pointer ${path === '/pencari-agen' && 'font-semibold underline'}`}>Agent Finder</li>
          </Link>
        </ul>
      </div>
      <div className='flex gap-2 items-center'>
        <Link href={'/create-your-ads'}>        
          <Button className='flex gap-1'>
            <Plus />
            Create Your Ads
          </Button>
        </Link>
        {isSignedIn ? (
          <UserButton />
        ) : (
          <Link href={'/sign-in'}>
            <Button variant='outline'>Masuk</Button>
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar;

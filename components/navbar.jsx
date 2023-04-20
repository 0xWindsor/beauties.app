'use client';
import { useState } from "react"
import { CgArrowDown } from 'react-icons/cg'

export default function NavBar() {

    return (
        <section className='container mx-auto px-6 md:px-12 py-6'>
            <div className='bg-white bg-opacity-[0.22] shadow-md rounded-[40px] backdrop-blur'>
                <nav className='flex justify-between items-center py-3 px-6'>

                    {/* BEAUTIES LOGO */}
                    <div className='flex'>
                        <a href='#.' className='flex gap-3 items-center'>
                            <img src="./img/beatuies-ai-logo.png" className='h-12' alt='logo' />
                            <span className='text-white font-bold text-md'>BEATUIES.AI</span>
                        </a>
                    </div>

                    {/* MENU */}
                    <div className='hidden xl:flex gap-16 items-center lg:-ml-[30rem]'>
                        <a href='#.' className='text-white text-opacity-[0.5] hover:text-opacity-100 font-normal text-md'>Collections</a>
                        <a href='#.' className='text-white text-opacity-[0.5] hover:text-opacity-100 font-normal text-md'>How to use</a>
                        <a href='#.' className='text-white text-opacity-[0.5] hover:text-opacity-100 font-normal text-md'>History</a>
                    </div>

                    {/* PROFILE */}
                    <div className='hidden md:flex gap-5 items-center'>
                        <div className='flex'>
                            <a href='#.' className=' flex items-center gap-2 text-[#016DD0] border rounded-3xl px-6 py-3 bg-white hover:bg-transparent hover:text-white'>
                                <img src={"./img/profile-photo.png"} className='h-8' />
                                <span className='font-normal text-md flex gap-4 items-center'>demo <CgArrowDown /></span>
                            </a>
                        </div>
                    </div>
                </nav>
            </div>
        </section>
    )
}

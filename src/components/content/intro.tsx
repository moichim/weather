"use client"

import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import Timeline from './timeline'

import Image from 'next/image'
import logo from "../../../public/logo.svg"

const navigation = [
    { name: 'Product', href: '#' },
    { name: 'Features', href: '#' },
    { name: 'Marketplace', href: '#' },
    { name: 'Company', href: '#' },
]

export default function Intro() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <>

            <header className="absolute inset-x-0 top-0 z-50">
                <nav className="flex items-center justify-between p-6 lg:px-8 maw-w-screen-xl" aria-label="Global">
                    <div className="flex lg:flex-1">
                        <a href="#" className="-m-1.5 p-1.5">
                            <span className="sr-only">LabIR Edu</span>
                            <Image 
                                src={logo}
                                alt="LabIR Edu"
                                width="150"
                            />
                        </a>
                    </div>
                    
                    {/*
                    <div className="flex lg:hidden">
                        <button
                            type="button"
                            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-primary"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="hidden lg:flex lg:gap-x-12">
                        {navigation.map((item) => (
                            <a key={item.name} href={item.href} className="text-sm leading-6 text-background">
                                {item.name}
                            </a>
                        ))}
                    </div>
                    */}
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                        <a href="https://edu.labir.cz" className="text-sm leading-6 text-background">
                            O platformě <span className="border-b-1 border-b-primary">edu.labir.cz</span> <span aria-hidden="true">&rarr;</span>
                        </a>
                    </div>
                </nav>
            </header>

            <div className="relative isolate px-6 pt-14 lg:px-8">
                <div
                    className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                    aria-hidden="true"
                >
                    <div
                        className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#0011ff] to-[#ff00c8] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                    />
                </div>
                <div className="mx-auto max-w-screen-xl py-20 sm:py-20 lg:py-24">

                    <div className="flex flex-auto w-full gap-4 items-center">

                        <div className="w-full md:w-1/2">

                            <div className="mb-8 flex justify-start">
                                <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-primary ring-1 ring-primary hover:ring-gray-900/20">
                                    2023 / 2024 - Pilotní ročník
                                </div>
                            </div>
                            <div className="text-left">
                                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                                    Environmentální výchova pro ZŠ
                                </h1>
                                <p className="mt-6 text-lg leading-8 text-primary">
                                    10 západočeských škol využívají termokamery a meteostanice k analýze konkrétních lokalit
                                </p>
    
                            </div>

                        </div>

                        <div className="w-full md:w-1/2">

                            <Timeline />

                        </div>

                    </div>

                </div>
                <div
                    className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                    aria-hidden="true"
                >
                    <div
                        className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                    />
                </div>
            </div>

        </>
    )
}

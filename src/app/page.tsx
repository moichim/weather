import Image from 'next/image'

import { Button } from '@nextui-org/button';
import { Input, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/react';
import Link from 'next/link';
import { Header } from '@/components/header/header';
import { GraphSettings } from '@/components/graph/graphSettings';
import Graph from '@/components/graph/graph';

export default function Home() {

  return <>
    <Header />
    <div className="flex">
      <Graph />
      <GraphSettings />
    </div>
  </>
}

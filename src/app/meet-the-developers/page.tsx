
'use client';

import { useUser, useFirestore, useMemoFirebase } from '@/firebase/provider';
import { doc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, UserCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import developers from '@/lib/dev_data.json';
import Header from '@/components/header';
import Footer from '@/components/footer';

import SimitModi from '@/lib/Simit_Modi.PNG';
import HardiPatel from '@/lib/Hardi_patel.jpg';
import KrishnaPatel from '@/lib/Krishna_Patel.jpg';
import BansariPatel from '@/lib/Bansari_Patel.jpg';
import AnkitNandoliya from '@/lib/Ankit_Nandoliya.jpg';
import Placeholder from '@/lib/placeholder.png';

type Developer = {
  name: string;
  imageKey: string;
  bio: string[];
  links: {
    portfolio: string | null;
    github: string | null;
    linkedin: string | null;
  };
};

const developerImages: { [key: string]: any } = {
  'Simit_Modi': SimitModi,
  'Hardi_Patel': HardiPatel,
  'Krishna_Patel': KrishnaPatel,
  'Bansari_Patel': BansariPatel,
  'Ankit_Nandoliya': AnkitNandoliya,
  'Sharvi': Placeholder
};

export default function MeetTheDevelopersPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [user, firestore]
  );
  const { data: userData, isLoading: isDocLoading } = useDoc(userDocRef);

  return (
    <div className="flex w-full min-h-screen flex-col" style={{ backgroundColor: '#BFBAB0' }}>
      {user && <Header />}
      <main className="flex-grow p-4 md:p-8">
        <h1 className="text-4xl font-bold text-center mb-12" style={{ color: '#092910' }}>
          Meet Our Developers
        </h1>

        <div className="max-w-4xl mx-auto space-y-8">
          {developers.map((dev: Developer, index: number) => (
            <div key={index} className="bg-[#D0CBC1] rounded-lg shadow-lg p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8">
              <div className="w-48 h-48 md:w-56 md:h-56 flex-shrink-0">
                <Image
                  src={developerImages[dev.imageKey]}
                  alt={dev.name}
                  width={224}
                  height={224}
                  className="rounded-lg object-cover w-full h-full"
                />
              </div>
              <div className="flex flex-col gap-4">
                <h2 className="text-3xl font-bold" style={{ color: '#092910' }}>
                  {dev.name}
                </h2>
                <ul className="list-disc list-inside space-y-1 text-foreground/80">
                  {dev.bio.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-4 mt-4">
                  {dev.links.portfolio && (
                    <Button asChild variant="outline" className="bg-white/50 hover:bg-white">
                      <Link href={dev.links.portfolio} target="_blank" rel="noopener noreferrer">
                        <UserCircle className="mr-2 h-5 w-5" /> Portfolio
                      </Link>
                    </Button>
                  )}
                  {dev.links.github && (
                    <Button asChild variant="outline" className="bg-white/50 hover:bg-white">
                      <Link href={dev.links.github} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-5 w-5" /> GitHub
                      </Link>
                    </Button>
                  )}
                  {dev.links.linkedin && (
                    <Button asChild variant="outline" className="bg-white/50 hover:bg-white">
                      <Link href={dev.links.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="mr-2 h-5 w-5" /> LinkedIn
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      {!user && <Footer />}
    </div>
  );
}

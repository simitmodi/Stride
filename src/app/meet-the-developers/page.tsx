
'use client';

import { useUser, useFirestore, useMemoFirebase } from '@/firebase/provider';
import { doc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, UserCircle, Home, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState, useEffect } from 'react';
import developers from '@/lib/dev_data.json';

type Developer = {
  name: string;
  bio: string[];
  links: {
    portfolio: string | null;
    github: string | null;
    linkedin: string | null;
  };
};

export default function MeetTheDevelopersPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [dashboardLink, setDashboardLink] = useState<string | null>(null);

  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [user, firestore]
  );
  const { data: userData, isLoading: isDocLoading } = useDoc(userDocRef);

  useEffect(() => {
    if (!isUserLoading && !isDocLoading) {
      if (user && userData) {
        switch (userData.role) {
          case 'customer':
            setDashboardLink('/dashboard/customer');
            break;
          case 'bank':
            setDashboardLink('/dashboard/bank');
            break;
          case 'developer':
            setDashboardLink('/dashboard/developer');
            break;
          default:
            setDashboardLink('/');
            break;
        }
      } else {
        setDashboardLink('/');
      }
    }
  }, [user, userData, isUserLoading, isDocLoading]);

  return (
    <div className="flex w-full min-h-screen flex-col" style={{ backgroundColor: '#BFBAB0' }}>
      <main className="flex-grow p-4 md:p-8 pt-24">
        <h1 className="text-4xl font-bold text-center mb-12" style={{ color: '#092910' }}>
          Meet Our Developers
        </h1>

        <div className="max-w-4xl mx-auto space-y-8">
          {(developers as Developer[]).map((dev: Developer, index: number) => (
            <div key={index} className="bg-[#D0CBC1] rounded-lg shadow-lg p-6 md:p-8 flex flex-col items-center gap-6 md:gap-8">
              <div className="flex flex-col gap-4 text-center md:text-left items-center md:items-start w-full">
                <h2 className="text-3xl font-bold" style={{ color: '#092910' }}>
                  {dev.name}
                </h2>
                <ul className="list-disc list-inside space-y-1 text-foreground/80 self-start">
                  {dev.bio.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
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
         <div className="mt-12 text-center">
            {dashboardLink ? (
              <Button asChild variant="outline" size="icon" className="h-12 w-12 bg-card/5">
                <Link href={dashboardLink}>
                  <Home className="h-6 w-6" />
                  <span className="sr-only">Back to Home</span>
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="icon" className="h-12 w-12 bg-card/5" disabled>
                <Loader2 className="h-6 w-6 animate-spin" />
              </Button>
            )}
          </div>
      </main>
    </div>
  );
}

'use client'
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

interface Project {
  fields: {
    description: string;
    github_url: string;
    walrus_site_url: string;
    id: string;
    name: string;
    video_blob_id: string;
    votes: number;
  };
  type: string;
}

export default function Home() {
  const client = new SuiClient({ url: getFullnodeUrl('mainnet') });
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    const targetDate = new Date('2024-09-30T00:00:00-07:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s until 2024.9.30 (UTC-7)`);

      if (distance < 0) {
        clearInterval(timer);
        setCountdown('Voting has ended');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getRankList = async (): Promise<Project[]> => {
    const res: any = await client.getObject({
      id: `0x1f243403d88c2ef83c055d4fba847e4960975f8bb6525db84e834d099e609822`,
      options: {
        showContent: true,
        showType: true
      }
    });
    const projectList: Project[] = res.data.content.fields.master_list;
    console.log('test', projectList, projectList.sort((a, b) => b.fields.votes - a.fields.votes).length);
    
    return projectList.sort((a, b) => b.fields.votes - a.fields.votes);
  }

  const { data: rankList, isLoading, isError } = useQuery({
    queryKey: ['rankList'],
    queryFn: getRankList
  });

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-start justify-items-center min-h-screen py-12 px-8 gap-16 sm:px-20 font-[family-name:var(--font-geist-sans)] overflow-y-auto">
      {isLoading && <p className="text-lg text-gray-600">Loading...</p>}
      {isError && <p className="text-lg text-red-600">Error loading, please try again later</p>}
      {rankList && (
        <>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg shadow-md text-center w-full/2 max-w-2xl">
            <span>Starting vote at </span>
            <a href="https://approve.breakingtheice.xyz/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-200 transition-colors duration-300">
              here
            </a>
            <span>. </span>
            <span className="inline-block w-full">{countdown}</span>
          </div>
          <ul className="w-full max-w-2xl space-y-4 mb-12">
            {rankList.map((project, index) => (
              <li key={project.fields.id} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300 flex justify-between items-center">
                <div className="flex items-center flex-grow">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">{project.fields.id}: {project.fields.name}</h2>
                    <p className="text-gray-600 mb-2">Votes: <span className="font-semibold">{project.fields.votes}</span></p>
                    <div className="flex space-x-4">
                      <a href={project.fields.github_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors duration-300">GitHub</a>
                      <a href={project.fields.walrus_site_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors duration-300">Walrus Site</a>
                    </div>
                  </div>
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold ml-4">
                  {index + 1}
                </div>
              </li>
            ))}
          </ul>
        </>
        
      )}
    </div>
  );
}
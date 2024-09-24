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
    team?: string; // 新增team字段
  };
  type: string;
}

interface VoteData {
  id: {
    id: string
  },
  team: string;
  team_name: string;
  ballot: string[];
}

export default function Home() {
  const client = new SuiClient({ url: getFullnodeUrl('mainnet') });
  const [countdown, setCountdown] = useState('');
  const [voteDataList, setVoteDataList] = useState<VoteData[]>([]);

  const collectionIds = [
    "0x003507e2cf7315eb069f7d8e55be6c660ecde4d61f4eb8e352b4ccb08d2f568e",
    "0x1189f772b49facfd6368ad64261f70a44609843798009bb6c2de9ffce60f2ffc",
    "0x1326420700a5f2d023cfb179713e1adf0a735df02d11180b700ad71af30f9e9e",
    "0x169358732a12c2d22e3973ffd59ae1d1952410927ac2a39783d87e77eb23f16c",
    "0x1d4bb0c0c7303a36f133427523b78376ee677682034a5acb1511e1a4f1995aa4",
    "0x222246fc8587dbc8997fa48de051612921024766d8d6985d8f857978e24dfa67",
    "0x28f5cc6b90c2c99fd54627a7e3ed38fffeae1a8985755d78acee0c734c67618b",
    "0x2bd682adfa109603fa46dbcf47673dcf66a82b1776306da09ab0ad70ebd23a56",
    "0x2f4da4ea431b2fc4ba46a17106c4af2fc3eb4c786a32ec4f5278e87ca243bef1",
    "0x37dce71376d0e485d7fa48ce0024eb43a07fbfe68fd2ddde8073bdf5a4753366",
    "0x3d4c54c2850ad471bcc2074435b57fa5e9704996ed958df145dd6ae926e46837",
    "0x595ea327578a86010d2571ac60f3f19acb463355dbfb3588973d05ca0934cc1f",
    "0x5bc11f4203fa78322171a8151e065357756b9dc567bb3926bf29e5764ab9ab9e",
    "0x6666c3b947cbf09639100f399fe9e4897f56ae0c986932d73810cdaf714a8da3",
    "0x6a89b00d699b8c2d6615dccee460f61fb5d427ea1b56db5b72d7a892b2663f45",
    "0x72e416c0dadad9f0ba44f3cc5187e379377c9d673cdbc7f70fc36c3a02b02c0b",
    "0x81d5b5bcd7a6e6886e89ab9678bf95a753e133c9a9b7f2470b8fa9404ac30d45",
    "0x8456423b9227a55f83993a4a233b19843428ca057aac64b803e971d8f75a4e44",
    "0x864d459581906dc37a668b98e42b3a0c9c76f58dbb07ffb0b98b6980aad85969",
    "0x86e408f6be68371b7a98dc0d9647a54248f3d53ed1d3dee01c6bffe3e26b175e",
    "0x8e7ea9eacd6f5b5b56fe0bd08a958a01d5840799d1add57b19fe0d7b202b9a80",
    "0x985484f1b39a5e194971a8306eeb72ed92ec5331db25221e5d275f22d625e027",
    "0x9ebaf5b7f119e0f50ee6a794dbfd3698fe375bfd064ea84f63bb0f7d7f0337ec",
    "0xaa22eca27959e44c7902a5c2bea65d8bf770449752c7ab0d2e424e8f8412ea64",
    "0xac0ba3343a69e4befd992926e7a6e21750e8ec5a4aaaa5b1b26faeac8a72c26d",
    "0xb13f1fbec59ad079228a6b9b20d2a763debf292c690760c4f22bcab0a343c05a",
    "0xb216e7b76a4d28e6dfb559f931cd6bc13cc968e2655945aecec033971b8c7191",
    "0xb3bd35b88dc37d1948a448506bb2c0e74eeaf69beba0d91efb26717f6e8fa27c",
    "0xb977b40119e25a876d40d572921df0c345d983c48904fc0b9cadae9c398db450",
    "0xb9d057f5faccc0efd8f9c5f3a9390714b14e710012c8ecdf2fa189a60df9626d",
    "0xbb7998554f65e89216390fe2f2654be547a2374b272ac7847f8ff29555939c4a",
    "0xc348949964e9ade454c3433985e1d4f99db9033e93a048dd7d615ee6654897f9",
    "0xc61eb420803017e004004b2ead7a70e8f3be9c48f6efbf7d988e8edb1c55f79a",
    "0xc6e13ae14b0b0dc1b875c18ecd78b56fb4808522ec45e3a0672cf62d26a1fab5",
    "0xc71120cda5b9cdf3e1bf9ec7a8de8e6c41714b1d4a3710520c0b4c3c0a3b3d69",
    "0xd41c92ddb89045fb38225ea19e9c5f35d7a7b1ebc40bb2a48bf1766355d8c9bd",
    "0xe5d46e25b01f06739ec33bc7050751984a6fcfd1faf4bb837f14b08b2155bb10",
    "0xfddd2372d59cdd80b9f85ca881be820dd2cf731fd8bbd695df3b6d5e59abcda7",
    "0x999c22f9207fcfd29dcd516f50dea544cb8bfcc5a85508aac78db1ab7a89a79f",
    "0x9fdc615430b0370d1d9b36ef729d9448b9d16dcea626020e5ed16113e1c9157a"
  ]

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

  const getVoteList = async (id: string): Promise<VoteData> => {
    const res: any = await client.getObject({
      id,
      options: {
        showContent: true,
        showType: true
      }
    });
    console.log('test23', res.data.content.fields);
    return res.data.content.fields;
  }
  

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

  useEffect(() => {
    if (!isLoading && rankList) {
      collectionIds.forEach(async (id) => {
        const existingVoteData = voteDataList.find(voteData => voteData?.id.id === id);
        if (!existingVoteData) {
          const voteData = await getVoteList(id);
          setVoteDataList((prev) => [...prev, voteData]);
        }
      });
    }
  }, [isLoading, rankList]);

  // 更新rankList中的team字段
  useEffect(() => {
    if (rankList) {
      rankList.forEach(project => {        
        const voteData = voteDataList.find(voteData => {
          return voteData.team_name === project.fields.name
        });
        if (voteData) {
          project.fields.team = voteData.team;
        } else {
          project.fields.team = 'N/A';
        }
      });
    }
  }, [voteDataList, rankList]);

  const groupA = rankList?.filter(project => project.fields.team === '0').sort((a, b) => b.fields.votes - a.fields.votes) || [];
  const groupB = rankList?.filter(project => project.fields.team === '1').sort((a, b) => b.fields.votes - a.fields.votes) || [];

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
          <div className="w-full max-w-4xl mb-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Part A</h2>
              <ul className="space-y-4">
                {groupA.map((project, index) => (
                  <li key={project.fields.id} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300 flex justify-between items-center">
                    <div className="flex items-center flex-grow">
                      <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">
                          {/* <span className="text-gray-600">{project.fields.team} </span> */}
                          {project.fields.id}: {project.fields.name}
                        </h2>
                        <p className="text-gray-600 mb-2">Votes: <span className="font-semibold">{project.fields.votes}</span></p>
                        <div className="flex space-x-4">
                          <a href={project.fields.github_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors duration-300">GitHub</a>
                          <a href={project.fields.walrus_site_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors duration-300">Walrus Site</a>
                        </div>
                        {project.fields.votes > 0 && (
                          <div className="mt-2">
                            <p className="text-gray-600 mb-2">Votes Detail:</p>
                            {voteDataList.filter(voteData => voteData.ballot.includes(project.fields.id)).map((voteData, idx) => (
                              <p key={idx} className="text-gray-600">{voteData.team_name}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold ml-4">
                      {index + 1}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-4">Part B</h2>
              <ul className="space-y-4">
                {groupB.map((project, index) => (
                  <li key={project.fields.id} className={`bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300 flex justify-between items-center ${index === 0 ? 'mt-0' : ''}`}>
                    <div className="flex items-center flex-grow">
                      <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">
                          {/* <span className="text-gray-600">{project.fields.team} </span> */}
                          {project.fields.id}: {project.fields.name}
                        </h2>
                        <p className="text-gray-600 mb-2">Votes: <span className="font-semibold">{project.fields.votes}</span></p>
                        <div className="flex space-x-4">
                          <a href={project.fields.github_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors duration-300">GitHub</a>
                          <a href={project.fields.walrus_site_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors duration-300">Walrus Site</a>
                        </div>
                        {project.fields.votes > 0 && (
                          <div className="mt-2">
                            <p className="text-gray-600 mb-2">Votes Detail:</p>
                            {voteDataList.filter(voteData => voteData.ballot.includes(project.fields.id)).map((voteData, idx) => (
                              <p key={idx} className="text-gray-600">{voteData.team_name}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold ml-4">
                      {index + 1}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
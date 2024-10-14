import React from 'react';
import { Link } from "react-router-dom";

const Feed = () => {
  return (
    <>
      <div className="space-y-5 flex flex-col md:overflow-hidden">
        <div className="flex flex-col md:flex-row gap-5 justify-center mx-auto">
          <Link to='/speed'>
            <div className="card bg-customOrange flex flex-col justify-center items-center w-52 h-52 md:h-60 md:w-96 rounded-md hover:shadow-lg hover:shadow-[#f0a45d] transition-all ">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 mb-2 text-[#f0a45d] transition-all">
                <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" fill="none" />
              </svg>
              <div className='w-36 md:w-full'>

                <h2 className="text-[#f0a45d] text-xs md:text-xl text-center font-semibold">Speed Test</h2>
                <h3 className="text-[#f0a45d] text-xs md:text-sm text-center">Test your visual reflexes.</h3>
              </div>
            </div>
          </Link>
          <Link to='/seq'>
            <div className="card bg-customOrange flex flex-col justify-center items-center w-52 h-52 md:h-60 md:w-96 rounded-md hover:shadow-lg hover:shadow-[#f0a45d] transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 mb-2 text-[#f0a45d]   transition-all">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" fill="none" />
              </svg>
              <div className='w-36 md:w-full'>
                <h2 className="text-[#f0a45d] text-xs md:text-xl font-semibold text-center">Sequence Memory</h2>
                <h3 className="text-[#f0a45d] text-xs md:text-sm text-center">Remember a long pattern of presses.</h3>
              </div>
            </div>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-5 justify-center mx-auto">
          <Link to='/number'>
            <div className="card bg-customOrange flex flex-col justify-center items-center w-52 h-52 md:h-60 md:w-96 rounded-md hover:shadow-lg hover:shadow-[#f0a45d] transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 mb-2 text-[#f0a45d]  transition-all">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z" fill="none" />
              </svg>
              <div className='w-36 md:w-full'>

                <h2 className="text-[#f0a45d] text-xs md:text-xl text-center font-semibold">Number Memory</h2>
                <h3 className="text-[#f0a45d] text-xs md:text-sm text-center">Remember the longest number.</h3>
              </div>
            </div>
          </Link>
          <Link to='/verbal'>
            <div className="card bg-customOrange flex flex-col justify-center items-center w-52 h-52 md:h-60 md:w-96 rounded-md hover:shadow-lg hover:shadow-[#f0a45d] transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"  className="w-8 h-8 mb-2 text-[#f0a45d]  transition-all">
                <path strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
              <div className='w-36 md:w-full'>

              <h2 className="text-[#f0a45d] text-xs md:text-xl text-center font-semibold">Verbal Memory</h2>
              <h3 className="text-[#f0a45d] text-xs md:text-sm text-center">Keep as many words in short term memory as possible.</h3>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Feed;

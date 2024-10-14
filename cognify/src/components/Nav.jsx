import Bulb from '../assets/bulb.png';
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const Nav = () => {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
  return (
    <nav className='bg-opacity-10 my-6 gap-4 bg-customOrange border mx-auto border-opacity-10 rounded-lg p-4 flex flex-col md:flex-row items-center justify-between w-[90vw]'>
        <Link to='/'>
          <div className='flex items-center space-x-2'>
            <img src={Bulb} alt="Bulb" className='w-14' />
            <p className='text-[#F5B1CC] text-2xl'>Cognify<span className='text-[#F5B1CC]'>IQ</span></p>
          </div>
        </Link>
        <div className='flex flex-col md:flex-row gap-4 items-center text-white'>  
          <Link to='/leaderboard'>
            <h2 className='cursor-pointer text-[#F5B1CC] text-xl'>Leaderboard</h2>
          </Link>
          <Link to='/pastScores'>
            <h2 className='cursor-pointer text-[#F5B1CC] text-xl'>PastScores</h2>
          </Link>

          {isAuthenticated ? (
            <div className='flex flex-col md:flex-row items-center gap-4'>
              <img 
                src={user.picture} 
                alt="User" 
                className='w-10 rounded-full' 
              />
              <h2 className='text-[#f5b1cc]'>{user && user.nickname}</h2>
              <button 
                onClick={() => logout({ returnTo: window.location.origin })}
                className='cursor-pointer text-white text-sm bg-[#F5B1CC] hover:bg-white hover:text-[#f0a45d] transition duration-300'
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button 
              onClick={() => loginWithRedirect()} 
              className='cursor-pointer text-white bg-[#F5B1CC] text-sm hover:bg-white hover:text-[#f0a45d] transition duration-300'
            >
              Sign In
            </button>
          )}
        </div>
    </nav>
  );
}

export default Nav;

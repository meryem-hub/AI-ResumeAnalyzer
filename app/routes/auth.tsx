import React from 'react'
import type { MetaFunction } from 'react-router-dom'
import { useEffect } from 'react'
import { useLocation,useNavigate } from 'react-router'
import { usePuterStore } from '~/lib/puter'
export const meta:MetaFunction=()=>[
    {title: "Resumaind | auth"},
    {name: "description", content: "Log in to yout account"}
]
const auth = () => {
  const {isLoading, auth} = usePuterStore();
const Location = useLocation();
const next =location.search.split("next=")[1] || "/";
const navigate = useNavigate();
useEffect(()=>{
    if(auth.isAuthenticated) navigate(next);

},[auth.isAuthenticated, navigate, next])

  return (
<main className='bg-[url("../assets/auth-bg.jpg")] bg-cover min-h-screen flex items-center justify-center'>
<div className="gradient-border shadow-lg">
<section className='flex flex-col gap-8 bg-white rounded-2xl p-10'>
<div>
    <h1>We;come </h1>
    <h1>Log In to Continue Your Job Journey</h1>
</div>
<div>
    {isLoading ?(
        <button className='auth-button animate-pulse'>
<p>Signing you in</p>
        </button>
    ):(
        <>
        {auth.isAuthenticated ? (
            <button className='auth-button ' onClick={() => auth.signOut()}>
<p>Log Out</p>
            </button>
        ):(
            <button className="auth-button" onClick={() => auth.signIn()}>
<p>Log In</p>
            </button>
        )}</>
    )}

</div>
</section>
</div>
</main>
  )
}

export default auth

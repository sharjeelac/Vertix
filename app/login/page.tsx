'use client'

import { error } from "console"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

const LoginPage = () => {
    const [email , setEmail] = useState("")
    const [password , setPassword] = useState("")
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect : false
            })

            if(res?.error){
                console.log(error)
            } else {
                router.push('/')
            }
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
            <input 
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
            />
            <input 
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                Login
            </button>
        </form>
    <p>Dont have an account? <a href="/signup">Sign up</a></p>
    </div>
  )
}

export default LoginPage
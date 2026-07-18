import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
    onLogin: () => void
}

function SignUp({ onLogin }: Props) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleSignUp = () => {
        if (email && password) {
            onLogin()
        }
    }

    return (
        <div className="min-h-screen bg-finnio-sidebar flex flex-col items-center justify-center">

            <h1 className="text-4xl font-bold mb-2 text-white">FINNIO ★</h1>
            <p className="text-sm opacity-70 mb-8 text-white">Your AI Financial Advisor</p>

            <div className="bg-finnio-sidebar-dark rounded-2xl p-8 w-[380px] flex flex-col gap-4">
                <h2 className="text-xl font-semibold text-white">Sign Up</h2>

                <div>
                    <label className="text-xs opacity-70 mb-1 text-white block">Email</label>
                    <input
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="your@gmail.com"
                        type="email"
                        className="w-full bg-white/20 rounded-lg px-3 py-2 text-sm outline-none placeholder:text-gray-300"></input> 
                </div>

                <div>
                    <label className="text-xs opacity-70 mb-1 block text-white">Password</label>
                    <input 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        type="password"
                        className="w-full bg-white/20 rounded-lg px-3 py-2 text-sm outline-none placeholder:text-gray-300"></input>
                </div>

                <button
                    onClick={handleSignUp}
                    className="w-full py-2 text-white bg-finnio-card-2 rounded-lg text-sm font-semibold hover:bg-gray-500 transition-all">
                        Sign In
                </button>

                <button className="w-full py-2 text-white bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                    <span>G</span> Continue with Google
                </button>

                <p className="text-xs text-white text-center opacity-70">
                    Returning?{' '}
                    <button
                        onClick={() => navigate('/signin')}
                        className="underline hove:opacity-100">
                            Sign In
                    </button>
                </p>
            </div>

            <p className="text-xs opacity-40 text-white mt-6 text-center max-w-sm">
                AI suggestions are for educational purposes only.
                Always consult a licensed financial advisor.
            </p>
        </div>
    )
}

export default SignUp
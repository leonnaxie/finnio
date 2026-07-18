import { useState } from 'react'
import type { FinancialProfile } from '../App'

interface UserProfile {
    name: string
    email: string
    currency: string
    dateFormat: string
}

interface Props {
    financialProfile: FinancialProfile
    setFinancialProfile: React.Dispatch<React.SetStateAction<FinancialProfile>>
}

function Profile({ financialProfile, setFinancialProfile }: Props) {
    const [userProfile, setUserProfile] = useState<UserProfile>({
        name: 'Your Name',
        email: 'your@gmail.com',
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY'
    })

    const [isEditingProfile, setIsEditingProfile] = useState(false)
    const [saved, setSaved] = useState(false)

    const handleSaveFinancial = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    return (
        <div className="flex h-screen p-6 gap-4 overflow-hidden">
            <div className="flex-1 flex gap-4">

                {/* User Info */}
                <div className="flex-1 bg-finnio-card-1 rounded-xl p-6 flex flex-col gap-4">
                    
                    {/* Avatar */}
                    <div className="flex flex-col items-center gap-2 mb-2">
                        <div className="w-20 h-20 rounded-full bg-finnio-card-2 flex items-center justify-center text-3xl">
                            👤
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="text-xs opacity-70 mb-1 block">Name</label>
                        {isEditingProfile ? (
                            <input
                                value={userProfile.name}
                                onChange={e => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full bg-white/20 rounded-lg px-3 py-2 text-sm outline-none"
                            />
                        ) : (
                            <p className="text-sm px-3 py-2 bg-white/10 rounded-lg">{userProfile.name}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="text-xs opacity-70 mb-1 block">Email</label>
                        {isEditingProfile ? (
                            <input
                                value={userProfile.email}
                                onChange={e => setUserProfile(prev => ({ ...prev, email: e.target.value }))}
                                className="w-full bg-white/20 rounded-lg px-3 py-2 text-sm outline-none"
                            />
                        ) : (
                            <p className="text-sm px-3 py-2 bg-white/10 rounded-lg">{userProfile.email}</p>
                        )}
                    </div>

                    {/* Preferences */}
                    <div>
                        <h3 className="text-sm font-semibold mb-2 opacity-70">Preferences</h3>

                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs opacity-70">Currency</label>
                                <select
                                    value={userProfile.currency}
                                    onChange={e => setUserProfile(prev => ({ ...prev, currency: e.target.value }))}
                                    className="bg-finnio-card-2 rounded-lg px-3 py-1 text-sm outline-none"
                                >
                                    <option>USD</option>
                                    <option>EUR</option>
                                    <option>GBP</option>
                                    <option>CAD</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="text-xs opacity-70">Date Format</label>
                                <select
                                    value={userProfile.dateFormat}
                                    onChange={e => setUserProfile(prev => ({ ...prev, dateFormat: e.target.value }))}
                                    className="bg-finnio-card-2 rounded-lg px-3 py-1 text-sm outline-none"
                                >
                                    <option>MM/DD/YYYY</option>
                                    <option>DD/MM/YYYY</option>
                                    <option>YYYY/MM/DD</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Edit / Save button */}
                    <button
                        onClick={() => setIsEditingProfile(prev => !prev)}
                        className="mt-auto px-4 py-2 text-sm bg-finnio-card-2 rounded-lg hover:bg-gray-500 transition-all"
                    >
                        {isEditingProfile ? 'Done' : 'Edit Profile'}
                    </button>
                </div>

                {/* Right — Financial Profile */}
                <div className="flex-1 bg-finnio-card-1 rounded-xl p-6 flex flex-col gap-4">
                    <h3 className="font-semibold">Financial Profile</h3>
                    <p className="text-xs opacity-50">
                        This information helps Finnio give you personalized advice.
                    </p>

                    {/* Monthly Income */}
                    <div>
                        <label className="text-xs opacity-70 mb-1 block">Monthly Income</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-70">$</span>
                            <input
                                value={financialProfile.monthlyIncome}
                                onChange={e => setFinancialProfile(prev => ({ ...prev, monthlyIncome: e.target.value }))}
                                placeholder="e.g. 3000"
                                type="number"
                                min="0"
                                className="w-full bg-white/20 rounded-lg pl-7 pr-3 py-2 text-sm outline-none placeholder:text-gray-300"
                            />
                        </div>
                    </div>

                    {/* Risk Tolerance */}
                    <div>
                        <label className="text-xs opacity-70 mb-1 block">Risk Tolerance</label>
                        <div className="flex gap-2">
                            {(['Conservative', 'Moderate', 'Aggressive'] as const).map(level => (
                                <button
                                    key={level}
                                    onClick={() => setFinancialProfile(prev => ({ ...prev, riskTolerance: level }))}
                                    className={`flex-1 py-2 rounded-lg text-xs transition-all ${
                                        financialProfile.riskTolerance === level
                                            ? 'bg-finnio-card-2 text-white'
                                            : 'bg-white/10 text-finnio-sidebar hover:bg-white/20'
                                    }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs opacity-50 mt-1">
                            {financialProfile.riskTolerance === 'Conservative' && 'Prefers stability, lower risk investments'}
                            {financialProfile.riskTolerance === 'Moderate' && 'Balanced approach between growth and safety'}
                            {financialProfile.riskTolerance === 'Aggressive' && 'Prioritizes growth, comfortable with higher risk'}
                        </p>
                    </div>

                    {/* Savings Target */}
                    <div>
                        <label className="text-xs opacity-70 mb-1 block">Monthly Savings Target</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-70">$</span>
                            <input
                                value={financialProfile.savingsTarget}
                                onChange={e => setFinancialProfile(prev => ({ ...prev, savingsTarget: e.target.value }))}
                                placeholder="e.g. 500"
                                type="number"
                                min="0"
                                className="w-full bg-white/20 rounded-lg pl-7 pr-3 py-2 text-sm outline-none placeholder:text-gray-300"
                            />
                        </div>
                    </div>

                    {/* Save button */}
                    <button
                        onClick={handleSaveFinancial}
                        className="mt-auto px-4 py-2 text-sm bg-finnio-card-2 rounded-lg hover:bg-gray-500 transition-all"
                    >
                        {saved ? '✓ Saved!' : 'Save Financial Profile'}
                    </button>
                </div>

            </div>
        </div>
    )
}

export default Profile
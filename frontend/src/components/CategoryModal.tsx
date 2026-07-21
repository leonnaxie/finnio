import { useState, useEffect } from "react";
import type { Category } from "../App";

interface CategoryInput {
    id?: string
    name: string
    color: string
    budget: number
}

interface Props {
    onClose: () => void
    onSave: (category: CategoryInput) => void
    existingCategory?: Category | null
}

const presetColors = [
    '#4ade80',
    '#60a5fa',
    '#c084fc',
    '#facc15',
    '#f87171',
    '#fb923c',
    '#7071bf',
    '#e879f9'
]

function CategoryModal({ onClose, onSave, existingCategory}: Props) {
    const [name, setName] = useState('')
    const [color, setColor] = useState(presetColors[0])
    const [budget, setBudget] = useState('')

    useEffect(() => {
        if (existingCategory) {
            setName(existingCategory.name)
            setBudget(existingCategory.budget.toString())
            setColor(existingCategory.color)
        }
    }, [existingCategory])

    const handleSave = () => {
        if (!name.trim() || !budget) return

        onSave({
            id: existingCategory?.id,
            name: name.trim(),
            color,
            budget: parseFloat(budget)
        })
    }

    const isEditing = !!existingCategory

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-finnio-sidebar rounded-2xl p-6 w-[400px] flex flex-col gap-4">
                <h2 className="text-lg font-semibold">
                    {isEditing ? 'Edit Category' : 'Add Category'}
                </h2>

                {/* Name */}
                <div>
                    <label className="text-xs opacity-70 mb-1 block">Category Name</label>
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Groceries"
                        className="w-full bg-white/20 rounded-lg px-3 py-2 text-sm outline-none placeholder:text-gray-300"></input>
                </div>

                {/* Budget */}
                <div>
                    <label className="text-xs opacity-70 mb-1 block">Budget</label>
                    <input
                        value={budget}
                        onChange={e => setBudget(e.target.value)}
                        placeholder="e.g. 400.00"
                        type="number"
                        min="0"
                        className="w-full bg-white/20 rounded-lg px-3 py-2 text-sm outline-none placeholder:text-gray-300"></input>
                </div>

                {/* Color Picker */}
                <div>
                    <label className="text-xs opacity-70 mb-1 block">Color</label>
                    <div className="flex gap-2 flex-wrap">
                        {presetColors.map(c => (
                            <button
                                key={c}
                                onClick={() => setColor(c)}
                                className={`w-8 h-8 rounded-full transition-all ${
                                    color === c ? 'ring-2 ring-white ring-offset-2 ring-offset transparent scale-110' : ''
                                }`}
                                style={{ backgroundColor: c }}
                            ></button>
                        ))}
                    </div>
                </div>

                {/* Preview */}
                <div className="bg-white/10 rounded-xl p-3 flex items-center gap-2">
                    <span style={{ color }}>★</span>
                    <span className="text-sm">{name || 'Category Name'}</span>
                    <span className="ml-auto text-xs opacity-70">
                        ${budget || '0'}/mo Budget
                    </span>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-300 hover:text-white">Cancel</button>
                    <button
                        onClick={handleSave}
                        disabled={!name.trim() || !budget}
                        className="px-4 py-2 text-sm bg-finnio-card-2 rounded-lg hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isEditing ? 'Save Changes' : 'Add Category'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CategoryModal
function ChatPanel() {
    return (
        <aside className="w-72 min-w-[288px] bg-finnio-ai-chat flex flex-col p-4 h-full">
            <h2 className="text-lg font-semibold mb-4">chat with finnio</h2>

            <div className="flex-1 overflow-y-auto">
                {/* Messages go here */}
            </div>

            <div className="flex gap-2 mt-4">
                <input
                    type="text"
                    placeholder="Ask Finnio..."
                    className="flex-1 bg-gray-200 rounded-lg px-3 py-2 text-finnio-sidebar outline-none text-gray-800"
                />
                <button className="bg-blue-500 rounded-lg px-3 py-2 text-sm">
                    →
                </button>
            </div>
        </aside>
    )
}

export default ChatPanel
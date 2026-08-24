"use client";

import { useState } from "react";

interface ChatMessage {
  role: "user" | "agent";
  text: string;
}

export function AgentChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  async function sendMessage(text: string) {
    if (!text.trim() || sending) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/ask-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = (await res.json()) as { reply: string };
      setMessages((prev) => [...prev, { role: "agent", text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "agent", text: "Something went wrong reaching the agent endpoint." },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="flex min-h-[4rem] flex-col gap-2">
        {messages.length === 0 && (
          <p className="text-sm text-zinc-400 dark:text-zinc-500">No messages yet — try asking something.</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <span
              className={`inline-block rounded-lg px-3 py-1.5 text-sm ${
                m.role === "user"
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black"
                  : "bg-zinc-100 dark:bg-zinc-800"
              }`}
            >
              {m.text}
            </span>
          </div>
        ))}
      </div>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void sendMessage(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your shift, routes, or crew..."
          className="flex-1 rounded border border-zinc-300 bg-transparent px-3 py-1.5 text-sm dark:border-zinc-700"
        />
        <button
          type="submit"
          disabled={sending}
          className="rounded bg-zinc-900 px-3 py-1.5 text-sm text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-black"
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}

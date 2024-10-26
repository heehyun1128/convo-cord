"use client";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "@/convex/_generated/api";

export default function Home() {
  const messages = useQuery(api.functions.messages.list);
  const createMessage = useMutation(api.functions.messages.create);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createMessage({ sender: "Alice", content: input });
    setInput("");
  };

  const [input, setInput] = useState("");
  return (
    <div>
      {messages?.map((message, index:number) => (
        <div key={index}>
          <strong> {message.sender}</strong>: {message.content}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="message"
          id="message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
    </div>
  );
}

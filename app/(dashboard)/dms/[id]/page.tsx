"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { FunctionReturnType } from "convex/server";
import { MoreVerticalIcon, SendIcon, TrashIcon } from "lucide-react";
import { use, useState } from "react";
import { toast } from "sonner";

export default function MessagePage({
  params,
}: {
  params: Promise<{ id: Id<"directMessages"> }>;
}) {
  const { id } = use(params);
  const directMessage = useQuery(api.functions.dm.get, { id });
  const messages = useQuery(api.functions.message.list, {
    directMessage: id,
  });

  if (!directMessage) {
    return null;
  }
  return (
    <div className="flex flex-1 flex-col divide-y max-h-screen">
      <header className="flex items-center gap-2 p-4">
        <Avatar className="size-8 border">
          <AvatarImage src={directMessage.user.image} />
          <AvatarFallback />
        </Avatar>
        <h1 className="font-semibold">{directMessage.user.username}</h1>
      </header>
      <ScrollArea className="h-full">
        {messages?.map((message) => (
          <MessageItem key={message._id} msg={message} />
        ))}
      </ScrollArea>
      <TypingIndicator directMessage={id}/>
      <MessageInput directMessage={id} />
    </div>
  );
}

function TypingIndicator({
  directMessage,
}: {
  directMessage: Id<"directMessages">;
}) {
  const usernames = useQuery(api.functions.typing.list, { directMessage });
  if (!usernames || usernames.length === 0) {
    return null;
  }

  return (
    <div className="text-sm text-muted-foreground px-4 py-2">
      {usernames.join(", ")} is typing...
    </div>
  );
}

type Msg = FunctionReturnType<typeof api.functions.message.list>[number];

function MessageItem({ msg }: { msg: Msg }) {
  return (
    <div className="flex items-center px-4 gap-2">
      <Avatar className="size-8 border">
        {msg.sender && <AvatarImage src={msg.sender?.image} />}
        <AvatarFallback />
      </Avatar>
      <div className="flex flex-col mr-auto">
        <p className="text-xs text-muted-foreground">
          {msg.sender?.username ?? "Deleted User"}
        </p>
        <p className="text-sm ">{msg.content}</p>
      </div>
      <MessageActions msg={msg} />
    </div>
  );
}

function MessageActions({ msg }: { msg: Msg }) {
  const user = useQuery(api.functions.user.get);
  const removeMutation = useMutation(api.functions.message.remove);
  if (!user || msg.sender?._id !== user._id) {
    return null;
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreVerticalIcon className="size-4 text-muted-foreground" />
        <span className="sr-only">Message Actions</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => removeMutation({ id: msg._id })}
        >
          <TrashIcon />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MessageInput({
  directMessage,
}: {
  directMessage: Id<"directMessages">;
}) {
  const [content, setContent] = useState("");
  const sendMessage = useMutation(api.functions.message.create);

  const sendTypingIndicator = useMutation(api.functions.typing.upsert);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await sendMessage({ directMessage, content });
      setContent("");
    } catch (err) {
      toast.error("Failed to send message", {
        description:
          err instanceof Error ? err.message : "An unknown error occurred.",
      });
    }
  };
  
  return (
    <form className="flex items-center p-4 gap-2 py-2" onSubmit={handleSubmit}>
      <Input
        placeholder="Message"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={() => {
          if (content.length > 0) {
            sendTypingIndicator({ directMessage });
          }
        }}
      />
      <Button>
        <SendIcon />
        <span className="sr-only">Send</span>
      </Button>
    </form>
  );
}



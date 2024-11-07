import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CheckIcon, MessageCircleIcon, XIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";



export function PendingFriendsList() {
  const friends = useQuery(api.functions.friend.listPending)
  const updateStatus=useMutation(api.functions.friend.updateStatus)
  return (
    <div className="flex flex-col divide-y">
      <h2 className="text-sm text-muted-foreground p-2.5">Pending Friends</h2>
      {friends?.length === 0 && (
        <FriendsListEmpty>
          <p>No Pending Friend Request</p>
        </FriendsListEmpty>
      )}
      {friends?.map((friend, index) => (
        <FriendItem key={index} username={friend.user.username} image={friend.user.image}>
          <IconButton
            title="Accept"
            className="bg-green-600"
            icon={<CheckIcon />}
            onClick={()=>updateStatus({id:friend._id,status:"accepted"})}
          />
          <IconButton  onClick={()=>updateStatus({id:friend._id,status:"rejected"})}
          title="Reject" className="bg-red-600" icon={<XIcon />} />
        </FriendItem>
      ))}
    </div>
  );
}
export function AcceptedFriendsList() {
  const friends = useQuery(api.functions.friend.listAccepted)
  const updateStatus=useMutation(api.functions.friend.updateStatus)
  return (
    <div className="flex flex-col divide-y">
      <h2 className="text-sm text-muted-foregr ound p-2.5">Accepted Friends</h2>
      {friends?.length === 0 && (
        <FriendsListEmpty>
          <p>No Friends Yet </p>
        </FriendsListEmpty>
      )}
      {friends?.map((friend, index) => (
        <FriendItem key={index} username={friend.user.username} image={friend.user.image}>
          <IconButton
          onClick={()=>{}}
            title="Start DM"
            className="bg-cyan-600"
            icon={<MessageCircleIcon />}
          />
          <IconButton
            title="Remove Friend"
            className="bg-red-600"
            icon={<XIcon />}
            onClick={()=>updateStatus({id:friend._id,status:"rejected"})}
          />
        </FriendItem>
      ))}
    </div>
  );
}

const FriendItem = ({
  username,
  image,
  children,
}: {
  username: string;
  image: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className="flex items-center p-2.5 gap-2.5 justify-between">
      <div className="flex items-center gap-2 5">
        <Avatar className="size-9 border">
          <AvatarImage src={image} />
          <AvatarFallback />
        </Avatar>
        <p className="text-sm font-medium">{username}</p>
      </div>
      <div className="flex items-center gap-1">{children}</div>
    </div>
  );
};

const IconButton = ({
  title,
  className,
  icon,
  onClick,
}: {
  title: string;
  className: string;
  icon: React.ReactNode;
  onClick:()=>void;
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button onClick={onClick} className={cn(className)} size="icon">
        {icon}
        <span className="sr-only"></span>
      </Button>
    </TooltipTrigger>
    <TooltipContent>{title}</TooltipContent>
  </Tooltip>
);

const FriendsListEmpty = ({ children }: { children: React.ReactNode }) => (
  <div className="p-4 bg-muted/50 text-center text-sm text-muted-foreground">
    {children}
  </div>
);

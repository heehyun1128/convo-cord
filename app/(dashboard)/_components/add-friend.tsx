import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";

export function AddFriend() {
  const [open, setOpen] = useState<boolean>(false);
  const createFriendRequest = useMutation(
    api.functions.friend.createFriendRequest
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e.currentTarget.username.value)
    try {
      await createFriendRequest({username:e.currentTarget.username.value});
      toast.success("Successfully sent friend request!");
      setOpen(false)
    } catch (err) {
      toast.error("Failed to send friend request!", {
        description:
          err instanceof Error ? err.message : "Unknow error occurred.",
      });
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Add Friend</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Friend</DialogTitle>
          <DialogDescription>
            You can add a friend by their username
          </DialogDescription>
        </DialogHeader>
        <form className="contents" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="username">Username </label>
            <input type="text" name="" id="username" />
          </div>
          <DialogFooter>
            <Button>Send Friend Request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

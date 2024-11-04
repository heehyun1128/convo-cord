import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SidebarGroupAction } from "@/components/ui/sidebar";
import { Dialog } from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function  NewDirectMessage(){
    const [open, setOpen] = useState<boolean>(false);
  const createDM = useMutation(
    api.functions.dm.create
  );
  const router=useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e.currentTarget.username.value)
    try {
      const id=await createDM({username:e.currentTarget.username.value});
  
      setOpen(false)
      router.push(`/dms/${id}`)
    } catch (err) {
      toast.error("Failed to create direct message.", {
        description:
          err instanceof Error ? err.message : "Unknow error occurred.",
      });
    }
  };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
            <SidebarGroupAction>
                <PlusIcon />
                <span className="sr-only">New Direct Messages</span>
              </SidebarGroupAction>
            </DialogTrigger>
            <DialogContent>
        <DialogHeader>
          <DialogTitle>New Direct Message</DialogTitle>
          <DialogDescription>
            Enter a username to start messaging
          </DialogDescription>
        </DialogHeader>
        <form className="contents" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <Label htmlFor="username">Username </Label>
            <input type="text" name="" id="username" />
          </div>
          <DialogFooter>
            <Button>Start Messaging</Button>
          </DialogFooter>
        </form>
      </DialogContent>
        </Dialog>
    )
}
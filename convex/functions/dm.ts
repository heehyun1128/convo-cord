import { v } from "convex/values";
import { authenticatedMutation, authenticatedQuery } from "./helper";
import { QueryCtx } from "../_generated/server";
import { Doc, Id } from "../_generated/dataModel";

export const list = authenticatedQuery({
  handler: async (ctx) => {
    const directMessages = await ctx.db
      .query("directMessageMembers")
      .withIndex("by_user", (q) => q.eq("user", ctx.user._id))
      .collect();
    return await Promise.all(
      directMessages.map((dm) => getDM(ctx, dm.directMessage))
    );
  },
});

export const get = authenticatedQuery({
  args: {
    id: v.id("directMessages"),
  },
  handler: async (ctx, { id }) => {
    const member = await ctx.db
      .query("directMessageMembers")
      .withIndex("by_dm_user", (q) =>
        q.eq("directMessage", id).eq("user", ctx.user._id)
      )
      .first();
    if (!member) {
      throw new Error("You are not a member of this direct message.");
    }
    return await getDM(ctx, id);
  },
});

export const create = authenticatedMutation({
  args: {
    username: v.string(),
  },
  handler: async (ctx, { username }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", username))
      .first();
    if (!user) {
      throw new Error("User does not exist.");
    }

    const directMessagesForCurrentUser = await ctx.db
      .query("directMessageMembers")
      .withIndex("by_user", (q) => q.eq("user", ctx.user._id))
      .collect();
    const directMessagesForOtherUser = await ctx.db
      .query("directMessageMembers")
      .withIndex("by_user", (q) => q.eq("user", user._id))
      .collect();
    const directMessage = directMessagesForCurrentUser.find((dm) =>
      directMessagesForOtherUser.find(
        (dm2) => dm.directMessage === dm2.directMessage
      )
    );

    if (directMessage) {
        return directMessage?.directMessage;
    }
    const newDM=await ctx.db.insert("directMessages",{})
    await Promise.all([
        ctx.db.insert("directMessageMembers",{
            user:ctx.user._id,
            directMessage:newDM
        }),
        ctx.db.insert("directMessageMembers",{
            user:user._id,
            directMessage:newDM
        }),
    ])
    return newDM
  },
});

const getDM = async (
  ctx: QueryCtx & { user: Doc<"users"> },
  id: Id<"directMessages">
) => {
  const dm = await ctx.db.get(id);

  if (!dm) {
    throw new Error("No direct messages.");
  }

  const otherMember = await ctx.db
    .query("directMessageMembers")
    .withIndex("by_dm", (q) => q.eq("directMessage", id))
    .filter((q) => q.neq(q.field("user"), ctx.user._id))
    .first();

  if (!otherMember) {
    throw new Error("Direct message has no other members");
  }

  const user = await ctx.db.get(otherMember.user);
  if (!user) {
    throw new Error("Other member does not exist");
  }
  return {
    ...dm,
    user,
  };
};

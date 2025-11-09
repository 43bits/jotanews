import { db } from "../config/db.js";
import { votes } from "../schema/votes.schema.js";


export async function voteShowcase(showcaseId, userId, type) {

  const existing = await db.query.votes.findFirst({
    where: (v) => v.showcaseId.eq(showcaseId).and(v.userId.eq(userId))
  });

  if (existing) {
    let newUp = existing.up;
    let newDown = existing.down;

    if (type === "up") newUp = !existing.up;
    if (type === "down") newDown = !existing.down;

    if (newUp) newDown = false;
    if (newDown) newUp = false;

    await db.update(votes).set({ up: newUp, down: newDown }).where((v) => v.id.eq(existing.id));
  } else {
    await db.insert(votes).values({
      showcaseId,
      userId,
      up: type === "up",
      down: type === "down",
    });
  }

  return getShowcaseVotes(showcaseId);
}


export async function getShowcaseVotes(showcaseId) {
  const allVotes = await db.query.votes.findMany({
    where: (v) => v.showcaseId.eq(showcaseId)
  });

  const upCount = allVotes.filter(v => v.up).length;
  const downCount = allVotes.filter(v => v.down).length;

  return { upCount, downCount };
}

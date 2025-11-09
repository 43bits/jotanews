import express from "express";
import { voteShowcase, getShowcaseVotes } from "../services/voteService.js";

const router = express.Router();


router.post("/:showcaseId/:userId/:type", async (req, res) => {
  const { showcaseId, userId, type } = req.params;
  if (!["up", "down"].includes(type)) return res.status(400).json({ error: "Invalid vote type" });

  try {
    const votes = await voteShowcase(Number(showcaseId), Number(userId), type);
    res.json({ ok: true, votes });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});


router.get("/:showcaseId", async (req, res) => {
  const { showcaseId } = req.params;
  try {
    const votes = await getShowcaseVotes(Number(showcaseId));
    res.json({ ok: true, votes });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;

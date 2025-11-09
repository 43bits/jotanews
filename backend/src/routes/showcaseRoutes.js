
import express from "express";
import protectRoute from "../middleware/auth.middleware.js";
import cloudinary from "../config/cloudinary.js";
import { db } from "../config/db.js";
import { showcases } from "../schema/showcase.schema.js";
import { eq, and, desc, sql } from "drizzle-orm";
import { fetchPreview } from "../services/preview.service.js";
import { users } from "../schema/users.schema.js";

const router = express.Router();


router.post("/", protectRoute, async (req, res) => {
  try {
    const userId = req.user.id; 
    const { input } = req.body;

    if (!input) return res.status(400).json({ message: "Input required" });

    let type = "text";
    let url = null;
    let preview = null;

    
    if (input.startsWith("data:image")) {
     
      const base64Data = input.includes("base64,") 
        ? input.split("base64,")[1] 
        : input;

     
      const upload = await cloudinary.uploader.upload(`data:image/png;base64,${base64Data}`, {
        folder: "showcases",
      });

      type = "image";
      url = upload.secure_url;
      preview = {
        url,
        width: upload.width ?? null,
        height: upload.height ?? null,
      };
    }
  
    else if (/youtube\.com|youtu\.be/.test(input)) {
      type = "youtube";
      const videoId = input.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)?.[1];
      if (!videoId) return res.status(400).json({ message: "Invalid YouTube URL" });
      url = `https://www.youtube.com/embed/${videoId}`;
      preview = {
        embed: url,
        thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      };
    }
   
    else if (/^https?:\/\//.test(input)) {
      type = "link";
      url = input;
      preview = await fetchPreview(url); 
    }
   
    else {
      type = "text";
      url = null;
      preview = null;
    }

   
    const [newShowcase] = await db
      .insert(showcases)
      .values({
        userId,
        inputRaw: input,
        type,
        url,
        previewMeta: preview ?? null,
      })
      .returning();

    res.status(201).json(newShowcase);
  } catch (error) {
    console.error("Error creating showcase", error);
    res.status(500).json({ message: error.message });
  }
});


router.get("/", protectRoute, async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const rows = await db
      .select()
      .from(showcases)
      .where(eq(showcases.userId, userId))
      .orderBy(desc(showcases.createdAt))
      .limit(limit)
      .offset(offset);

    const countResult = await db.execute(
      sql`SELECT COUNT(*)::int as count FROM showcases WHERE user_id = ${userId}`
    );

    const totalShowcases = countResult.rows[0]?.count ?? 0;

    res.json({
      showcases: rows,
      currentPage: page,
      totalShowcases,
      totalPages: Math.ceil(totalShowcases / limit),
    });
  } catch (error) {
    console.error("Error listing showcases", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.get("/:id", protectRoute, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const [row] = await db
      .select()
      .from(showcases)
      .where(and(eq(showcases.id, Number(id)), eq(showcases.userId, userId)));

    if (!row) return res.status(404).json({ message: "Not found" });

    res.json(row);
  } catch (error) {
    console.error("Error getting showcase", error);
    res.status(500).json({ message: "Server get error" });
  }
});

router.put("/:id", protectRoute, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { input } = req.body;

    if (!input || !input.trim()) {
      return res.status(400).json({ message: "Input required" });
    }


     let type = "text";
    let url = null;
    let preview = null;

  
    if (input.startsWith("data:image")) {
     
      const base64Data = input.includes("base64,") 
        ? input.split("base64,")[1] 
        : input;

     
      const upload = await cloudinary.uploader.upload(`data:image/png;base64,${base64Data}`, {
        folder: "showcases",
      });

      type = "image";
      url = upload.secure_url;
      preview = {
        url,
        width: upload.width ?? null,
        height: upload.height ?? null,
      };
    }

    else if (/youtube\.com|youtu\.be/.test(input)) {
      type = "youtube";
      const videoId = input.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)?.[1];
      if (!videoId) return res.status(400).json({ message: "Invalid YouTube URL" });
      url = `https://www.youtube.com/embed/${videoId}`;
      preview = {
        embed: url,
        thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      };
    }
 
    else if (/^https?:\/\//.test(input)) {
      type = "link";
      url = input;
      preview = await fetchPreview(url); 
    }

    else {
      type = "text";
      url = null;
      preview = null;
    }
   
    const [existing] = await db
      .select()
      .from(showcases)
      .where(and(eq(showcases.id, Number(id)), eq(showcases.userId, userId)));

    if (!existing) {
      return res.status(404).json({ message: "Not found" });
    }






   
    const [updated] = await db
      .update(showcases)
      .set({ userId,
        inputRaw: input,
        type,
        url,
        previewMeta: preview ?? null,
       }) 
      .where(and(eq(showcases.id, Number(id)), eq(showcases.userId, userId)))
      .returning();

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating showcase", error);
    res.status(500).json({ message: error.message });
  }
});



router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const [deleted] = await db
      .delete(showcases)
      .where(and(eq(showcases.id, Number(id)), eq(showcases.userId, userId)))
      .returning();

    if (!deleted) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Showcase deleted successfully" });
  } catch (error) {
    console.error("Error deleting showcase", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.put("/:id/position", protectRoute, async (req, res) => {
  try {
    const { id } = req.params;
    const { posx, posy } = req.body;
    const userId = req.user.id;
    console.log("📩 PATCH /showcase/:id/position", { id, body: req.body });

    const updateData = {};
    if (posx !== undefined) updateData.posx = posx; 
    if (posy !== undefined) updateData.posy = posy; 

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No position values provided" });
    }

    const [item] = await db
      .update(showcases)
      .set(updateData)
      .where(
        and(
          eq(showcases.id, Number(id)),
          eq(showcases.userId, userId)
        )
      )
      .returning();


    if (!item) return res.status(404).json({ message: "Item not found" });
    
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server pos error" });
  }
});

router.get("/community/all-users", protectRoute, async (req, res) => {
  try {
    const rows = await db
      .select({ id: users.id, username: users.username, profileImage: users.profileImage })
      .from(users)
      .orderBy(users.username);

    res.json(rows);
  } catch (error) {
    console.error("Error fetching users", error);
    res.status(500).json({ message: "Server error" });
  }
});



export default router;

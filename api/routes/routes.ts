import { Router } from "express";

import { suggest, search, getEventDetails } from "../controllers/controller";

const router = Router();

router.get("/search", search);
router.get("/events/:eventid", getEventDetails);
router.get("/suggest", suggest);

export default router;

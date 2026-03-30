import { Router, type IRouter } from "express";
import healthRouter from "./health";
import trailsRouter from "./trails";
import authRouter from "./auth";
import postsRouter from "./posts";
import friendsRouter from "./friends";

const router: IRouter = Router();

router.use(healthRouter);
router.use(trailsRouter);
router.use(authRouter);
router.use(postsRouter);
router.use(friendsRouter);

export default router;

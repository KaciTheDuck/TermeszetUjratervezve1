import { Router, type IRouter } from "express";
import healthRouter from "./health";
import trailsRouter from "./trails";

const router: IRouter = Router();

router.use(healthRouter);
router.use(trailsRouter);

export default router;

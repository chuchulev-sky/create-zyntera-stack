/**
 * HTTP API v1 routes (mounted under `/api/v1` in `server.ts`).
 */
import { toNodeHandler } from "better-auth/node";
import { Router } from "express";
import { auth } from "../config/auth.js";
import { createAuthController } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { userRepository } from "../repositories/user.repository.js";
import { createAuthService } from "../services/user.service.js";
import { requireVerifiedEmail } from "../middleware/verified.middleware.js";
import { adminController } from "../controllers/admin.controller.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

const router = Router();

/**
 * Initialize Auth Layers
 */
const authService = createAuthService(userRepository);
const authController = createAuthController(authService);

/**
 * Auth Routes
 *
 * - `ALL /auth/*` — Better Auth handler (sessions, credentials, etc.).
 * - `GET /me` — current user; requires a valid session cookie / headers.
 */
router.all('/auth/*path', toNodeHandler(auth));
router.get('/me', authMiddleware, requireVerifiedEmail, authController.getMe);

/**
 * Admin Routes
 * 
 * - `GET /admin` — get admin meta.
 * - `GET /admin/:model` — list model data.
 * - `PUT /admin/:model/:id` — update model data.
 */
const adminRouter = Router();
adminRouter.use(authMiddleware, requireVerifiedEmail, requireAdmin);
adminRouter.get('/meta', adminController.getMeta);
adminRouter.get('/:model', adminController.listModel);
adminRouter.put('/:model/:id', adminController.updateModel);

router.use('/admin', adminRouter);

export default router;
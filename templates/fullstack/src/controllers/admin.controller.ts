import type { Request, Response } from 'express';
import { z } from 'zod';
import { adminListQuerySchema } from '../admin/query.js';
import { getAdminMetaList, getAdminModelMeta } from '../admin/registry.js';
import { updateUserAdminSchema } from '../admin/validation.js';
import { listUsers, updateUser } from '../services/admin.service.js';

function toSingleParam(value: string | string[] | undefined): string | null {
    if (!value) return null;
    return Array.isArray(value) ? value[0] ?? null : value;
}


export const adminController = {
    getMeta(_req: Request, res: Response) {
        return res.json({ models: getAdminMetaList() });
    },

    async listModel(req: Request, res: Response) {
        const model = toSingleParam(req.params.model);
        if (!model) return res.status(400).json({ message: 'Model is required' });

        if (!getAdminModelMeta(model)) {
            return res.status(404).json({ message: `Unknown model: ${model}` });
        }

        if (model === 'users') {
            const queryParsed = adminListQuerySchema.safeParse(req.query);
            if (!queryParsed.success) {
                return res.status(400).json({
                    message: 'Invalid query parameters',
                })
            }
            const data = await listUsers(req.query as any);
            return res.json(data);
        }

        return res.status(501).json({ message: `Model not implemented: ${model}` });
    },

    async updateModel(req: Request, res: Response) {
        const model = toSingleParam(req.params.model);
        const id = toSingleParam(req.params.id);

        if (!model || !id) return res.status(400).json({ message: 'Missing parameters' });

        if (!getAdminModelMeta(model)) {
            return res.status(404).json({ message: `Unknown model: ${model}`});
        }

        if (model === 'users') {
            const parsed = updateUserAdminSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    message: 'Invalid payload',
                    errors: z.treeifyError(parsed.error),
                });
            }
            const updated = await updateUser(id, parsed.data);
            if (!updated) return res.status(404).json({ message: 'Record not found' });
            return res.json(updated);
        }
        return res.status(401).json({ message: `Model not implemented: ${model}` });
    }
}
import { Router } from 'express';
import { zone } from '../../db';
import BadRequestError from '../../errors/bad-request-error';
import NotFoundError from '../../errors/not-found-error';
import { asyncHandler } from '../api.helpers';

export default function deleteZone(router: Router): void {
  router.delete(
    '/zones/:id',
    asyncHandler(async (req, res) => {
      const { headers, params } = req;
      const { id } = params;

      if (headers['x-tenant-id'] == null) {
        throw new BadRequestError('tenant id is missing');
      }
      const tenantId = headers['x-tenant-id'] as string;

      if (Number.isNaN(Number(id))) {
        throw new BadRequestError('invalid zone id');
      }

      const deletedZone = await zone.deleteById(Number(id), tenantId);

      if (deletedZone == null) {
        throw new NotFoundError('zone not found');
      }

      res.status(204).end();
    }),
  );
}

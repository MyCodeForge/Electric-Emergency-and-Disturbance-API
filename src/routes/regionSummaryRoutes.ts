import { Router } from "express";
import { 
    getDisturbanceEventsSummaryByRegion
} from '../controllers/regionSummaryController';

const router = Router();
/**
 *  NOTE: We must use Openapi 3.0.3 here because swagger-jsdoc does not support 3.1.1.
 */

/**
 * @openapi
 *   /regions/summary/:
 *     get:
 *       tags:
 *         - regions
 *       summary: Get a high-level overview of regional impact.
 *       description: 'Returns a summary of events by NERC region (e.g., count of events, average demand loss in mw).'
 *       operationId: getDisturbanceEventsSummaryByRegion
 *       responses:
 *         '200':
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/RegionSummary'
 */
router.get('/summary/region', getDisturbanceEventsSummaryByRegion);

export default router;
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
 *       parameters:
 *         - name: sortBy
 *           in: query
 *           required: false
 *           description: Field used to sort returned data.
 *           schema:
 *             type: string
 *             default: none
 *             enum:
 *               - month
 *               - date_event_began
 *               - time_event_began
 *               - date_of_restoration
 *               - time_of_restoration
 *               - area_affected
 *               - nerc_resion
 *               - alert_criteria
 *               - event_type
 *               - demand_loss_in_mw
 *               - customers_affected
 *         - name: order
 *           in: query
 *           required: false
 *           description: asc or desc order.
 *           schema:
 *             type: string
 *             default: none
 *             enum:
 *               - asc
 *               - desc
 *         - name: offset
 *           in: query
 *           required: false
 *           description: First record of data to return.
 *           schema:
 *             type: number
 *             default: 0
 *         - name: limit
 *           in: query
 *           required: false
 *           description: Number of records of data to return.
 *           schema:
 *             type: number
 *             default: 10
 *         - name: unit
 *           in: query
 *           required: false
 *           description: Unit of measurement used for Downtime calculations. Accepts s (seconds), m (minutes), h (hours), d (days). Defualts to seconds.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/RegionSummary'
 */
router.get('/summary/', getDisturbanceEventsSummaryByRegion);

export default router;
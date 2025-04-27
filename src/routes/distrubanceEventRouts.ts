import { Router } from "express";
import { 
    getDisturbanceEvents, 
    getDisturbanceEventsByMonth,
    getDisturbanceEventsByRegion, 
    getDisturbanceEventsByEventType 
} from '../controllers/disturbanceEventController';

const router = Router();
/**
 *  NOTE: We must use Openapi 3.0.3 here because swagger-jsdoc does not support 3.1.1.
 */

/**
 * @openapi
 *  /disturbance-events/:
 *   get:
 *     tags:
 *       - disturbance-events 
 *     summary: Get disturbance events.
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DisturbanceEvent'
 */

router.get('/', getDisturbanceEvents);

/**
 * @openapi
 * /disturbance-events/month/{month}:
 *   get:
 *     tags:
 *       - disturbance-events
 *     summary: Get disturbance events by month.
 *     description: 'Multiple months can be provided with comma separated strings'
 *     operationId: getDisturbanceEventsByMonth
 *     parameters:
 *       - name: month
 *         in: path
 *         description: Status values that need to be considered for filter
 *         required: false
 *         explode: true
 *         schema:
 *           type: string
 *           default: none
 *           enum:
 *             - January
 *             - February
 *             - March
 *             - April
 *             - May
 *             - June
 *             - July
 *             - August
 *             - September
 *             - October
 *             - November
 *             - December
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DisturbanceEvent'
 *       '400':
 *         description: Invalid ID supplied
 *       '404':
 *         description: Disturnace events not found
 *       '422':
 *         description: Validation exception
 *       default:
 *         description: Unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'  #  Corrected the $ref (was "#")
 */

router.get('/month/:month', getDisturbanceEventsByMonth);

/**
 * @openapi
 * /disturbance-events/region/{region}:
 *     get:
 *       tags:
 *         - disturbance-events
 *       summary: Get disturbance events by regions.
 *       description: 'Multiple regions can be provided with comma separated strings'
 *       operationId: getDisturbanceEventsByRegion
 *       parameters:
 *         - name: region
 *           in: path
 *           description: Status values that need to be considered for filter
 *           required: true
 *           schema:
 *             type: string
 *             default: none
 *             enum:
 *               - FRCC
 *               - MRO
 *               - N/A
 *               - NPCC
 *               - PR
 *               - RF
 *               - RFC
 *               - SERC
 *               - TRE
 *               - WECC
 *       responses:
 *         '200':
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/DisturbanceEvent'
 *         '400':
 *           description: Invalid ID supplied
 *         '404':
 *           description: Disturnace events not found
 *         '422':
 *           description: Validation exception
 *         default:
 *           description: Unexpected error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'  #  Corrected the $ref (was "#")
 */
router.get('/region/:region', getDisturbanceEventsByRegion);

/**
 * @openapi
 *   /disturbance-events/eventtype/{eventtype}:
 *     get:
 *       tags:
 *         - disturbance-events
 *       summary: Get disturbance events by event types.
 *       description: 'Multiple event types can be provided with comma separated strings'
 *       operationId: getDisturbanceEventsByEventType
 *       parameters:
 *         - name: eventtype
 *           in: path
 *           description: Status values that need to be considered for filter
 *           required: false
 *           explode: true
 *           schema:
 *             type: string
 *             default: none
 *             enum:
 *               - Cyber Attack
 *               - Cyber Event
 *               - Distribution Interruption
 *               - Fuel Supply Deficiency
 *               - Generation Inadequacy
 *               - Islanding
 *               - Natural Disaster
 *               - Other
 *               - Public Appeal
 *               - Physical Attack
 *               - Sabotage
 *               - Severe Weather
 *               - Suspicious Activity
 *               - System Operations
 *               - Transmission Interruption
 *               - Vandalism
 *               - Weather
 *       responses:
 *         '200':
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/DisturbanceEvent'
 *         '400':
 *           description: Invalid ID supplied
 *         '404':
 *           description: Disturnace events not found
 *         '422':
 *           description: Validation exception
 *         default:
 *           description: Unexpected error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'  #  Corrected the $ref (was "#")
 */
router.get('/eventtype/:event_type', getDisturbanceEventsByEventType);

export default router;
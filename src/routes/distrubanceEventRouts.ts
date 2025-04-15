import { Router } from "express";
import { getDisturbanceEvents, getDisturbanceEventsByMonth,getDisturbanceEventsByRegion, getDisturbanceEventsByEventType } from '../controllers/disturbanceEventController';

const router = Router();

// router.post('/');

router.get('/', getDisturbanceEvents);

router.get('/month/:month', getDisturbanceEventsByMonth);

router.get('/region/:region', getDisturbanceEventsByRegion);

router.get('/eventtype/:event_type', getDisturbanceEventsByEventType);

/* router.patch('/:id');

router.delete('/:id'); */

export default router;
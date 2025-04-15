import { Router } from "express";
import { getDisturbanceEvents, getDisturbanceEventsByMonth } from '../controllers/disturbanceEventController';

const router = Router();

// router.post('/');

router.get('/', getDisturbanceEvents);

router.get('/month/:month', getDisturbanceEventsByMonth);

/* router.patch('/:id');

router.delete('/:id'); */

export default router;
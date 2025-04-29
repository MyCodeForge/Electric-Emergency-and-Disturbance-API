import { RequestHandler, response} from "express";
import { RegionSummary } from '../types/regionSummary';
import disturbanceEventModel from '../model/disturbanceEventsModel';

export const getDisturbanceEventsSummaryByRegion: RequestHandler = (req, res, next) => {
    try{
        const sortBy = req.query.sortBy as keyof RegionSummary;
        const order = req.query.order as 'asc' | 'desc';
        const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : undefined;
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
        const unit = req.query.unit as 's'|'m'|'h'|'d';

        const events = disturbanceEventModel.getRegionSummaries(sortBy, order, offset, limit, unit);
        res.status(200).json(events);
    }catch (error){
        next(error);
    }
}
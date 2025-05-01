import { RequestHandler, response} from "express";
import { DisturbanceEvent } from '../types/disturbanceEvent';
import disturbanceEventModel from '../model/disturbanceEventsModel';

export const getDisturbanceEvents: RequestHandler = (req, res, next) => {
    try{
        const sortBy = req.query.sortBy as keyof DisturbanceEvent;
        const order = req.query.order as 'asc' | 'desc';
        const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

        const events = disturbanceEventModel.getAllEvents(sortBy, order, offset, limit);
        res.status(200).json(events);
    }catch (error){
        next(error);
    }
}

export const getDisturbanceEventsByMonth: RequestHandler = (req, res, next) => {
    const month = req.params.month;
    
    if(month) { // check that req.params.month is defined
        try{
            const sortBy = req.query.sortBy as keyof DisturbanceEvent;
            const order = req.query.order as 'asc' | 'desc';
            const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    
            res.status(200).send( disturbanceEventModel.getEventsByMonth(month, sortBy, order, offset, limit) )
        }catch (error){
            next(error);
        }
    } else {
        //  Handle the case where 'month' is undefined
        res.status(400).send({ message: "Month parameter is required" }); //  Send a 400 Bad Request
    }
}

export const getDisturbanceEventsByRegion: RequestHandler = (req, res, next) => {
    const nerc_region = req.params.region;
    
    if(nerc_region) { // check that req.params.month is defined
        try{
            const sortBy = req.query.sortBy as keyof DisturbanceEvent;
            const order = req.query.order as 'asc' | 'desc';
            const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    
            res.status(200).send( disturbanceEventModel.getEventsByRegion(nerc_region, sortBy, order, offset, limit) )
        }catch (error){
            next(error);
        }
    } else {
        //  Handle the case where 'nerc_region' is undefined
        res.status(400).send({ message: "Region parameter is required" }); //  Send a 400 Bad Request
    }
}

export const getDisturbanceEventsByEventType: RequestHandler = (req, res, next) => {
    const event_type = req.params.event_type;
    
    if(event_type) { // check that req.params.month is defined
        try{
            const sortBy = req.query.sortBy as keyof DisturbanceEvent;
            const order = req.query.order as 'asc' | 'desc';
            const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    
            res.status(200).send( disturbanceEventModel.getEventsByEventType(event_type, sortBy, order, offset, limit) )
        }catch (error){
            next(error);
        }
    } else {
        //  Handle the case where 'event_type' is undefined
        res.status(400).send({ message: "Event Type parameter is required" }); //  Send a 400 Bad Request
    }
}

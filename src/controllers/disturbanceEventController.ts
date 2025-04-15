import { RequestHandler, response} from "express";
import data from '../data/DOE_Electric_Disturbance_Events.json';
import { DisturbanceEvent } from '../data-type';

const disturbanceEventArray: DisturbanceEvent[] = data as DisturbanceEvent[];

// define custom functions
function filterByMonth(data: DisturbanceEvent[], month: String) {
    return data.filter( function(e) {
        return (e.month == month);
    })[0];
}

export const getDisturbanceEvents: RequestHandler = (req, res, next) => {
    res.status(200).send( disturbanceEventArray )
}
export const getDisturbanceEventsByMonth: RequestHandler = (req, res, next) => {
    res.status(200).send( filterByMonth(disturbanceEventArray, req.params.month) )
}
import { RequestHandler, response} from "express";
import data from '../data/DOE_Electric_Disturbance_Events.json';
import { DisturbanceEvent } from '../types/disturbanceEvent';

const disturbanceEventArray: DisturbanceEvent[] = data as DisturbanceEvent[];

// define custom functions
function filterBy(data: DisturbanceEvent[], propertyName: keyof DisturbanceEvent, value: string | number) {
    return data.filter( function(disturbanceEvent) {
        const propertyValue = disturbanceEvent[ propertyName ];
        if (typeof propertyValue === 'string' && typeof value === 'string') {
            return propertyValue.toLocaleLowerCase().includes(value.toLocaleLowerCase());
        }
        if (typeof propertyValue === 'number' && typeof value === 'number') {
            return propertyValue === value;
        }
        
        return false; // if the property type is not recognized, don't include it in the filter
    });
}

export const getDisturbanceEvents: RequestHandler = (req, res, next) => {
    const orderBy = req.query.orderBy as keyof DisturbanceEvent | undefined;
    const order = (req.query.order as string | undefined)?.toLowerCase() === 'desc' ? 'desc' : 'asc';

    if (orderBy) {
        disturbanceEventArray.sort((a, b) => {
            const valueA = a[orderBy];
            const valueB = b[orderBy];

            if (typeof valueA === 'string' && typeof valueB === 'string') {
                return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
            } else if (typeof valueA === 'number' && typeof valueB === 'number') {
                return order === 'asc' ? valueA - valueB : valueB - valueA;
            } else {
                // Handle cases where the property types are different or not comparable
                return 0; // Maintain original order
            }
        });
    }

    res.status(200).send( disturbanceEventArray )
}

export const getDisturbanceEventsByMonth: RequestHandler = (req, res, next) => {
    const month = req.params.month;
    
    if(month) { // check that req.params.month is defined
        res.status(200).send( filterBy(disturbanceEventArray, "month", month) )
    } else {
        //  Handle the case where 'month' is undefined
        res.status(400).send({ message: "Month parameter is required" }); //  Send a 400 Bad Request
    }
}

export const getDisturbanceEventsByRegion: RequestHandler = (req, res, next) => {
    const nerc_region = req.params.region;
    
    if(nerc_region) { // check that req.params.month is defined
        res.status(200).send( filterBy(disturbanceEventArray, "nerc_region", nerc_region) )
    } else {
        //  Handle the case where 'nerc_region' is undefined
        res.status(400).send({ message: "Region parameter is required" }); //  Send a 400 Bad Request
    }
}

export const getDisturbanceEventsByEventType: RequestHandler = (req, res, next) => {
    const event_type = req.params.event_type;
    
    if(event_type) { // check that req.params.month is defined
        res.status(200).send( filterBy(disturbanceEventArray, "event_type", event_type) )
    } else {
        //  Handle the case where 'event_type' is undefined
        res.status(400).send({ message: "Event Type parameter is required" }); //  Send a 400 Bad Request
    }
}

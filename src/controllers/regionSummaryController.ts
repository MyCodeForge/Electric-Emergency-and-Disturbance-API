import { RequestHandler, response} from "express";
import { RegionSummary } from '../types/regionSummary';

const regionSummaryArray: RegionSummary[] = [];

// define custom functions
function filterBy(data: RegionSummary[], propertyName: keyof RegionSummary, value: string | number) {
    return data.filter( RegionSummary => {
        const propertyValue = RegionSummary[ propertyName ];
        if (typeof propertyValue === 'string' && typeof value === 'string') {
            return propertyValue.toLocaleLowerCase().includes(value.toLocaleLowerCase());
        }
        if (typeof propertyValue === 'number' && typeof value === 'number') {
            return propertyValue === value;
        }
        
        return false; // if the property type is not recognized, don't include it in the filter
    });
}
export const getDisturbanceEventsSummaryByRegion: RequestHandler = (req, res, next) => {
    const orderBy = req.query.orderBy as keyof RegionSummary | undefined;
    const order = (req.query.order as string | undefined)?.toLowerCase() === 'desc' ? 'desc' : 'asc';

    if (orderBy) {
        regionSummaryArray.sort(( a, b) => {
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

    res.status(200).send( regionSummaryArray )
}
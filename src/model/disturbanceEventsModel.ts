import { off } from 'process';
import { DisturbanceEvent } from '../types/disturbanceEvent';
import { RegionSummary, AffectedAreaSummary, SummaryMetrics } from '../types/regionSummary';
import * as fs from 'fs';
import * as path from 'path';

const dataFilePath = path.resolve(__dirname, '../data/DOE_Electric_Disturbance_Events.json');

class DisturbanceEventModel {
    private disturbanceEvents: DisturbanceEvent[] = [];

    constructor() {
        this.loadData();
    }

    private loadData(): void {
        try {
            const rawData = fs.readFileSync(dataFilePath, 'utf-8');
            this.disturbanceEvents = JSON.parse(rawData);

        } catch (error) {
            console.error('Error loading disturbance event data:', error);
            this.disturbanceEvents = []; //  Initialize to an empty array to prevent errors
        }
    }
    private convertMiliseconds(miliseconds:number, format:string) {
        const seconds: number = miliseconds / 1000;
        const minutes: number = seconds / 60;
        const hours: number = minutes / 60;
        const days: number = hours / 24;
        
        switch(format) {
          case 'm':
              return minutes;
          case 'h':
              return hours;
          case 'd':
              return days;
          default:
              return seconds;
        }
      }

    private updateAffectedAreaCounts(
        affectedAreaSummaries: AffectedAreaSummary[],
        affectedAreas: string[]
    ): void {
        affectedAreas.forEach(area => {
            // Find the AffectedAreaSummary object for the current area
            let affecedArea = affectedAreaSummaries.find(el => el.area === area);
    
            // Check if it exists 
            if (!affecedArea) {
                // Create a new AffectedAreaSummary object and add it to the array
                affecedArea = {
                    area: area,
                    event_count: 0
                }
                affectedAreaSummaries.push(affecedArea);
            }
            // update the count
            affecedArea.event_count++;
        });
    }

    private sort<T extends DisturbanceEvent | RegionSummary>(
        data: T[],
        sortBy: keyof T,
        order: string
    ) {
        let sortedData = [...data];

        if (sortBy){
            sortedData.sort((a, b) => {
                if (a[sortBy] < b[sortBy]) {
                    return order === 'asc' ? -1 : 1;
                }
                if (a[sortBy] > b[sortBy]) {
                    return order === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return sortedData;
    }

    private page<T extends DisturbanceEvent | RegionSummary>(
        data: T[],
        offset: number,
        limit: number
    ) {
        let pagedData = [...data];

        if (offset !== undefined && limit !== undefined){
            return pagedData.slice(offset, offset + limit);
        }

        return pagedData;
    }

    getAllEvents(sortBy?: keyof DisturbanceEvent, order: 'asc'|'desc' = 'asc', offset?:number, limit?:number): DisturbanceEvent[] {
        let events: DisturbanceEvent[] = [...this.disturbanceEvents];

        //sort
        if(sortBy)
            events = this.sort( events, sortBy, order);

        // apply pagination
        if (offset !== undefined && limit !== undefined)
            events = this.page( events, offset, limit);
        
        return events;
    }

    getEventsByMonth(month: string, sortBy?: keyof DisturbanceEvent, order: 'asc'|'desc' = 'asc', offset?:number, limit?:number): DisturbanceEvent[] {
        return this.disturbanceEvents.filter(event => event.month === month);
    }

    getEventsByRegion(region: string, sortBy?: keyof DisturbanceEvent, order: 'asc'|'desc' = 'asc', offset?:number, limit?:number): DisturbanceEvent[] {
        return this.disturbanceEvents.filter(event => event.nerc_region === region);
    }

    getEventsByEventType(type: string, sortBy?: keyof DisturbanceEvent, order: 'asc'|'desc' = 'asc', offset?:number, limit?:number): DisturbanceEvent[] {
        let events: DisturbanceEvent[] = [...this.disturbanceEvents];
        events = events.filter(event => event.event_type === type);
        console.log('offset,limit',offset,limit);
        //sort
        if(sortBy)
            events = this.sort( events, sortBy, order);

        // apply pagination
        if (offset !== undefined && limit !== undefined)
            events = this.page( events, offset, limit);
        
        return events;
    }

    //  Add other filtering methods as needed

    //  Crucially, add your aggregation/summary method:
    getRegionSummaries(sortBy?: keyof RegionSummary, order: 'asc'|'desc' = 'asc', offset?:number, limit?:number, unit: 's'|'m'|'h'|'d' = 's'): { [region: string]: RegionSummary } {
        const summaries: { [region: string]: RegionSummary } = {};

        this.disturbanceEvents.forEach(event => {
            let summary = summaries[event.nerc_region]; 

            if (!summary) {
                summary = { // Initialize
                    from_date: new Date(),
                    to_date: new Date("1-1-1900"),
                    total_events: 0,
                    demand_loss_in_mw: { average: 0, min: Infinity, max: -Infinity },
                    customers_affected: { average: 0, min: Infinity, max: -Infinity },
                    event_types: [],
                    downtime: { average: 0, min: Infinity, max: -Infinity },
                    downtime_unit: unit,
                    affected_areas: [],
                    no_events: false
                };
                summaries[event.nerc_region] = summary; // Assign to summaries
            }

            /**
             * DATE RANGE
             */
            const from_date = new Date(event.date_event_began);
            if(summary.from_date > from_date)
                summary.from_date = from_date;
            
            const to_date = new Date(event.date_of_restoration);
            if(summary.to_date < to_date)
                summary.to_date = to_date;

            /**
             * EVENT SUMMARIES
             */
            summary.total_events++;
            if(typeof event.demand_loss_in_mw === 'number'){
                summary.demand_loss_in_mw.max = Math.max(summary.demand_loss_in_mw.max, event.demand_loss_in_mw);
                if(event.demand_loss_in_mw > 0) // 0 is not a useful data point. we want to know what was the lowest MEASURABLE datapoint.
                    summary.demand_loss_in_mw.min = Math.min(summary.demand_loss_in_mw.min, event.demand_loss_in_mw);
                summary.demand_loss_in_mw.average = (summary.demand_loss_in_mw.max + summary.demand_loss_in_mw.min) / 2; 
            }
            if(typeof event.customers_affected === 'number'){
                summary.customers_affected.min = Math.min(summary.customers_affected.min, event.customers_affected);
                if(event.customers_affected > 0) // 0 is not a useful data point. we want to know what was the lowest MEASURABLE datapoint.
                    summary.customers_affected.max = Math.max(summary.customers_affected.max, event.customers_affected);
                summary.customers_affected.average = (summary.customers_affected.max + summary.customers_affected.min) / 2;
            }
            if (!summary.event_types.includes(event.event_type)) {
                summary.event_types.push(event.event_type);
            }

            /**
             *  CALCULATE DOWNTIME
             */

            // date and times are sometimes listed as "unknown" or blanks in the data, so we need to 
            // account for values that cannot be converted with new Date().
            let beginDowntime: Date | null = null;
            if( // skip if values are NULL or "unknown"
                event.date_event_began &&
                event.date_event_began.toLocaleLowerCase() !== "unknown" &&
                event.time_event_began &&
                event.time_event_began.toLocaleLowerCase() !== "unknown"
            ) {
                // create date from values
                const dateString = `${event.date_event_began} ${event.time_event_began}`;
                const tempDate = new Date(dateString);

                if(!isNaN(tempDate.getTime())) // only store valid date objects into begin_downtime
                    beginDowntime = tempDate;
            }

            let endDowntime: Date | null = null;
            if( // skip if values are NULL or "unknown"
                event.date_event_began &&
                event.date_event_began.toLocaleLowerCase() !== "unknown" &&
                event.time_event_began &&
                event.time_event_began.toLocaleLowerCase() !== "unknown"
            ) {
                // create date from values
                const dateString = `${event.date_of_restoration} ${event.time_of_restoration}`;
                const tempDate2 = new Date(dateString);

                if(!isNaN(tempDate2.getTime())) // only store valid date objects into end_downtime
                    endDowntime = tempDate2;
            }

            if(beginDowntime && !isNaN(beginDowntime.getTime()) && endDowntime && !isNaN(endDowntime.getTime())) { // check if our begin and end downtimes are valid
                const diffInMs = Math.abs(endDowntime.getTime() - beginDowntime.getTime());
                if( diffInMs > 0 ) { // do not track downtimes that have a zero value
                    if(diffInMs > summary.downtime.max)
                        summary.downtime.max = diffInMs;
                    if(diffInMs < summary.downtime.min)
                        summary.downtime.min = diffInMs;
                    summary.downtime.average = (summary.downtime.max + summary.downtime.min) / 2;
                }
            }

            /**
             * AFFECTED AREAS SUMMARIES
             * 
             * NOTE: The values in the data are not standardize. 
             *       Some list "city, state" format.
             *       Others list "state: county".
             *       And others list "county, state".
             *       This makes separating them into AffectedAreaSummary Objects of only limited use.
             */

            // loop over all areas listed under event.area_affected
            const areasToUpdate: string[] = event.area_affected.split(";").map(value => value.trim()).filter(value => value !== "");
            this.updateAffectedAreaCounts(summary.affected_areas, areasToUpdate);
            
        });

        // convert downtimes into choosen unit of measurement
        for (const region in summaries) {
            summaries[region]!.downtime.average = this.convertMiliseconds(summaries[region]!.downtime.average, unit);
            summaries[region]!.downtime.min = this.convertMiliseconds(summaries[region]!.downtime.min, unit);
            summaries[region]!.downtime.max = this.convertMiliseconds(summaries[region]!.downtime.max, unit);
        }

        return summaries;
    }
}

export default new DisturbanceEventModel(); //  Export an instance (Singleton pattern)
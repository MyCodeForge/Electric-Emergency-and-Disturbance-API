// define schema for DOE_Electric_Disturbance_Events.json file
export interface DisturbanceEvent {
    month: string,
    date_event_began: string,
    time_event_began: string,
    date_of_restoration: string,
    time_of_restoration: string,
    area_affected: string,
    nerc_region: string,
    alert_criteria: string,
    event_type: string,
    demand_loss_in_mw: number,
    customers_affected: number
}
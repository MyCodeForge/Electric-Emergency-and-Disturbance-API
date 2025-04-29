// data to be returned when requesting a summary of each region
export interface SummaryMetrics {
    average: number,
    min: number,
    max: number
}
export interface AffectedAreaSummary {
    area: string;
    event_count: number;
}

export interface RegionSummary {
    from_date: Date,
    to_date: Date,
    total_events: number,
    demand_loss_in_mw: SummaryMetrics,
    customers_affected: SummaryMetrics,
    event_types: string[],
    downtime: SummaryMetrics,
    downtime_unit: string, // e.g., "hours", "minutes"
    affected_areas: AffectedAreaSummary[],
    no_events: boolean // flag to indicate that there are no events in the provided range
}



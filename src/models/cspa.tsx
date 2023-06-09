import { DateTime } from 'luxon';
import { Typography } from '@mui/material';

export type Preference = "F1"
    | "F2A"
    | "F2B"
    | "F3"
    | "F4"

export type Country = "other"
    | "china"
    | "india"
    | "mexico"
    | "philippines"

// flesh out result types
export type ResultType =
    "available" // visa available
    | "unavailable"

export interface Age {
    Days: number
    Months: number
    Years: number
}

export interface Result {
    resultType: ResultType
    message: string | React.ReactNode;
}

export interface CspaResults {
    daysPending: number | null
    daysTotal: number | null
    cspaAge: Age | null
    actualAge: Age | null
    errorMessage: string | null // non-null if semantic error present
    result: Result | null
}

export interface VisaBulletinRow {
    preference: Preference;
    other: string;
    china: string;
    india: string;
    mexico: string;
    philippines: string;
}

class CspaCalculator {
    visaBulletinDates: Map<Preference, Map<Country, DateTime>> = new Map<Preference, Map<Country, DateTime>>([])

    // dates automatically updated to reflect visa bulletin (formatting roughly reflects the formatting of the bulletin dates)
    // TODO: set a cron job w/ gh-actions to scrape bulletin and automatically update these values monthly
    constructor(rawData: VisaBulletinRow[]) {
        if (rawData !== undefined && rawData.length !== 0) {
            rawData.forEach((row: VisaBulletinRow) => {
                // console.log(row)
                this.visaBulletinDates.set(row.preference, new Map<Country, DateTime>([
                    ["other", DateTime.fromFormat(row.other, 'MM/dd/yyyy')],
                    ["china", DateTime.fromFormat(row.china, 'MM/dd/yyyy')],
                    ["india", DateTime.fromFormat(row.india, 'MM/dd/yyyy')],
                    ["mexico", DateTime.fromFormat(row.mexico, 'MM/dd/yyyy')],
                    ["philippines", DateTime.fromFormat(row.philippines, 'MM/dd/yyyy')]
                ]))
            })
        }
    }

    public calcCspaAge = (birthDate: DateTime, priorityDate: DateTime, approvalDate: DateTime, bulletinDate: DateTime): CspaResults => {
        const pendingPeriod = approvalDate.diff(priorityDate, ['days'])
        const totalPeriod = bulletinDate.diff(birthDate, ['days'])
        const cspaAgeDiff = bulletinDate.minus(pendingPeriod).diff(birthDate, ['days', 'months', 'years'])
        const actualAgeDiff = bulletinDate.diff(birthDate, ['days', 'months', 'years'])

        // can CSPA age be equal to 21 years exactly, or does it have to be under 21
        const cspaResult: Result = cspaAgeDiff.years < 21 ? {
            resultType: "available",
            message: <Typography>Your CSPA age on <b>{bulletinDate.toLocaleString(DateTime.DATE_MED)}</b> (the Visa Bulletin date) would be <b>{cspaAgeDiff.years} years, {cspaAgeDiff.months} months, and {Math.floor(cspaAgeDiff.days)} days</b></Typography>,
        } : {
            resultType: "unavailable",
            message: "Unfortunately you cannot apply for a visa. The CSPA age is equal to or older than 21 years",
        }

        // TODO: return something sensible for negative ages 
        return {
            daysPending: pendingPeriod.days,
            daysTotal: totalPeriod.days,
            cspaAge: {
                Days: cspaAgeDiff.days,
                Months: cspaAgeDiff.months,
                Years: cspaAgeDiff.years
            },
            actualAge: {
                Days: actualAgeDiff.days,
                Months: actualAgeDiff.months,
                Years: actualAgeDiff.years
            },
            errorMessage: null,
            result: cspaResult,
        }
    }

    public isValidDate = (date: DateTime | null): boolean => {
        return date !== null && date.isValid
    }

    public calcCspaAgeFromPreference = (birthDate: DateTime | null, priorityDate: DateTime | null, approvalDate: DateTime | null, preference: Preference, country: Country): CspaResults => {
        // TODO: we need to perform further input validation (e.g. a birthdate occuring after a priority date)
        if (!this.isValidDate(birthDate) || !this.isValidDate(priorityDate) || !this.isValidDate(approvalDate)) {
            return {
                daysPending: null,
                daysTotal: null,
                cspaAge: null,
                actualAge: null,
                errorMessage: "Invalid input dates",
                result: null,
            }
        }

        const bulletinDate = this.visaBulletinDates.get(preference)?.get(country)
        if (bulletinDate === undefined) {
            return {
                daysPending: null,
                daysTotal: null,
                cspaAge: null,
                actualAge: null,
                errorMessage: "Internal error: unable to find an appropriate visa bulletin date",
                result: null,
            }
        }

        // @ts-ignore (typescript can't pick up the earlier null validation checks)
        return this.calcCspaAge(birthDate, priorityDate, approvalDate, bulletinDate)
    }
}
export { CspaCalculator }
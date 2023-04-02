import { DateTime } from 'luxon';
import { Typography } from '@mui/material';

export type Preference = "F1"
    | "F2A"
    | "F2B"
    | "F3"
    | "F4"


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

// dates automatically updated to reflect visa bulletin (formatting roughly reflects the formatting of the bulletin dates)
// TODO: set a cron job w/ gh-actions to scrape bulletin and automatically update these values monthly
const visaBulletinDates = new Map<Preference, DateTime>([
    ["F1", DateTime.fromFormat('01-03-2012', 'dd-MM-yyyy')],
    ["F2A", DateTime.now()],
    ["F2B", DateTime.fromFormat('22-10-2011', 'dd-MM-yyyy')],
    ["F3", DateTime.fromFormat('08-06-2002', 'dd-MM-yyyy')],
    ["F4", DateTime.fromFormat('22-08-2002', 'dd-MM-yyyy')],
]);

const calcCspaAge = (birthDate: DateTime, priorityDate: DateTime, approvalDate: DateTime, bulletinDate: DateTime): CspaResults => {
    const pendingPeriod = approvalDate.diff(priorityDate)
    const totalPeriod = bulletinDate.diff(birthDate)
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

const isValidDate = (date: DateTime | null): boolean => {
    return date != null && date.isValid
}

const calcCspaAgeFromPreference = (birthDate: DateTime | null, priorityDate: DateTime | null, approvalDate: DateTime | null, preference: Preference): CspaResults => {
    // TODO: we need to perform further input validation (e.g. a birthdate occuring after a priority date)
    if (!isValidDate(birthDate) || !isValidDate(priorityDate) || !isValidDate(approvalDate)) {
        return {
            daysPending: null,
            daysTotal: null,
            cspaAge: null,
            actualAge: null,
            errorMessage: "Invalid input dates",
            result: null,
        }
    }

    const bulletinDate = visaBulletinDates.get(preference)

    // @ts-ignore (typescript can't pick up the earlier null validation checks)
    return calcCspaAge(birthDate, priorityDate, approvalDate, bulletinDate)
}

export { visaBulletinDates, calcCspaAge, calcCspaAgeFromPreference }
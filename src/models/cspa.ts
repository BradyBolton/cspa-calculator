import { DateTime } from 'luxon';

export type Preference = "F1"
    | "F2A"
    | "F2B"
    | "F3"
    | "F4"

export interface Age {
    Days: number
    Months: number
    Years: number
}

export interface CspaResults {
    daysPending: number
    daysTotal: number
    cspaAge: Age
    actualAge: Age
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
    const pendingPeriod = approvalDate.diff(priorityDate, 'days')
    const totalPeriod = bulletinDate.diff(birthDate, 'days')
    const cspaAgeDiff = bulletinDate.minus(pendingPeriod).diff(birthDate, ['days', 'months', 'years'])
    const actualAgeDiff = bulletinDate.diff(birthDate, ['days', 'months', 'years'])

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
    }
}

const isValidDate = (date: DateTime | null): boolean => {
    return date != null && date.isValid
}

const calcCspaAgeFromPreference = (birthDate: DateTime | null, priorityDate: DateTime | null, approvalDate: DateTime | null, preference: Preference): CspaResults | undefined => {
    // TODO: we need to perform further input validation (e.g. a birthdate occuring after a priority date)
    if (!isValidDate(birthDate) || !isValidDate(priorityDate) || !isValidDate(approvalDate)) {
        return
    }

    const bulletinDate = visaBulletinDates.get(preference)
    if (bulletinDate) {
        // @ts-ignore (typescript can't pick up the earlier null validation check)
        return calcCspaAge(birthDate, priorityDate, approvalDate, bulletinDate)
    }
    return
}

export { visaBulletinDates, calcCspaAge, calcCspaAgeFromPreference }
import {
    calcCspaAge
} from './cspa';

import { DateTime } from "luxon";

const epsilon = 0.01

it('simple cspa age calculation', () => {
    const dob = DateTime.fromFormat('01-01-2004', 'MM-dd-yyyy')
    const pd = DateTime.fromFormat('01-01-2020', 'MM-dd-yyyy')
    const approval = DateTime.fromFormat('01-01-2023', 'MM-dd-yyyy')
    const bulletin = DateTime.fromFormat('03-15-2023', 'MM-dd-yyyy')

    const actual = calcCspaAge(dob, pd, approval, bulletin)
    const expected = {
        daysPending: 1096,
        daysTotal: 7013,
        cspaAge: {
            Days: 13,
            Months: 2,
            Years: 16
        },
        actualAge: {
            Days: 14,
            Months: 2,
            Years: 19
        },
    }

    expect(actual).toStrictEqual(expected)
});

it('simple cspa age calculation 2', () => {
    const dob = DateTime.fromFormat('01-01-2004', 'MM-dd-yyyy')
    const pd = DateTime.fromFormat('03-22-2020', 'MM-dd-yyyy')
    const approval = DateTime.fromFormat('01-01-2023', 'MM-dd-yyyy')
    const bulletin = DateTime.fromFormat('03-15-2023', 'MM-dd-yyyy')

    const actual = calcCspaAge(dob, pd, approval, bulletin)

    // I've cross-referenced 2 other age calculators (one of them explicitly states that
    // they account for leap years), both reporting an age of 19y, 2m, 14d on 3/15/2023.
    // Because daysPending matches w/ the calculator, and given that actual age matches
    // the online calculators, I will keep this calculation for now.
    const expected = {
        daysPending: 1015,
        daysTotal: 7013,
        // TODO: may need to investigate discrepency between calculator below:
        // https://www.immihelp.com/cspa-calculator/
        cspaAge: {
            Days: 2, // calculator result: 4
            Months: 5,
            Years: 16
        },
        actualAge: {
            Days: 14, // calculator result: 15
            Months: 2,
            Years: 19
        },
    }

    expect(actual).toStrictEqual(expected)
});
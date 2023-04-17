import {
    CspaCalculator,
    VisaBulletinRow
} from './cspa';

import { DateTime } from "luxon";

import Papa, { ParseResult } from 'papaparse';

const csvData = `preference,other,china,india,mexico,philippines
F1,12/01/2014,12/01/2014,12/01/2014,04/01/2001,03/01/2012
F2A,09/08/2020,09/08/2020,09/08/2020,11/01/2018,09/08/2020
F2B,09/22/2015,09/22/2015,09/22/2015,06/01/2001,10/22/2011
F3,11/22/2008,11/22/2008,11/22/2008,11/01/1997,06/08/2002
F4,03/22/2007,03/22/2007,09/15/2005,08/01/2000,08/22/2002`

const parseResult: ParseResult<VisaBulletinRow> = Papa.parse(csvData, {
    header: true,
    skipEmptyLines: true,
});

it('parse csv', () => {
    const calculator = new CspaCalculator(parseResult.data)
    expect(calculator.visaBulletinDates.get("F4")?.get("other")?.toLocaleString()).toEqual("3/22/2007")
});

it('simple cspa age calculation', () => {
    const dob = DateTime.fromFormat('01-01-2004', 'MM-dd-yyyy')
    const pd = DateTime.fromFormat('01-01-2020', 'MM-dd-yyyy')
    const approval = DateTime.fromFormat('01-01-2023', 'MM-dd-yyyy')
    const bulletin = DateTime.fromFormat('03-15-2023', 'MM-dd-yyyy')

    const calculator = new CspaCalculator(parseResult.data)
    const actual = calculator.calcCspaAge(dob, pd, approval, bulletin)
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
        errorMessage: null,
        result: {
            resultType: "available",
        },

    }

    // ignore the message when testing (it's just a JSX element rendered in the UI)
    if (actual['result']) {
        delete actual['result']['message'];
    }

    expect(actual).toStrictEqual(expected)
});

it('simple cspa age calculation 2', () => {
    const dob = DateTime.fromFormat('01-01-2004', 'MM-dd-yyyy')
    const pd = DateTime.fromFormat('03-22-2020', 'MM-dd-yyyy')
    const approval = DateTime.fromFormat('01-01-2023', 'MM-dd-yyyy')
    const bulletin = DateTime.fromFormat('03-15-2023', 'MM-dd-yyyy')

    const calculator = new CspaCalculator(parseResult.data)
    const actual = calculator.calcCspaAge(dob, pd, approval, bulletin)

    // I've cross-referenced 2 other age calculators (one of them explicitly states that
    // they account for leap years), both reporting an age of 19y, 2m, 14d on 3/15/2023.
    // Because daysPending matches w/ the calculator, and given that actual age matches
    // the online calculators, I will keep this calculation for now.

    // prettier-ignore
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
        errorMessage: null,
        result: {
            resultType: "available",
        }
    }

    // ignore the message when testing (it's just a JSX element rendered in the UI)
    if (actual['result']) {
        delete actual['result']['message'];
    }

    expect(actual).toStrictEqual(expected)
});
#!/usr/bin/env python3

'''
A very rough Python script that just pulls the latest Visa Bulletin and attempts to convert tables to CSVs
'''

from bs4 import BeautifulSoup
import datetime
import pandas
import re
import requests

months = {
    "JAN": "01",
    "FEB": "02",
    "MAR": "03",
    "APR": "04",
    "MAY": "05",
    "JUN": "06",
    "JUL": "07",
    "AUG": "08",
    "SEP": "09",
    "OCT": "10",
    "NOV": "11",
    "DEC": "12"
}

pattern = "^(\d\d)([A-Z]{3})(\d\d)$"

# get_date parses the raw_date from the visa bulletin into a date format that actually makes sense
# returns string if pattern matches, otherwise returns None (e.g. if a cell simply contains 'C')
def get_date(raw_date):
    match = re.search(pattern, raw_date)

    if match is not None:
        day = match.group(1)
        month = months[match.group(2)]
        year = match.group(3)
        return datetime.datetime.strptime(f"{month}/{day}/{year}", '%m/%d/%y').strftime('%m/%d/%Y')


def main():
    # get visa bulletin of current month as HTML
    today = datetime.date.today()
    current_month = today.strftime("%B").lower()
    current_year = today.strftime("%Y")
    url = f'https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin/{current_year}/visa-bulletin-for-{current_month}-{current_year}.html'
    r = requests.get(url)

    # verify page received
    soup = BeautifulSoup(r.text, 'html.parser')
    if 'Page Not Found' in soup.text:
        print("page not found")
        return

    tables = soup.find_all('table')
    k = 0
    for t in tables:
        data = []
        rows = t.tbody.find_all('tr')
        i = 0
        for r in rows:
            # if first column, examine headers
            if (i == 0):

                # check if table is for family sponsored cases, otherwise ignore it
                is_family_sponsored = False
                for d in r.find_all('td'):
                    if "Family" in d.get_text():
                        is_family_sponsored = True
                    break
                if not is_family_sponsored:
                    break
                i += 1
            else:
                # parse rows and add to data to be converted to a dataframe and exported as a CSV
                new_row = list()
                for d in r.find_all('td'):
                    new_value = d.get_text().strip().replace('\n', '')

                    # attempt to parse as date, otherwise keep as-is
                    as_date = get_date(new_value)
                    if as_date is not None:
                        new_value = as_date

                    new_row.append(new_value)
                data.append(new_row)
            i += 1

        # convert to CSV if we ended up processing a table
        if len(data) > 0:
            df = pandas.DataFrame(data, columns=['preference', 'other', 'china', 'india', 'mexico', 'philippines'])
            print(df.head())

            # determine if table A or B for family sponsorship cases
            csv_file_name =  './public/data/family_a.csv' if k == 0 else "./public/data/family_b.csv"
            print("Saving dataframe to CSV: {csv_file_name}")
            df.to_csv(csv_file_name, index=False)
            print("Done...")

            k += 1

if __name__ == '__main__':
    main()
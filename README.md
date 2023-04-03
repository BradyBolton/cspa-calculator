## cspa-calculator

> :point_right: **Go [here](https://bradybolton.github.io/cspa-calculator/) to play with the actual calculator**

## TODO

-   [ ] Update icons
-   [ ] Fill in calculator instructions
-   [ ] Setup a cron-job to scrape tables from visa bulletin at the end of every month when the bulletin updates
    -   Use [Github Actions](https://theanshuman.dev/articles/free-cron-jobs-with-github-actions-31d6)
    -   Update the script to return a value in the CLI (e.g. '0') so the pipeline can respond to a parsing failure
-   [ ] Figure out a way to setup email reminders?
    -   This would require network calls and hosting a DB ($$$)
    -   Find out how much this would cost if we want to offer this service (operate similar to course-pickle)

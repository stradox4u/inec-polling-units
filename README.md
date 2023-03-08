# INEC Full List of Polling Units

> I was able to use some simple Node JS scripts (all attached) to scrape the INEC public API to get the full list of polling units, arranged by state/lga/ward.

> For some reason, running a check, I have the correct 8809 wards/registration areas, but only 176,611 polling units, as against the advertised 176,846. I seem to be missing 235 polling units, and would be glad if anyone could help me find them.

## To rerun the process:
- Run ``` $ node index.js``` to get the states, lgas and wards. This will rewrite allWards.json.
- Run ``` $ node pus.js``` to get the polling units. This writes them all to ward by ward json files in the `pusByWard` folder.
- Run ``` $ node cleanup.js``` to clean up the data, writing it all to one single json file `cleanedData.json`.
- Run ``` $ node puCheck.js``` to check the count of the wards and polling units.

Feel free to fork and use as you will.

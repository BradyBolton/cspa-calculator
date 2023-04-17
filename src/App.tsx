import './App.css';

import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { DateTime } from "luxon";

import CustomizedAccordion from './CustomizedAccordion';
import { CspaCalculator, VisaBulletinRow, CspaResults, Preference, Country } from './models/cspa';

// TODO: not sure if I like this date picker (I really dislike how it handles backspaces)
// alternative date-picker that behaves more expetedly: https://reactdatepicker.com/ 
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';
import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';

const visaBulletinHref = "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html"

// TODO: support reading different from different tables
const bulletinDataUrl = "https://bradybolton.github.io/cspa-calculator/data/family_a.csv"

function App() {
  const [sponsorship, setSponsorship] = useState('family');
  const [preference, setPreference] = useState<Preference>('F1');
  const [country, setCountry] = useState<Country>('other');
  const [birthDate, setBirthDate] = useState<DateTime | null>(null);
  const [priorityDate, setPriorityDate] = useState<DateTime | null>(null);
  const [approvalDate, setApprovalDate] = useState<DateTime | null>(null);
  const [cspaResult, setCspaResult] = useState<CspaResults | null>(null);
  const [calculator, setCalculator] = useState<CspaCalculator>(new CspaCalculator([]));

  useEffect(() => {
    const csvData = Papa.parse<VisaBulletinRow>(bulletinDataUrl, {
      header: true,
      skipEmptyLines: true,
      download: true,
      complete: response => {
        setCalculator(new CspaCalculator(response.data))
      }
    });
  }, [])

  const handleChangePreference = (event: SelectChangeEvent) => {
    setPreference(event.target.value as Preference);
    setCspaResult(calculator.calcCspaAgeFromPreference(birthDate, priorityDate, approvalDate, event.target.value as Preference, country))
  };

  const handleChangeCountry = (event: SelectChangeEvent) => {
    setCountry(event.target.value as Country);
    setCspaResult(calculator.calcCspaAgeFromPreference(birthDate, priorityDate, approvalDate, preference, event.target.value as Country))
  };

  const handleChangeSponsorship = (event: SelectChangeEvent) => {
    setSponsorship(event.target.value);
  };

  const onClickResetHandler = () => {
    setBirthDate(null)
    setPriorityDate(null)
    setApprovalDate(null)
    setPreference("F1")
    setSponsorship("family")
    setCountry("other")
    setCspaResult(null)
  }

  const onClickSubmitHandler = () => {
    setCspaResult(calculator.calcCspaAgeFromPreference(birthDate, priorityDate, approvalDate, preference, country))
  }


  let resultAlert = <></>
  if (cspaResult != null) {
    resultAlert = cspaResult.errorMessage != null ?
      <Alert sx={{ mb: 2 }} variant="filled" severity="error">{cspaResult.errorMessage}</Alert> :
      <Alert sx={{ mb: 2 }} variant="outlined" severity="info">{cspaResult.result != null ? cspaResult.result.message : "Unable to calculate CSPA age"}
      </Alert>
  }

  return (
    <>
      <ScopedCssBaseline>
        <Container maxWidth="md">
          <Stack spacing={2} sx={{ m: 2 }}>
            <Paper sx={{ mt: 2, p: 3 }} elevation={2}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography sx={{ mb: 1 }} variant="h4">CSPA Calculator</Typography>
                <Typography sx={{ mb: 1 }} >
                  Fill in everything to calculate your CSPA age without having to go to the <a href={visaBulletinHref}>Visa Bulletin</a>!
                </Typography>
                <CustomizedAccordion label="How do I use this calculator?">
                  <div>
                    <Typography>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </Typography>
                    <br />
                    <Typography>
                      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </Typography>

                  </div>
                </CustomizedAccordion>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", pt: 2, alignItems: "center" }}>
                <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
                  <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <DatePicker
                      label="Date of Birth"
                      format="MM/dd/yyyy"
                      value={birthDate}
                      onChange={(newValue) => {
                        setBirthDate(newValue);
                      }}
                    />
                  </FormControl>

                  <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <DatePicker
                      label="Priority Date"
                      format="MM/dd/yyyy"
                      value={priorityDate}
                      onChange={(newValue) => {
                        setPriorityDate(newValue);
                      }}
                    />
                  </FormControl>

                  <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <DatePicker
                      label="Approval Date"
                      format="MM/dd/yyyy"
                      value={approvalDate}
                      onChange={(newValue) => {
                        setApprovalDate(newValue);
                      }}
                    />
                  </FormControl>
                </Box>

                <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-evenly", alignItems: "center" }}>
                  <Box>
                    <FormControl>
                      <FormLabel id="sponsorship-radio-buttons-group-label">Sponsorship Type</FormLabel>
                      <RadioGroup
                        name="radio-buttons-group"
                        row
                        value={sponsorship}
                        onChange={handleChangeSponsorship}
                      >
                        <FormControlLabel value="family" control={<Radio />} label="Family" />
                        {/* TODO: enable the employer option and support more sponsorships/preferences */}
                        <Tooltip title="Not supported yet!" followCursor={true} arrow>
                          <span>
                            <FormControlLabel value="employer" control={<Radio />} label="Employer" disabled />
                          </span>
                        </Tooltip>
                      </RadioGroup>
                    </FormControl>
                  </Box>

                  <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-evenly", alignItems: "center" }}>
                    <FormControl sx={{ mt: 2, mb: 2, minWidth: 80 }}>
                      <InputLabel id="demo-simple-select-autowidth-label">Preference</InputLabel>
                      <Select
                        labelId="preference-select-label"
                        id="preference-select"
                        value={preference}
                        onChange={handleChangePreference}
                        label="Preference"
                        size="small"
                      >
                        <MenuItem value={"F1"}>F1</MenuItem>
                        <MenuItem value={"F2A"}>F2A</MenuItem>
                        <MenuItem value={"F2B"}>F2B</MenuItem>
                        <MenuItem value={"F3"}>F3</MenuItem>
                        <MenuItem value={"F4"}>F4</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl sx={{ mt: 2, mb: 2, ml: 2, width: 110 }}>
                      <InputLabel id="demo-simple-select-autowidth-label">Country</InputLabel>
                      <Select
                        labelId="preference-select-label"
                        id="preference-select"
                        value={country}
                        onChange={handleChangeCountry}
                        label="Country"
                        size="small"
                      >
                        <MenuItem value={"china"}>China</MenuItem>
                        <MenuItem value={"india"}>India</MenuItem>
                        <MenuItem value={"mexico"}>Mexico</MenuItem>
                        <MenuItem value={"philippines"}>Philippines</MenuItem>
                        <MenuItem value={"other"}>Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-evenly", alignItems: "center" }} >
                  <Button variant="contained" sx={{ m: 1 }} color="primary" onClick={onClickSubmitHandler}>Calculate</Button>
                  <Button variant="contained" sx={{ m: 1 }} color="secondary" onClick={onClickResetHandler}>Reset Calculator</Button>
                </Box>
              </Box>
            </Paper>
            <Alert sx={{ mt: 2, mb: 2 }} severity="warning" variant="outlined" >Warning! This calculator is still a work in progress, so things will be incomplete, unsupported, or inaccurate.</Alert>
            {resultAlert}
            <Typography align="center" variant="caption">Made available using <a href="https://github.com/BradyBolton/cspa-calculator">Github Pages</a></Typography>
          </Stack>
        </Container>
      </ScopedCssBaseline>
    </ >
  );
}

export default App;
import './App.css';

import React, { useState } from 'react';

import { DateTime } from "luxon";

import CustomizedAccordion from './CustomizedAccordion';

// TODO: not sure if I like this date picker (I really dislike how it handles backspaces)
// alternative date-picker that behaves more expetedly: https://reactdatepicker.com/ 
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';
import {
  Radio,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Paper,
  Stack,
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  // RadioChangeEvent,
  Typography,
} from '@mui/material';

const visaBulletinHref = "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html"

function App() {
  const [sponsorship, setSponsorship] = useState('family');
  const [preference, setPreference] = useState('F1');
  const [birthDate, setBirthDate] = useState<DateTime | null>(null);
  const [priorityDate, setPriorityDate] = useState<DateTime | null>(null);
  const [approvalDate, setApprovalDate] = useState<DateTime | null>(null);

  const handleChange = (event: SelectChangeEvent) => {
    setPreference(event.target.value);
  };

  const handleChangeRadio = (event: SelectChangeEvent) => {
    setSponsorship(event.target.value);
  };

  const onClickHandler = () => {
    setBirthDate(null)
    setPriorityDate(null)
    setApprovalDate(null)
    setPreference("F1")
    setSponsorship("family")
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
                  Fill in all fields to calculate your CSPA situation. The calculator should automatically use data from the <a href={visaBulletinHref}>Visa Bulletin</a>.
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

                <Box sx={{ display: "flex", justifyContent: "space-evenly", alignItems: "center" }}>
                  <FormControl>
                    <FormLabel id="sponsorship-radio-buttons-group-label">Sponsorship Type</FormLabel>
                    <RadioGroup
                      name="radio-buttons-group"
                      row
                      value={sponsorship}
                      onChange={handleChangeRadio}
                    >
                      <FormControlLabel value="family" control={<Radio />} label="Family" />
                      <FormControlLabel value="employer" control={<Radio />} label="Employer" />
                    </RadioGroup>
                  </FormControl>

                  <FormControl sx={{ m: 2, minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-autowidth-label">Preference</InputLabel>
                    <Select
                      labelId="preference-select-label"
                      id="preference-select"
                      value={preference}
                      onChange={handleChange}
                      label="Preference"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={"F1"}>F1</MenuItem>
                      <MenuItem value={"F2A"}>F2A</MenuItem>
                      <MenuItem value={"F2B"}>F2B</MenuItem>
                      <MenuItem value={"F3"}>F3</MenuItem>
                      <MenuItem value={"F4"}>F4</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Button variant="contained" sx={{ m: 1 }} onClick={onClickHandler}>Reset Calculator</Button>
              </Box>
            </Paper>
          </Stack>
          <Alert sx={{ mb: 2 }} variant="filled" severity="success">Good news! You can get your visa on XX/XX/XXXX!</Alert>
        </Container>
      </ScopedCssBaseline>
    </ >
  );
}

export default App;
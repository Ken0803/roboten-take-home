import * as React from 'react';
import { Button, Grid, Typography, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, Paper, capitalize, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { styled } from '@mui/material/styles';
import { Add } from "@mui/icons-material";
import { Container } from "@mui/system";
import AddModal from './components/AddModal';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initData = [
  {
    title: 'Invoice 1',
    sendTo: 'kenkami1995@gmail.com',
    date: new Date().toLocaleString(),
    status: 'pending',
    items: [
      {
        description: 'asdf',
        qty: 5,
        rate: 30
      }
    ],
    note: 'asdfasdfasdf'
  },
  {
    title: 'Invoice 2',
    sendTo: 'kenkami1995@gmail.com',
    date: new Date().toLocaleString(),
    status: 'outstanding',
    items: [
      {
        description: 'asdf',
        qty: 5,
        rate: 30
      }
    ],
    note: 'asdfasdfasdf'
  },
  {
    title: 'Invoice 3',
    sendTo: 'kenkami1995@gmail.com',
    date: new Date().toLocaleString(),
    status: 'late',
    items: [
      {
        description: 'asdf',
        qty: 5,
        rate: 30
      }
    ],
    note: 'asdfasdfasdf'
  }
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontSize: 20,
    fontWeight: 700
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.selected,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
const STORAGE_KEY = "roboten-invoice-storage";

function App() {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [invoices, setInvoices] = React.useState(initData);
  const [includeStatus, setIncludeStatus] = React.useState(['pending', 'outstanding', 'late']);

  React.useEffect(() => {
    const sList = localStorage.getItem(STORAGE_KEY);
    if (sList) {
      setInvoices(JSON.parse(sList));
    }
  }, []);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const calculateAmount = (invoice) => {
    let sum = 0;
    for (let i = 0; i < invoice.items.length; i++) {
      sum += invoice.items[i].qty * invoice.items[i].rate;
    }
    return sum;
  }

  const saveModal = (nData) => {
    const nList = [...invoices, nData];
    setInvoices([...nList]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nList));
    closeModal();
  }

  const handleChange = (e, status) => {
    let temp = includeStatus;
    if (!temp.includes(status)) {
      temp.push(status);
    } else {
      const st_Id = temp.indexOf(status);
      temp = temp.filter((item, ind) => ind != st_Id);
    }
    setIncludeStatus([...temp]);
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Grid container direction="row" alignItems="center" gap={2}>
        <Typography variant="h5" flexGrow={1}>
          Invoices
        </Typography>
        <Button variant="outlined" onClick={() => openModal()}>
          <Add />
        </Button>
      </Grid>

      <Grid container sx={{ mt: 3 }} direction="row" justifyContent="center">
        <FormGroup row>
          <FormControlLabel control={<Checkbox defaultChecked onChange={(e) => handleChange(e, 'pending')} />} label="Pending" />
          <FormControlLabel control={<Checkbox defaultChecked onChange={(e) => handleChange(e, 'outstanding')} />} label="Outstanding" />
          <FormControlLabel control={<Checkbox defaultChecked onChange={(e) => handleChange(e, 'late')} />} label="Late" />
        </FormGroup>
      </Grid>

      <TableContainer component={Paper} sx={{ mt: 5 }}>
        <Table sx={{ minWidth: 650 }} aria-label="customized table" >
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Title</StyledTableCell>
              <StyledTableCell align="center">Send To</StyledTableCell>
              <StyledTableCell align="center">Date</StyledTableCell>
              <StyledTableCell align="center">Status</StyledTableCell>
              <StyledTableCell align="center">Amount</StyledTableCell>
              <StyledTableCell align="center">Note</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              invoices.map((invoice, index) => {
                return (includeStatus.includes(invoice.status) ?
                  <StyledTableRow key={invoice.title + index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <StyledTableCell component="th" scope="row">{invoice.title}</StyledTableCell>
                    <StyledTableCell align="center">{invoice.sendTo}</StyledTableCell>
                    <StyledTableCell align="center">{new Date(invoice.date).toDateString()}</StyledTableCell>
                    <StyledTableCell align="center">
                      {capitalize(invoice.status)}
                    </StyledTableCell>
                    <StyledTableCell align="center">{calculateAmount(invoice)}$</StyledTableCell>
                    <StyledTableCell align="center">{invoice.note}</StyledTableCell>
                  </StyledTableRow> : null
                )
              })
            }
          </TableBody>
        </Table>
      </TableContainer>

      <AddModal
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        saveModal={saveModal}
      />

      <ToastContainer />
    </Container>
  );
}

export default App;

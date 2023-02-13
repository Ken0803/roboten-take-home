import { useState, useCallback, useEffect } from "react";
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import { Add, Delete, Send } from "@mui/icons-material";
import { toast } from 'react-toastify';

const initInvoiceItem = {
  description: "",
  qty: '',
  rate: '',
};

export default function AddModal({ modalIsOpen, closeModal, saveModal }) {
  const [title, setTitle] = useState('');
  const [sendTo, setSendTo] = useState('');
  const [note, setNote] = useState('');
  const [items, setItems] = useState([initInvoiceItem]);

  const initModal = () => {
    setTitle('');
    setSendTo('');
    setNote('');
    setItems([initInvoiceItem]);
  }

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  }

  const sendInvoice = () => {
    if (!sendTo || !validateEmail(sendTo)) {
      toast.error('Please enter valid email address');
      return;
    }

    for (let i = 0; i < items.length; i++) {
      if (items[i].description.length === 0 || !items[i].qty || !items[i].rate) {
        toast.error('Please enter valid item...');
        return;
      }
    }

    if (!title || items.length === 0) {
      toast.error('Please enter all info of review...');
      return;
    }

    try {
      saveModal({
        title,
        sendTo,
        note,
        items,
        status: 'pending',
        date: new Date().toLocaleString()
      });
      toast.success('Sent invoice!');
    } catch (error) {
      console.log(error);
      toast.error(error ?? 'Something went wrong...');
    }

    initModal();
  }

  const addItem = () => {
    if (items[items.length - 1].description.length === 0 || !items[items.length - 1].qty || !items[items.length - 1].rate) {
      toast.error('Please enter valid item...');
      return;
    }
    setItems([...items, initInvoiceItem]);
  }

  const setItem = (index, nObj) => {
    items[index] = { ...items[index], ...nObj };
    setItems([...items]);
  }

  const delItem = (index) => {
    items.splice(index, 1);
    setItems([...items]);
  }

  const calcAmount = () => {
    let sum = 0;
    items.map((item) => sum += item.qty * item.rate);
    return sum;
  }

  return (
    <Dialog open={modalIsOpen} onClose={closeModal} fullWidth>
      <DialogTitle variant="h5" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        Create Invoice
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          required
          id="title"
          label="Title"
          fullWidth
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />
        <TextField
          margin="dense"
          required
          id="email"
          label="Send to"
          fullWidth
          value={sendTo}
          onChange={(e) =>
            setSendTo(e.target.value)
          }
        />
        <Grid my={2}>
          <Typography>
            Items
          </Typography>
          {items.map((item, index) => {
            return (
              <Grid display="flex" alignItems="center" gap={2} key={index}>
                <TextField
                  margin="dense"
                  required
                  label="Description"
                  value={item.description}
                  onChange={(e) => setItem(index, { description: e.target.value })}
                />
                <TextField
                  margin="dense"
                  required
                  label="Quantity"
                  type="number"
                  value={item.qty}
                  onChange={(e) => setItem(index, { qty: e.target.value })}
                />
                <TextField
                  margin="dense"
                  required
                  label="Rate ($)"
                  type="number"
                  value={item.rate}
                  onChange={(e) => setItem(index, { rate: e.target.value })}
                />
                <TextField
                  margin="dense"
                  required
                  InputProps={{
                    readOnly: true,
                  }}
                  label="Amount ($)"
                  type="number"
                  value={item.rate * item.qty}
                />
                <Button color="error" sx={{ px: 0.5, minWidth: 0 }} onClick={() => delItem(index)}>
                  <Delete />
                </Button>
              </Grid>
            );
          })}
          <Button fullWidth sx={{ mt: 0.5 }} startIcon={<Add />} variant="outlined" onClick={addItem}>
            Add Item
          </Button>
          <Typography textAlign="end" variant="h6" mt={1}>
            Amount Due: {calcAmount()} $
          </Typography>
        </Grid>
        <TextField
          margin="dense"
          multiline
          rows={3}
          id="note"
          label="Note"
          fullWidth
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <DialogActions sx={{ mt: 1 }}>
          <Button variant="outlined" onClick={closeModal} startIcon={<Delete />}>
            Cancel
          </Button>
          <Button variant="contained" onClick={sendInvoice} endIcon={<Send />}>
            Send
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

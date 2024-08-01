'use client'

import Image from "next/image";
import { useState, useEffect } from "react"; // state variables and client sided functions from react
import { firestore } from "../firebase"; // firestore is the database 
import { Stack, Box, Button, Container, Grid, Modal, Typography, TextField } from "@mui/material"; // component library
import { deleteDoc, doc, getDocs, getDoc, query, collection, setDoc } from "firebase/firestore";

/*
  This page.js file is the main component for this project.

  Since we are using a component library, we can delete all the css
*/


export default function Home() {
  // use a state variable to store inventory
  const [inventory, setInventory] = useState([])
  //set state variable for the portal to add and remove
  const [open, setOpen] = useState(false) // false is a default
  const [itemName, setItemName] = useState('') // empt string is default

  /* 
      Function for updating from firebase 

      we make it async so that it won't block the code while fetching
      if the code is blocked while fetching then website freezes while fetching
  */
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory')); // get snapshot, which is inventory
    const docs = await getDocs(snapshot) // get the documents from the snapshot
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }
  const addItem = async (item) => {
    //adds 1 item to firestore db
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    }
    else {
      await setDoc(docRef, { quantity: 1 })
    }

    await updateInventory()
  }

  const removeItem = async (item) => {
    // remove item from firestore
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity == 1) {
        await deleteDoc(docRef)
      }
      else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }

    await updateInventory()
  }

  // runs updateInventory when something in dependency array changes.
  // bc dependency array is empty, it only runs once when the page loads
  useEffect(() => {
    updateInventory()
  }, [])

  // modal helper functions 

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box
      width="100vw" height="100vh" display="flex" justifyContent="center"
      alignItems="center" gap={2}
      flexDirection="column">
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          sx={{ transform: 'translate(-50%, -50%)' }}
          gap={3}>
          <Typography variant='h6'>Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant='outlined'
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
              }}></TextField>
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose() // closes db
              }}>Add</Button>
          </Stack>
        </Box>
      </Modal>
      <Button
        variant="contained"
        onClick={() => {
          handleOpen()
        }}
      >
        Add New Item
      </Button>
      <Box border='1px solid #333'>
        <Box width="800px" height="100px" bgcolor="#ADD8E6" display="flex" alignItems="center" justifyContent="center">
          <Typography variant="h2" color="#333">
            Inventory Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow="auto">
          {inventory.map(({ name, quantity }) => (
            <Box key={name} width="100%"
              minHeight="150px" display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgColor="#f0f0f0"
              padding={5}
            >
              <Typography variant="h3"
                color='#333'
                textAlign="center">{name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
              <Typography variant="h3"
                color='#333'
                textAlign="center">
                {quantity}
              </Typography>
              <Stack
                direction="row"
                spacing={2}>
                <Button variant="contained"
                  onClick={() => {
                    addItem(name)
                  }}>
                  Add
                </Button>
                <Button variant="contained"
                  onClick={() => {
                    removeItem(name)
                  }}>
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box >
  )
}

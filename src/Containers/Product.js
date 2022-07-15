import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Formik } from 'formik';
import { useFormik, Form } from 'formik';
import * as yup from 'yup';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function Product(props) {
    const [open, setOpen] = React.useState(false);
    const [data, setData] = useState([]);
    const [Dopen, setDOpen] = React.useState(false);
    const [did, setDid] = useState([0]);
    const [update, setUpdate] = useState(false);
    const [filterData, setFilterData] = useState([]);
    const handleDClickOpen = () => {
        setDOpen(true);
    };
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setDOpen(false);
        setUpdate(false)
        formikObj.resetForm()
    };
    const handleInsert = (values) => {
        let LocalData = JSON.parse(localStorage.getItem("Product"))

        let id = Math.floor(Math.random() * 1000);
        let data = {
            id: id,
            ...values
        }

        if (LocalData === null) {
            localStorage.setItem("Product", JSON.stringify([data]))
        } else {
            LocalData.push(data)
            localStorage.setItem("Product", JSON.stringify(LocalData))

        }

        console.log(values, LocalData);

        formikObj.resetForm()
        handleClose()
        LoadData();
    }
    const handleUpdate = (values) => {
        let LocalData = JSON.parse(localStorage.getItem("Product"));

        let udata = LocalData.map((l) => {
            if (l.id === values.id) {
                return values
            } else {
                return l
            }
        })



        localStorage.setItem("Product", JSON.stringify(udata))
        console.log(values);
        handleClose();
        LoadData();
        formikObj.resetForm()
        setUpdate(false)

    }

    let schema = yup.object().shape({
        name: yup.string().required("Please Enter Name"),
        Price: yup.number().required("Please enter price"),
        Expiry: yup.number().required("Please enter Expiry Date"),

    });

    const formikObj = useFormik({
        initialValues: {
            name: '',
            Price: '',
            Expiry: '',
        },
        validationSchema: schema,
        onSubmit: values => {
            if (update) {
                handleUpdate(values)
            } else {
                handleInsert(values)

            }
        },

    });
    const handleDelete = (params) => {
        let LocalData = JSON.parse(localStorage.getItem("Product"));
        let fData = LocalData.filter((l) => l.id !== did)
        localStorage.setItem("Product", JSON.stringify(fData))
        LoadData();
        console.log(params.id, fData);
        handleClose()
    }

    const { handleBlur, handleChange, handleSubmit, errors, touched, values } = formikObj

    const handleEdit = (params) => {

        setUpdate(true);

        handleClickOpen();

        formikObj.setValues(params.row)
    }
    const columns = [
        { field: 'name', headerName: 'Name', width: 70 },
        { field: 'Price', headerName: 'Price', width: 70 },
        { field: 'Quntity', headerName: 'Quntity', width: 70 },
        { field: 'expiry', headerName: 'Expiry', width: 70 },
        {
            field: 'action',
            headerName: 'Action',
            width: 170,
            renderCell: (params) => (
                <>
                    <IconButton aria-label="Edit" onClick={() => { handleEdit(params) }}>
                        <EditIcon />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={() => { handleDClickOpen(); setDid(params.id) }}>
                        <DeleteIcon />
                    </IconButton>
                </>
            )
        },

    ];
    const LoadData = () => {
        let LocalData = JSON.parse(localStorage.getItem("Product"))
        console.log(LocalData);
        
        if (LocalData !== null) {
            setData(LocalData)
        }

    }

    useEffect(() => {
        LoadData();
    }, [])

    const handleSearch = (val) => {
        let LocalData = JSON.parse(localStorage.getItem("Product"))

        // console.log(val, LocalData);    

        let SData = LocalData.filter((s) => (
            s.name.toLowerCase().includes(val.toLowerCase()) ||
            s.Price.toString().includes(val) ||
            s.expiry.toString().includes(val)


        ));
        setFilterData(SData)



    }
    const fData = filterData.length > 0 ? filterData : data;


    return (
        <div>
            <h1>Product</h1>
            <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={handleClickOpen}>Products</Button>
            </Stack>
            <TextField
                margin="dense"
                name="search"
                label="Medicine Search"
                type="text"
                fullWidth
                variant="standard"
                onChange={(e) => handleSearch(e.target.value)}
            />
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={fData}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                />
            </div>
            <Dialog
                open={Dopen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Are You Sure Delete?"}
                </DialogTitle>
                <DialogContent>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>No</Button>
                    <Button onClick={handleDelete} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>


            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Subscribe</DialogTitle>
                <Formik values={formikObj}>
                    <Form onSubmit={handleSubmit}>
                        <DialogContent>
                            <TextField
                                value={values.name}
                                margin="dense"
                                id="name"
                                label="Product Name"
                                type="text"
                                fullWidth
                                variant="standard"
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            {errors.name && touched.name ? <p>{errors.name}</p> : ""}
                            <TextField
                                value={values.Price}
                                margin="dense"
                                id="Price"
                                label="Product Price"
                                type="number"
                                fullWidth
                                variant="standard"
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            {errors.Price && touched.Price ? <p>{errors.Price}</p> : ""}
                            <TextField
                                value={values.Expiry}
                                margin="dense"
                                id="Expiry"
                                label="Expiry Date"
                                type="number"
                                fullWidth
                                variant="standard"
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            {errors.Expiry && touched.Expiry ? <p>{errors.Expiry}</p> : ""}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            {
                                update ?
                                    <Button onClick={handleClose}>Update</Button>
                                    :
                                    <Button onClick={handleClose}>submit</Button>

                            }
                        </DialogActions>
                    </Form>
                </Formik>
            </Dialog>
        </div>
    );
}

export default Product;
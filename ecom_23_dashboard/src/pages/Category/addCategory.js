import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useParams, useLocation } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { toast } from 'react-toastify';
import ReactLoading from 'react-loading';
// @mui
import { styled } from '@mui/material/styles';
import {
  Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Snackbar,
  Alert,
  Container,
  Typography,
  Card,
  CardActions,
  Button,
  FormControl,
  CardContent,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';

import { postReq, getReq, patchReq, deleteRequest } from '../../data/ApiReq';

// components
import Page from '../../components/Page';

import Iconify from '../../components/Iconify';
import ApiUrl from '../../data/ApiUrl';

const queryString = require('query-string');

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function AddCategory() {
  const initialState = {
    categoryName: '',
    description: '',
    isSubCategory: 'no',
    parentId: '',
    image: '',
    type: 'new',
    parentName: '',
    parent: '',
  };
  const initialResult = {
    error: false,
    message: '',
    alert: false,
    loading: false,
    imgStatus: 'notSelected',
    dataFetched: false,
    redirect: false,
  };
  const params = useParams();
  const location = useLocation();

  const [categoryData, setCategory] = useState([]);
  const [state, setState] = useState(initialState);
  const [apiResult, setApiResult] = useState(initialResult);

  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const getData = async () => {
    if (params.id) {
      const response = await getReq(`category/single?id=${params.id}`);

      console.log('Single .........', response.data);
      setState({
        ...state,
        type: 'edit',
        categoryName: response.data.categoryName,
        description: response.data.description,
        isSubCategory: response.data.isSubCategory ? 'yes' : 'no',
        parentId: response.data.parentId,
        imageRecived: response.data.image,
        parentName: response.data.parentName,
        imageUrl: response.data.image ? response.data.image.mdUrl : '',
        parent: `${response.data.parentId}|${response.data.parentName}`,
      });
      setApiResult({
        ...apiResult,
        loading: false,
      });
    }
    const response = await getReq('category/getall');
    console.log(response.data);
    if (!response.error) {
      setCategory(response.data);
      setApiResult({
        ...apiResult,
        dataFetched: true,
      });
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const [imgAddress, setImgAddress] = useState(
    'https://www.brightsidedental.co.uk/blog/wp-content/uploads/2020/08/Face-mask-1024x683.jpeg'
  );

  const imageUpload = async (e) => {
    try {
      let file;
      if (e.target.files) file = e.target.files[0]; // state.imagePath;
      if (!file) file = state.imagePath;
      console.log('file', file);
      if (!file) return;
      setApiResult({ ...apiResult, imgStatus: 'uploading' });

      const data = new FormData();
      data.append('image', file);
      data.append('type', 'brands');
      const response = await postReq({
        url: 'image/upload',
        data,
      });

      if (!response.error) {
        const logo = response.data._id;
        const imageData = response.data;

        setState({
          ...state,
          logo,
          imgUrl: imageData.mdUrl,
        });
        setApiResult({ ...apiResult, imgStatus: 'uploaded' });
      } else {
        setApiResult({ ...apiResult, imgStatus: 'error' });
      }
    } catch (error) {
      console.log(error);
      setApiResult({ ...apiResult, imgStatus: 'error' });
    }
  };

  // let CatList =    [];
  const CatList = categoryData;

  const createCategory = async (e) => {
    setApiResult({ ...apiResult, loading: true });
    e.preventDefault();
    const data = {
      categoryName: state.categoryName,
    };
    if (state.image) data.image = state.image;
    if (state.description) data.description = state.description;
    if (state.categorySection) data.categorySection = state.categorySection;
    if (state.isSubCategory === 'yes') data.isSubCategory = true;
    if (state.parent) {
      const parent = state.parent.split('|');
      data.parentId = parent[0];
      data.parentName = parent[1];
    }
    const response = await postReq({
      url: 'category/create',
      data,
    });

    if (!response.error) {
      setState(initialState);

      setApiResult({
        ...apiResult,
        error: false,
        message: response.data.message,
        alert: true,
        loading: false,
        imgStatus: 'notSelected',
      });
    } else {
      setApiResult({
        ...apiResult,
        error: true,
        message: response.data.message,
        alert: true,
        loading: false,
      });
    }
    setTimeout(() => {
      setApiResult({ ...apiResult, alert: false });
      window.location.reload();
    }, 1000);
  };

  const updateCategory = async (e) => {
    setApiResult({ ...apiResult, loading: true });
    e.preventDefault();
    const data = { id: params.id };
    if (state.categoryName) data.categoryName = state.categoryName;
    if (state.image) data.image = state.image;
    if (state.description) data.description = state.description;
    if (state.categorySection) data.categorySection = state.categorySection;

    if (state.isSubCategory === 'yes') {
      data.isSubCategory = true;
      if (state.parent) {
        const parent = state.parent.split('|');
        data.parentId = parent[0];
        data.parentName = parent[1];
      }
    } else {
      data.isSubCategory = 'false';
    }

    const response = await patchReq({
      url: 'category/update',
      data,
    });

    console.log(response.data);
    if (!response.error) {
      setApiResult({
        ...apiResult,
        error: false,
        message: response.data.message,
        alert: true,
        loading: false,
        imgStatus: 'notSelected',
      });
    } else {
      setApiResult({
        ...apiResult,
        error: true,
        message: response.data.message,
        alert: true,
        loading: false,
      });
    }
    setTimeout(() => {
      setApiResult({ ...apiResult, alert: false });
      setState(initialState);
      getData();
    }, 3000);
  };

  const deleteCategory = async (e) => {
    setApiResult({ ...apiResult, loading: true });
    e.preventDefault();

    const response = await deleteRequest(`category/delete?id=${params.id}`);

    if (!response.error) {
      setApiResult({ redirect: true });
    } else {
      setApiResult({
        ...apiResult,
        error: true,
        message: response.data.message,
        alert: true,
        loading: false,
      });
    }
    setTimeout(() => {
      setApiResult({ ...apiResult, alert: false });
    }, 3000);
  };

  return (
    <Page title="Add  Brand">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography
            variant="h4"
            gutterBottom
            sm="4"
            title={params.id ? 'Edit Category' : 'Add Category'}
            subtitle=" "
            className="text-sm-left"
          >
            {params.id ? 'Edit Category' : 'Add Category'}
          </Typography>
          <Button color="primary" variant="contained" component={RouterLink} to="/dashboard/category">
            Category List
          </Button>
        </Stack>
        <Grid container spacing={0} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={7}>
            <Card>
              <CardContent>
                <div>
                  <FormikProvider>
                    {/* <Form autoComplete="off" noValidate > */}
                    <Stack spacing={3}>
                      <Typography variant="h5" gutterBottom>
                        Basic Details
                      </Typography>

                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Stack spacing={2}>
                          <div
                            className="img-upload-pre"
                            style={{
                              backgroundImage: `url(${imgAddress})`,
                            }}
                          />

                          <input
                            type="file"
                            className="custom-file-input"
                            onChange={(e) => setImgAddress(e.target.value)}
                          />
                        </Stack>
                        <Stack spacing={2} style={{ width: '80%' }}>
                          <TextField
                            fullWidth
                            type={'text'}
                            label="Name"
                            placeholder="Name"
                            name="categoryName"
                            defaultValue={state.categoryName}
                            value={state.categoryName}
                            onChange={handleChange}
                          />

                          <TextField
                            fullWidth
                            type={'text'}
                            label="Description"
                            name="description"
                            value={state.description}
                            onChange={handleChange}
                          />
                        </Stack>
                      </Stack>

                      {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <div className="d-flex order-select">
                          <div>
                            <FormControl style={{ width: 305 }}>
                              <InputLabel id="demo-simple-select-label"> Category Section</InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label=" Category Section"
                                name="categorySection"
                                onChange={handleChange}
                              >
                                <MenuItem value={''}> </MenuItem>
                                <MenuItem value={'featured'}>Featured Category</MenuItem>
                                <MenuItem value={'gp1'}>Group 1 Category</MenuItem>
                                <MenuItem value={'gp2'}>Group 2 Category</MenuItem>
                              </Select>
                            </FormControl>
                          </div>
                        </div>

                        <div className="d-flex order-select">
                          <div>
                            <FormControl style={{ width: 305 }}>
                              <InputLabel id="demo-simple-select-label"> Type </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label=" Type"
                                name="isSubCategory"
                                onChange={handleChange}
                              >
                                {state.type === 'edit' && state.isSubCategory === 'yes' ? (
                                  <MenuItem value="yes">Sub Category</MenuItem>
                                ) : (
                                  ''
                                )}
                                <MenuItem value={'no'}>Main Category</MenuItem>
                                <MenuItem value={'yes'}>Sub Category</MenuItem>
                              </Select>
                            </FormControl>

                            {state.isSubCategory === 'yes' ? (
                              <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label"> Parent Category</InputLabel>
                                <Select
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  label=" Parent Category"
                                  name="parent"
                                  onChange={handleChange}
                                >
                                  {state.type === 'edit' ? (
                                    <MenuItem value={state.parent}>{state.parentName}</MenuItem>
                                  ) : (
                                    ''
                                  )}
                                  {CatList.map((item, index) => (
                                    <MenuItem key={index} value={`${item._id}|${item.categoryName}`}>
                                      {' '}
                                      {item.categoryName}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            ) : (
                              ''
                            )}
                          </div>
                        </div>
                      </Stack> */}
                    </Stack>
                    {state.type === 'new' ? (
                      <Button className=" brand-buttons" variant="contained" color="primary" onClick={createCategory}>
                        Submit
                      </Button>
                    ) : (
                      <>
                        <Button onClick={deleteCategory} color="error" className="brand-buttons" variant="contained">
                          Delete
                        </Button>
                        <Button
                          onClick={updateCategory}
                          color="warning"
                          className="mr-4 brand-buttons"
                          variant="contained"
                        >
                          Update
                        </Button>
                      </>
                    )}
                    {/* </Form> */}
                  </FormikProvider>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

import React, { useState, useEffect } from 'react';
import {
  Stepper, Step, StepLabel, Button, TextField, Typography, MenuItem, Select, InputLabel, FormControl, Container, Box
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/ClientStepperPage.css';

const steps = ['Personal Information', 'Select a Package', 'Store Type Selection'];

const ClientStepper = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    gender: '',
    national_id: '',
    package: '',
    store_type: '',
    id_image: '',
    bank_account_info: ''
  });
  const [errors, setErrors] = useState({});
  const [validationPending, setValidationPending] = useState(false); // Track validation status
  const navigate = useNavigate();

  const checkField = async (field, value) => {
    try {
      const response = await axios.post('http://localhost:8000/api/check-field', { field, value });
      return response.data.taken;
    } catch (error) {
      console.error('Error checking field:', error);
      return false;
    }
  };

  const validateStep = async () => {
    setValidationPending(true); // Set pending state before validation
    let stepErrors = {};

    switch (activeStep) {
      case 0: // Personal Information
        if (!formData.name) stepErrors.name = ['Name is required'];
        if (!formData.email) {
          stepErrors.email = ['Email is required'];
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          stepErrors.email = ['Email is invalid'];
        } else if (await checkField('email', formData.email)) {
          stepErrors.email = ['Email has already been taken'];
        }
        if (!formData.phone_number) {
          stepErrors.phone_number = ['Phone number is required'];
        } else if (!/^(\+966)5[0-9]{8}$/.test(formData.phone_number)) {
          stepErrors.phone_number = ['Phone number is invalid'];
        } else if (await checkField('phone_number', formData.phone_number)) {
          stepErrors.phone_number = ['Phone number has already been taken'];
        }
        if (!formData.gender) stepErrors.gender = ['Gender is required'];
        if (!formData.national_id) {
          stepErrors.national_id = ['National ID is required'];
        } else if (!/^\d{10}$/.test(formData.national_id)) {
          stepErrors.national_id = ['National ID is invalid'];
        } else if (await checkField('national_id', formData.national_id)) {
          stepErrors.national_id = ['National ID has already been taken'];
        }
        break;
      case 1: // Package Selection
        if (!formData.package) stepErrors.package = ['Package is required'];
        break;
      case 2: // Store Type Selection
        if (!formData.store_type) stepErrors.store_type = ['Store type is required'];
        if (!formData.id_image) stepErrors.id_image = ['ID image is required'];
        if (!formData.bank_account_info) stepErrors.bank_account_info = ['Bank account information is required'];
        break;
      default:
        break;
    }

    setErrors(stepErrors);
    setValidationPending(false); // Clear pending state after validation
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = async () => {
    // Validate the current step
    const isValid = await validateStep();
    
    // If validation fails, do not proceed to the next step
    if (!isValid) {
      return;
    }

    // If it's the last step, submit the form
    if (activeStep === steps.length - 1) {
      await submitForm();
    } else {
      // Otherwise, go to the next step
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      id_image: e.target.files[0]
    });
  };

  const handlePackageSelection = (packageType) => {
    setFormData({
      ...formData,
      package: packageType
    });
  };

  const submitForm = async () => {
    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataObj.append(key, formData[key]);
    });
  
    try {
      const response = await axios.post('http://localhost:8000/api/clients', formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Success:', response.data);
      navigate('/success');
    } catch (error) {
      if (error.response && error.response.status === 422) {
        // Validation errors from the backend
        const errors = error.response.data.errors;
        console.error('Validation Errors:', errors);
        setErrors(errors);
      } else {
        // Other errors
        console.error('Error:', error.message);
        alert('An unexpected error occurred. Please try again later.');
      }
    }
  };

  useEffect(() => {
    if (validationPending) {
      validateStep();
    }
  }, [activeStep]);

  return (
    <Container>
      <Box sx={{ width: '100%', marginTop: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div>
          {activeStep === 0 && (
            <PersonalInformationForm formData={formData} handleChange={handleChange} errors={errors} />
          )}
          {activeStep === 1 && (
            <PackageSelectionForm 
              formData={formData} 
              handlePackageSelection={handlePackageSelection}
              errors={errors}
            />
          )}
          {activeStep === 2 && (
            <StoreTypeForm
              formData={formData}
              handleChange={handleChange}
              handleFileChange={handleFileChange}
              errors={errors}
            />
          )}
        </div>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          <Button 
            variant="contained" 
            onClick={handleNext}
            disabled={validationPending} // Disable button during validation
          >
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

const PersonalInformationForm = ({ formData, handleChange, errors }) => (
  <Box sx={{ marginTop: 3 }}>
    <TextField
      name="name"
      label="* Name"
      value={formData.name}
      onChange={handleChange}
      fullWidth
      margin="normal"
      error={!!errors.name}
      helperText={errors.name ? errors.name[0] : ''}
    />
    <TextField
      name="email"
      label="* Email"
      value={formData.email}
      onChange={handleChange}
      fullWidth
      margin="normal"
      error={!!errors.email}
      helperText={errors.email ? errors.email[0] : ''}
    />
    <TextField
      name="phone_number"
      label="* Phone Number (+966xxxxxxxxx)"
      value={formData.phone_number}
      onChange={handleChange}
      fullWidth
      margin="normal"
      error={!!errors.phone_number}
      helperText={errors.phone_number ? errors.phone_number[0] : ''}
    />
    <FormControl fullWidth margin="normal">
      <InputLabel>* Gender</InputLabel>
      <Select name="gender" value={formData.gender} onChange={handleChange} error={!!errors.gender}>
        <MenuItem value="male">Male</MenuItem>
        <MenuItem value="female">Female</MenuItem>
      </Select>
      {errors.gender && <Typography color="error">{errors.gender[0]}</Typography>}
    </FormControl>
    <TextField
      name="national_id"
      label="* National ID"
      value={formData.national_id}
      onChange={handleChange}
      fullWidth
      margin="normal"
      error={!!errors.national_id}
      helperText={errors.national_id ? errors.national_id[0] : ''}
    />
  </Box>
);

const PackageSelectionForm = ({ formData, handlePackageSelection, errors }) => {
  const getPackageClass = (packageType) => {
    return formData.package === packageType ? 'ptable-item selected' : 'ptable-item';
  };

  return (
    <Box sx={{ marginTop: 3 }}>
      <div className="pricing-table">
        {/* Silver Package */}
        <div className={getPackageClass('silver')}>
          <div className="ptable-single">
            <div className="ptable-header-1">
              <div className="ptable-title">
                <h2>Silver</h2>
              </div>
              <div className="ptable-price">
                <h2><small>$</small>99<span>/ M</span></h2>
              </div>
            </div>
            <div className="ptable-body">
              <div className="ptable-description">
                <ul>
                  <li>Pure HTML & CSS</li>
                  <li>Responsive Design</li>
                  <li>Well-commented Code</li>
                  <li>Easy to Use</li>
                </ul>
              </div>
            </div>
            <div className="ptable-footer">
              <div className="ptable-action">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handlePackageSelection('silver')}
                >
                  Select
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Gold Package */}
        <div className={getPackageClass('gold')}>
          <div className="ptable-single">
            <div className="ptable-header-2">
              <div className="ptable-title">
                <h2>Gold</h2>
              </div>
              <div className="ptable-price">
                <h2><small>$</small>199<span>/ M</span></h2>
              </div>
            </div>
            <div className="ptable-body">
              <div className="ptable-description">
                <ul>
                  <li>Pure HTML & CSS</li>
                  <li>Responsive Design</li>
                  <li>Well-commented Code</li>
                  <li>Easy to Use</li>
                </ul>
              </div>
            </div>
            <div className="ptable-footer">
              <div className="ptable-action">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handlePackageSelection('gold')}
                >
                  Select
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Platinum Package */}
        <div className={getPackageClass('platinum')}>
          <div className="ptable-single">
            <div className="ptable-header-3">
              <div className="ptable-title">
                <h2>Platinum</h2>
              </div>
              <div className="ptable-price">
                <h2><small>$</small>299<span>/ M</span></h2>
              </div>
            </div>
            <div className="ptable-body">
              <div className="ptable-description">
                <ul>
                  <li>Pure HTML & CSS</li>
                  <li>Responsive Design</li>
                  <li>Well-commented Code</li>
                  <li>Easy to Use</li>
                </ul>
              </div>
            </div>
            <div className="ptable-footer">
              <div className="ptable-action">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handlePackageSelection('platinum')}
                >
                  Select
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {errors.package && <Typography color="error">{errors.package[0]}</Typography>}
    </Box>
  );
};

const StoreTypeForm = ({ formData, handleChange, handleFileChange, errors }) => {
  const [preview, setPreview] = useState('');
  const [fileName, setFileName] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name); // Set the file name
      if (file.type.startsWith('image/')) { // Check if it's an image
        const fileURL = URL.createObjectURL(file);
        setPreview(fileURL);
      } else if (file.type === 'application/pdf') { // Check if it's a PDF
        setPreview(''); // Clear preview if it's a PDF
      } else {
        console.error('Unsupported file type. Please select a PNG image or PDF.');
      }
      handleFileChange(e); // Call the passed function for further handling
    }
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <Box sx={{ marginTop: 3 }}>
      <FormControl fullWidth margin="normal">
        <InputLabel>* Store Type</InputLabel>
        <Select name="store_type" value={formData.store_type} onChange={handleChange} error={!!errors.store_type}>
          <MenuItem value="mobile_car_wash">Mobile Car Wash</MenuItem>
          <MenuItem value="gas_and_water_delivery">Gas and Water Delivery</MenuItem>
          <MenuItem value="home_maintenance">Home Maintenance</MenuItem>
          <MenuItem value="mobile_barber">Mobile Barber</MenuItem>
        </Select>
        {errors.store_type && <Typography color="error">{errors.store_type[0]}</Typography>}
      </FormControl>
      <Button
        variant="outlined"
        component="label"
        fullWidth
        sx={{ marginTop: 2, marginBottom: 2 }}
      >
        * Upload ID Image
        <input type="file" hidden onChange={handleImageChange} />
      </Button>
      {preview ? (
        <Box sx={{ marginTop: 2 }}>
          <img
            src={preview}
            alt="ID Preview"
            style={{ maxHeight: '90px', objectFit: 'contain' }}
          />
        </Box>
      ) : (
        fileName && (
          <Box>
            <Typography variant="body1">Uploaded File: {fileName}</Typography>
          </Box>
        )
      )}
      {errors.id_image && <Typography color="error">{errors.id_image[0]}</Typography>}
      <TextField
        name="bank_account_info"
        label="* Bank Account Information"
        value={formData.bank_account_info}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={!!errors.bank_account_info}
        helperText={errors.bank_account_info ? errors.bank_account_info[0] : ''}
      />
    </Box>
  );
};

export default ClientStepper;

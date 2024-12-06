/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { useState } from 'react';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  customerFirstName: yup.string().required('First name is required'),
  customerLastName: yup.string().required('Last name is required'), 
  deliveryCountry: yup.string().required('Country is required'),
  deliveryAddressLine1: yup.string().required('Street address is required'),
  deliveryAddressLine2: yup.string(),
  deliveryPostalCode: yup.string().required('Postal code is required'),
  deliveryCity: yup.string().required('City is required'),
  deliveryRegion: yup.string().required('Region is required'),
  phoneNumber: yup.string().required('Phone number is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  deliveryInstructions: yup.string()
});

const BillingDetails = ({ onBillingDetailsChange }) => {
  const [billingDetails, setBillingDetails] = useState({
    customerFirstName: '',
    customerLastName: '',
    deliveryCountry: '',
    deliveryAddressLine1: '',
    deliveryAddressLine2: '',
    deliveryPostalCode: '',
    deliveryCity: '',
    deliveryRegion: '',
    phoneNumber: '',
    email: '',
    deliveryInstructions: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setBillingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));

    try {
      await validationSchema.validateAt(name, { [name]: value });
      setErrors((prev) => ({ ...prev, [name]: '' }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, [name]: error.message }));
    }

    onBillingDetailsChange({ ...billingDetails, [name]: value });
  };

  return (
    <div className="checkout_coupon ui_kit_button">
      <form className="form2">
        <div className="row">
          <div className="col-sm-6">
            <div className="mb30">
              <label className="form-label">First name *</label>
              <input
                className={`form-control form_control ${errors.customerFirstName ? 'is-invalid' : ''}`}
                type="text"
                name="customerFirstName"
                value={billingDetails.customerFirstName}
                onChange={handleChange}
                placeholder="Ali Tuf.."
              />
              {errors.customerFirstName && <div className="invalid-feedback">{errors.customerFirstName}</div>}
            </div>
          </div>
          {/* End .col */}

          <div className="col-sm-6">
            <div className="mb30">
              <label className="form-label">Last name *</label>
              <input
                className={`form-control form_control ${errors.customerLastName ? 'is-invalid' : ''}`}
                type="text"
                name="customerLastName"
                value={billingDetails.customerLastName}
                onChange={handleChange}
              />
              {errors.customerLastName && <div className="invalid-feedback">{errors.customerLastName}</div>}
            </div>
          </div>
          {/* End .col */}

          <div className="col-lg-12">
            <div className="mb30">
              <label className="form-label">Country / Region *</label>
              <div className="checkout_country_form actegory">
                <select
                  className={`form-select form-control ${errors.deliveryCountry ? 'is-invalid' : ''}`}
                  name="deliveryCountry"
                  value={billingDetails.deliveryCountry}
                  onChange={handleChange}
                >
                  <option value="">Select Country</option>
                  <option value="Turkey">Turkey</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                  <option value="Ukraine">Ukraine</option>
                  <option value="Uruguay">Uruguay</option>
                  <option value="UK">UK</option>
                  <option value="Uzbekistan">Uzbekistan</option>
                </select>
                {errors.deliveryCountry && <div className="invalid-feedback">{errors.deliveryCountry}</div>}
              </div>
            </div>
          </div>
          {/* End .col */}

          <div className="col-sm-12">
            <div className="mb30">
              <label className="form-label">Street address *</label>
              <input
                className={`form-control form_control mb10 ${errors.deliveryAddressLine1 ? 'is-invalid' : ''}`}
                type="text"
                name="deliveryAddressLine1"
                value={billingDetails.deliveryAddressLine1}
                onChange={handleChange}
              />
              {errors.deliveryAddressLine1 && <div className="invalid-feedback">{errors.deliveryAddressLine1}</div>}
              <input
                className="form-control form_control"
                type="text"
                name="deliveryAddressLine2"
                value={billingDetails.deliveryAddressLine2}
                onChange={handleChange}
              />
            </div>
          </div>
          {/* End .col */}

          <div className="col-sm-6">
            <div className="mb30">
              <label className="form-label">Postcode / ZIP *</label>
              <input
                className={`form-control form_control ${errors.deliveryPostalCode ? 'is-invalid' : ''}`}
                type="text"
                name="deliveryPostalCode"
                value={billingDetails.deliveryPostalCode}
                onChange={handleChange}
              />
              {errors.deliveryPostalCode && <div className="invalid-feedback">{errors.deliveryPostalCode}</div>}
            </div>
          </div>
          {/* End .col */}

          <div className="col-sm-6">
            <div className="mb30">
              <label className="form-label">Town / City *</label>
              <input
                className={`form-control form_control ${errors.deliveryCity ? 'is-invalid' : ''}`}
                type="text"
                name="deliveryCity"
                value={billingDetails.deliveryCity}
                onChange={handleChange}
              />
              {errors.deliveryCity && <div className="invalid-feedback">{errors.deliveryCity}</div>}
            </div>
          </div>
          {/* End .col */}

          <div className="col-sm-6">
            <div className="mb30">
              <label className="form-label">Region *</label>
              <input
                className={`form-control form_control ${errors.deliveryRegion ? 'is-invalid' : ''}`}
                type="text"
                name="deliveryRegion"
                value={billingDetails.deliveryRegion}
                onChange={handleChange}
              />
              {errors.deliveryRegion && <div className="invalid-feedback">{errors.deliveryRegion}</div>}
            </div>
          </div>
          {/* End .col */}

          <div className="col-sm-6">
            <div className="mb30">
              <label className="form-label">Phone *</label>
              <input
                className={`form-control form_control ${errors.phoneNumber ? 'is-invalid' : ''}`}
                type="text"
                name="phoneNumber"
                value={billingDetails.phoneNumber}
                onChange={handleChange}
              />
              {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
            </div>
          </div>
          {/* End .col */}

          <div className="col-sm-12">
            <div className="mb30">
              <label className="form-label">Your Email</label>
              <input
                className={`form-control form_control ${errors.email ? 'is-invalid' : ''}`}
                type="email"
                name="email"
                value={billingDetails.email}
                onChange={handleChange}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
          </div>
          {/* End .col */}

          <div className="col-sm-12">
            <div className="mb30 mb0">
              <h4 className="mb15">Additional Information</h4>
              <label className="form-label ai_title">
                Delivery Instructions (optional)
              </label>
              <textarea
                name="deliveryInstructions"
                className="form-control"
                rows={12}
                value={billingDetails.deliveryInstructions}
                onChange={handleChange}
              />
            </div>
          </div>
          {/* End .col */}
        </div>
      </form>
    </div>
  );
};

export default BillingDetails;

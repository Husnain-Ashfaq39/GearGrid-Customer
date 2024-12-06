"use client"
/* eslint-disable react/react-in-jsx-scope */
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('First Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  message: Yup.string().required('Message is required'),
});

const ContactForm = () => {
  const handleSubmit = async (values, { resetForm }) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_APPWRITE_LOCALHOST_ENDPOINT}/contactus/add`, {
        name: values.name,
        email: values.email,
        message: values.message,
        read: false, // default value
      });
      // Handle success (e.g., show a success message)
      console.log('Message sent successfully');
      const toast = document.createElement('div');
      toast.className = 'fixed top-5 right-5 bg-green-500 text-white p-4 rounded shadow-lg';
      toast.innerText = `Message sent successfully`;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.remove();
      }, 3000);
      resetForm(); // Clear all fields after submission
    } catch (error) {
      // Handle error (e.g., show an error message)
      console.error('Error sending message', error);
    }
  };

  return (
    <Formik
      initialValues={{ name: '', email: '', message: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form className="contact_form">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">First Name*</label>
                <Field
                  className="form-control"
                  type="text"
                  name="name"
                  placeholder="John"
                />
                <ErrorMessage name="name" component="div" className="error" />
              </div>
            </div>
            {/* End .col */}

            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">Last Name*</label>
                <Field
                  className="form-control"
                  type="text"
                  name="lastName"
                  placeholder="Doe"
                />
                <ErrorMessage name="lastName" component="div" className="error" />
              </div>
            </div>
            {/* End .col */}

            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">Email*</label>
                <Field
                  className="form-control email"
                  type="email"
                  name="email"
                  placeholder="john.doe@example.com"
                />
                <ErrorMessage name="email" component="div" className="error" />
              </div>
            </div>
            {/* End .col */}

            <div className="col-sm-12">
              <div className="form-group">
                <label className="form-label">Message</label>
                <Field
                  as="textarea"
                  name="message"
                  className="form-control"
                  rows={6}
                  placeholder="Your message here..."
                />
                <ErrorMessage name="message" component="div" className="error" />
              </div>
              {/* End form-group */}
              <div className="form-group mb0">
                <button type="submit" className="btn btn-thm">
                  Get In Touch
                </button>
              </div>
            </div>
            {/* End .col */}
          </div>
          {/* End .row */}
        </Form>
      )}
    </Formik>
  );
};

export default ContactForm;

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const SubmitBusinessPage = () => {
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    phone: "",
    email: "",
    address: "",
    category_id: "",
    location_id: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { currentUser, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories
    fetch("http://localhost:5000/api/categories")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setCategories(data.data);
        }
      })
      .catch((error) => console.error("Error fetching categories:", error));

    // Fetch locations
    fetch("http://localhost:5000/api/locations")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setLocations(data.data);
        }
      })
      .catch((error) => console.error("Error fetching locations:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormData({
        ...formData,
        image: file,
      });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (
      !formData.name ||
      !formData.description ||
      !formData.phone ||
      !formData.category_id ||
      !formData.location_id
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    // Create FormData object for file upload
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("description", formData.description);
    submitData.append("phone", formData.phone);
    submitData.append("email", formData.email);
    submitData.append("address", formData.address);
    submitData.append("category_id", formData.category_id);
    submitData.append("location_id", formData.location_id);

    if (formData.image) {
      submitData.append("image", formData.image);
    }

    try {
      const response = await fetch("http://localhost:5000/api/businesses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submitData,
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Business submitted successfully and is pending approval");

        // Reset form
        setFormData({
          name: "",
          description: "",
          phone: "",
          email: "",
          address: "",
          category_id: "",
          location_id: "",
          image: null,
        });
        setImagePreview(null);

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        setError(data.message || "Failed to submit business");
      }
    } catch (err) {
      console.error("Error submitting business:", err);
      setError("An error occurred while submitting your business");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h2 className="mb-0">Submit Your Business</h2>
            </Card.Header>
            <Card.Body className="p-4">
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="name">
                      <Form.Label>Business Name*</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="phone">
                      <Form.Label>Phone Number*</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="email">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="address">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="category">
                      <Form.Label>Category*</Form.Label>
                      <Form.Select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="location">
                      <Form.Label>Location*</Form.Label>
                      <Form.Select
                        name="location_id"
                        value={formData.location_id}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a location</option>
                        {locations.map((location) => (
                          <option key={location.id} value={location.id}>
                            {location.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3" controlId="description">
                  <Form.Label>Business Description*</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="image">
                  <Form.Label>Business Image</Form.Label>
                  <Form.Control
                    type="file"
                    name="image"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                  <Form.Text className="text-muted">
                    Upload an image of your business (optional)
                  </Form.Text>

                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Business preview"
                        className="img-thumbnail"
                        style={{ maxHeight: "200px" }}
                      />
                    </div>
                  )}
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    type="submit"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Submitting...
                      </>
                    ) : (
                      "Submit Business"
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          <div className="mt-4 text-center">
            <p className="text-muted">
              * Required fields
              <br />
              Your business will be reviewed by an admin before being published.
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SubmitBusinessPage;

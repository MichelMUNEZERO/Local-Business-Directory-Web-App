import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
} from "react-bootstrap";
import { Link, useParams, useLocation } from "react-router-dom";

const BusinessListPage = () => {
  const [businesses, setBusinesses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const { categoryId, locationId } = useParams();
  const location = useLocation();

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

    // Set initial filter values from URL params
    if (categoryId) {
      setSelectedCategory(categoryId);
    }
    if (locationId) {
      setSelectedLocation(locationId);
    }
  }, [categoryId, locationId]);

  useEffect(() => {
    // Build API URL with filters
    let url = "http://localhost:5000/api/businesses?";

    const params = new URLSearchParams();

    if (searchTerm) {
      params.append("search", searchTerm);
    }

    if (selectedCategory) {
      params.append("category", selectedCategory);
    }

    if (selectedLocation) {
      params.append("location", selectedLocation);
    }

    url += params.toString();

    // Fetch businesses with filters
    setLoading(true);
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setBusinesses(data.data || []);
        } else {
          setBusinesses([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching businesses:", error);
        setBusinesses([]);
        setLoading(false);
      });
  }, [searchTerm, selectedCategory, selectedLocation, location]);

  const handleSearch = (e) => {
    e.preventDefault();
    // The search is already handled by the useEffect
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4">Browse Local Businesses</h1>

      {/* Filters */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row>
              <Col md={4} className="mb-3 mb-md-0">
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Search businesses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button type="submit" variant="primary">
                    <i className="bi bi-search"></i>
                  </Button>
                </InputGroup>
              </Col>
              <Col md={4} className="mb-3 mb-md-0">
                <Form.Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option value="">All Locations</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Business Listings */}
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <Row>
          {businesses.length > 0 ? (
            businesses.map((business) => (
              <Col key={business.id} md={4} className="mb-4">
                <Card className="h-100 shadow-sm hover-effect">
                  <div style={{ height: "200px", overflow: "hidden" }}>
                    <Card.Img
                      variant="top"
                      src={
                        business.image_url ||
                        "https://via.placeholder.com/300x200?text=Business"
                      }
                      alt={business.name}
                      className="img-fluid"
                      style={{
                        objectFit: "cover",
                        height: "100%",
                        width: "100%",
                      }}
                    />
                  </div>
                  <Card.Body>
                    <Card.Title>{business.name}</Card.Title>
                    <div className="mb-2 text-muted small">
                      <i className="bi bi-geo-alt me-1"></i>
                      {business.location?.name || "Location not specified"}
                      <span className="mx-2">•</span>
                      <i className="bi bi-tag me-1"></i>
                      {business.category?.name || "Category not specified"}
                    </div>
                    <Card.Text>
                      {business.description?.substring(0, 100)}...
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer className="bg-white">
                    <Link to={`/businesses/${business.id}`}>
                      <Button variant="primary" className="w-100">
                        View Details
                      </Button>
                    </Link>
                  </Card.Footer>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <div className="text-center my-5">
                <p>No businesses found. Try changing your search criteria.</p>
                <Link to="/submit-business">
                  <Button variant="primary">Add Your Business</Button>
                </Link>
              </div>
            </Col>
          )}
        </Row>
      )}
    </Container>
  );
};

export default BusinessListPage;

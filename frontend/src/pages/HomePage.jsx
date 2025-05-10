import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [recentBusinesses, setRecentBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch categories
    fetch("http://localhost:5000/api/categories")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setCategories(data.data.slice(0, 6)); // Get first 6 categories
        }
      })
      .catch((error) => console.error("Error fetching categories:", error));

    // Fetch recent businesses
    fetch("http://localhost:5000/api/businesses?limit=4")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setRecentBusinesses(data.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching businesses:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-primary text-white py-5 mb-5">
        <Container>
          <Row className="align-items-center">
            <Col md={7}>
              <h1 className="display-4 fw-bold">Discover Local Businesses</h1>
              <p className="lead fs-4">
                Connect with the best local businesses in your community
              </p>
              <Link to="/businesses">
                <Button variant="light" size="lg" className="me-3">
                  Browse Businesses
                </Button>
              </Link>
              <Link to="/submit-business">
                <Button variant="outline-light" size="lg">
                  List Your Business
                </Button>
              </Link>
            </Col>
            <Col md={5} className="d-none d-md-block">
              <img
                src="https://via.placeholder.com/500x300?text=Local+Businesses"
                alt="Local Businesses"
                className="img-fluid rounded"
              />
            </Col>
          </Row>
        </Container>
      </div>

      {/* Categories Section */}
      <Container className="mb-5">
        <h2 className="text-center mb-4">Browse by Category</h2>
        <Row>
          {categories.map((category) => (
            <Col key={category.id} md={4} className="mb-4">
              <Card className="h-100 shadow-sm hover-effect">
                <Card.Body className="d-flex flex-column align-items-center">
                  <div className="category-icon mb-3">
                    <i
                      className={`bi bi-${
                        category.icon || "shop"
                      } fs-1 text-primary`}
                    ></i>
                  </div>
                  <Card.Title>{category.name}</Card.Title>
                  <Card.Text className="text-muted">
                    {category.description ||
                      `Find the best ${category.name.toLowerCase()} businesses in your area`}
                  </Card.Text>
                  <Link
                    to={`/businesses/category/${category.id}`}
                    className="mt-auto"
                  >
                    <Button variant="outline-primary" className="w-100">
                      Browse {category.name}
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <div className="text-center mt-4">
          <Link to="/businesses">
            <Button variant="primary">View All Categories</Button>
          </Link>
        </div>
      </Container>

      {/* Recent Businesses Section */}
      <div className="bg-light py-5">
        <Container>
          <h2 className="text-center mb-4">Recently Added Businesses</h2>
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <Row>
                {recentBusinesses.length > 0 ? (
                  recentBusinesses.map((business) => (
                    <Col key={business.id} md={3} className="mb-4">
                      <Card className="h-100 shadow-sm hover-effect">
                        <div style={{ height: "160px", overflow: "hidden" }}>
                          <Card.Img
                            variant="top"
                            src={
                              business.image_url ||
                              "https://via.placeholder.com/300x160?text=Business"
                            }
                            alt={business.name}
                          />
                        </div>
                        <Card.Body>
                          <Card.Title>{business.name}</Card.Title>
                          <Card.Text className="text-muted">
                            {business.description.substring(0, 80)}...
                          </Card.Text>
                          <Link to={`/businesses/${business.id}`}>
                            <Button variant="outline-primary" size="sm">
                              View Details
                            </Button>
                          </Link>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <Col>
                    <div className="text-center my-5">
                      <p>No businesses found. Be the first to add one!</p>
                      <Link to="/submit-business">
                        <Button variant="primary">Add Your Business</Button>
                      </Link>
                    </div>
                  </Col>
                )}
              </Row>
              <div className="text-center mt-4">
                <Link to="/businesses">
                  <Button variant="primary">View All Businesses</Button>
                </Link>
              </div>
            </>
          )}
        </Container>
      </div>
    </div>
  );
};

export default HomePage;

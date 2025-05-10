import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const BusinessDetailPage = () => {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const { currentUser } = useAuth();

  useEffect(() => {
    // Fetch business details
    fetch(`http://localhost:5000/api/businesses/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Business not found");
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          setBusiness(data.data);
        } else {
          setError(data.message || "Failed to load business details");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching business details:", error);
        setError(
          error.message || "An error occurred while fetching business details"
        );
        setLoading(false);
      });
  }, [id]);

  // Check if current user is the owner of this business or an admin
  const isOwnerOrAdmin = () => {
    if (!currentUser || !business) return false;
    return currentUser.id === business.user_id || currentUser.role === "admin";
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5 text-center">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <Link to="/businesses">
          <Button variant="primary">Back to Businesses</Button>
        </Link>
      </Container>
    );
  }

  if (!business) {
    return (
      <Container className="py-5 text-center">
        <div className="alert alert-warning" role="alert">
          Business not found
        </div>
        <Link to="/businesses">
          <Button variant="primary">Back to Businesses</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col lg={8}>
          {/* Business Main Info */}
          <Card className="mb-4 shadow-sm">
            <div style={{ height: "300px", overflow: "hidden" }}>
              <Card.Img
                variant="top"
                src={
                  business.image_url ||
                  "https://via.placeholder.com/800x300?text=Business"
                }
                alt={business.name}
                className="img-fluid"
                style={{ objectFit: "cover", height: "100%", width: "100%" }}
              />
            </div>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="mb-0">{business.name}</h1>
                {business.is_approved ? (
                  <Badge bg="success">Verified</Badge>
                ) : (
                  <Badge bg="warning">Pending Verification</Badge>
                )}
              </div>

              <div className="mb-3 text-muted">
                <i className="bi bi-geo-alt me-1"></i>
                {business.location?.name || "Location not specified"}
                <span className="mx-2">•</span>
                <i className="bi bi-tag me-1"></i>
                {business.category?.name || "Category not specified"}
              </div>

              <hr />

              <h5>About</h5>
              <p>{business.description}</p>

              {isOwnerOrAdmin() && (
                <div className="mt-4">
                  <Link to={`/dashboard/edit-business/${business.id}`}>
                    <Button variant="outline-primary" className="me-2">
                      <i className="bi bi-pencil me-1"></i> Edit Business
                    </Button>
                  </Link>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          {/* Contact Information */}
          <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Contact Information</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <i className="bi bi-telephone me-2"></i>
                <strong>Phone:</strong>
                <div>{business.phone}</div>
              </div>

              {business.email && (
                <div className="mb-3">
                  <i className="bi bi-envelope me-2"></i>
                  <strong>Email:</strong>
                  <div>
                    <a href={`mailto:${business.email}`}>{business.email}</a>
                  </div>
                </div>
              )}

              {business.address && (
                <div className="mb-3">
                  <i className="bi bi-geo-alt me-2"></i>
                  <strong>Address:</strong>
                  <div>{business.address}</div>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Category Information */}
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Category</h5>
            </Card.Header>
            <Card.Body>
              <Link to={`/businesses/category/${business.category_id}`}>
                <Button variant="outline-primary" className="w-100">
                  Browse More {business.category?.name || "Businesses"}
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BusinessDetailPage;

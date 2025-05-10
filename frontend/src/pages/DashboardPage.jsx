import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
  Alert,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const DashboardPage = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { currentUser, token } = useAuth();

  useEffect(() => {
    // Fetch user's businesses
    const fetchUserBusinesses = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/businesses/user/${currentUser.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (data.success) {
          setBusinesses(data.data || []);
        } else {
          setError(data.message || "Failed to fetch your businesses");
        }
      } catch (err) {
        console.error("Error fetching businesses:", err);
        setError("Failed to load businesses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserBusinesses();
  }, [currentUser.id, token]);

  return (
    <Container className="py-5">
      <Row>
        <Col>
          <h1 className="mb-4">My Dashboard</h1>
        </Col>
        <Col className="text-end">
          <Link to="/submit-business">
            <Button variant="primary">
              <i className="bi bi-plus-lg me-2"></i>
              Add New Business
            </Button>
          </Link>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-4">
        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="rounded-circle bg-primary text-white p-3 me-3">
                  <i className="bi bi-person fs-4"></i>
                </div>
                <div>
                  <h6 className="mb-0 text-muted">Welcome back</h6>
                  <h5 className="mb-0">{currentUser.name}</h5>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Account Information</h5>
              <p className="mb-2">
                <strong>Email:</strong> {currentUser.email}
              </p>
              <p className="mb-2">
                <strong>Role:</strong> {currentUser.role}
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Header>
              <h5 className="mb-0">My Businesses</h5>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : businesses.length > 0 ? (
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>Business Name</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {businesses.map((business) => (
                        <tr key={business.id}>
                          <td>{business.name}</td>
                          <td>{business.category?.name || "N/A"}</td>
                          <td>
                            {business.is_approved ? (
                              <Badge bg="success">Approved</Badge>
                            ) : (
                              <Badge bg="warning">Pending</Badge>
                            )}
                          </td>
                          <td>
                            <Link
                              to={`/businesses/${business.id}`}
                              className="btn btn-sm btn-outline-primary me-1"
                            >
                              View
                            </Link>
                            <Link
                              to={`/dashboard/edit-business/${business.id}`}
                              className="btn btn-sm btn-outline-secondary"
                            >
                              Edit
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p>You haven't submitted any businesses yet.</p>
                  <Link to="/submit-business">
                    <Button variant="primary">Add Your First Business</Button>
                  </Link>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardPage;

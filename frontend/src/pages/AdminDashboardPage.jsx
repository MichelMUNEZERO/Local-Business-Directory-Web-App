import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
  Nav,
  Tab,
  Alert,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AdminDashboardPage = () => {
  const [businesses, setBusinesses] = useState([]);
  const [pendingBusinesses, setPendingBusinesses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState({
    businesses: true,
    users: true,
  });
  const [error, setError] = useState("");

  const { token } = useAuth();

  useEffect(() => {
    // Fetch all businesses
    const fetchBusinesses = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/businesses/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (data.success) {
          const allBusinesses = data.data || [];
          setBusinesses(allBusinesses);
          setPendingBusinesses(
            allBusinesses.filter((business) => !business.is_approved)
          );
        } else {
          setError(data.message || "Failed to fetch businesses");
        }
      } catch (err) {
        console.error("Error fetching businesses:", err);
        setError("Failed to load businesses. Please try again later.");
      } finally {
        setLoading((prev) => ({ ...prev, businesses: false }));
      }
    };

    // Fetch all users
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setUsers(data.data || []);
        } else {
          setError(data.message || "Failed to fetch users");
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Please try again later.");
      } finally {
        setLoading((prev) => ({ ...prev, users: false }));
      }
    };

    fetchBusinesses();
    fetchUsers();
  }, [token]);

  const handleApproveReject = async (businessId, approve) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/businesses/${businessId}/${
          approve ? "approve" : "reject"
        }`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        // Update the business status in state
        setBusinesses((prevBusinesses) =>
          prevBusinesses.map((business) =>
            business.id === businessId
              ? { ...business, is_approved: approve }
              : business
          )
        );

        // Update pending businesses list
        setPendingBusinesses((prevPending) =>
          prevPending.filter((business) => business.id !== businessId)
        );
      } else {
        setError(
          data.message || `Failed to ${approve ? "approve" : "reject"} business`
        );
      }
    } catch (err) {
      console.error(
        `Error ${approve ? "approving" : "rejecting"} business:`,
        err
      );
      setError(
        `Failed to ${
          approve ? "approve" : "reject"
        } business. Please try again.`
      );
    }
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4">Admin Dashboard</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Tab.Container defaultActiveKey="pending">
        <Row>
          <Col md={3} className="mb-4">
            <Card className="shadow-sm">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">Admin Panel</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="pending">
                      Pending Approvals
                      {pendingBusinesses.length > 0 && (
                        <Badge bg="danger" className="ms-2">
                          {pendingBusinesses.length}
                        </Badge>
                      )}
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="businesses">All Businesses</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="users">Users</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Body>
            </Card>
          </Col>

          <Col md={9}>
            <Tab.Content>
              {/* Pending Approvals Tab */}
              <Tab.Pane eventKey="pending">
                <Card className="shadow-sm">
                  <Card.Header>
                    <h5 className="mb-0">Pending Business Approvals</h5>
                  </Card.Header>
                  <Card.Body>
                    {loading.businesses ? (
                      <div className="text-center py-4">
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : pendingBusinesses.length > 0 ? (
                      <div className="table-responsive">
                        <Table hover>
                          <thead>
                            <tr>
                              <th>Business Name</th>
                              <th>Category</th>
                              <th>Owner</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pendingBusinesses.map((business) => (
                              <tr key={business.id}>
                                <td>{business.name}</td>
                                <td>{business.category?.name || "N/A"}</td>
                                <td>{business.user?.name || "Unknown"}</td>
                                <td>
                                  <Button
                                    variant="outline-success"
                                    size="sm"
                                    className="me-1"
                                    onClick={() =>
                                      handleApproveReject(business.id, true)
                                    }
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() =>
                                      handleApproveReject(business.id, false)
                                    }
                                  >
                                    Reject
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p>No pending businesses to approve.</p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Tab.Pane>

              {/* All Businesses Tab */}
              <Tab.Pane eventKey="businesses">
                <Card className="shadow-sm">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">All Businesses</h5>
                  </Card.Header>
                  <Card.Body>
                    {loading.businesses ? (
                      <div className="text-center py-4">
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        >
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
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p>No businesses found.</p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Tab.Pane>

              {/* Users Tab */}
              <Tab.Pane eventKey="users">
                <Card className="shadow-sm">
                  <Card.Header>
                    <h5 className="mb-0">User Management</h5>
                  </Card.Header>
                  <Card.Body>
                    {loading.users ? (
                      <div className="text-center py-4">
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : users.length > 0 ? (
                      <div className="table-responsive">
                        <Table hover>
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Role</th>
                              <th>Joined</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {users.map((user) => (
                              <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                  <Badge
                                    bg={
                                      user.role === "admin" ? "danger" : "info"
                                    }
                                  >
                                    {user.role}
                                  </Badge>
                                </td>
                                <td>
                                  {new Date(
                                    user.created_at
                                  ).toLocaleDateString()}
                                </td>
                                <td>
                                  <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    disabled
                                  >
                                    Edit
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p>No users found.</p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default AdminDashboardPage;

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Divider,
  Chip,
  Paper,
  LinearProgress,
  Avatar,
  IconButton,
  Badge,
  InputBase,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import {
  Person,
  Work,
  Home,
  AttachMoney,
  Score,
  AssignmentTurnedIn,
  Search,
  Notifications,
  Settings,
  Logout,
  Dashboard as DashboardIcon,
  AccountCircle,
  DateRange,
  FilterList,
  CheckCircle,
  Cancel,
  Pending,
} from "@mui/icons-material";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { useTheme, alpha } from "@mui/material/styles";

function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const theme = useTheme();

  // Open/close user menu
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Open/close filter menu
  const handleFilterOpen = (event) => setFilterAnchorEl(event.currentTarget);
  const handleFilterClose = () => setFilterAnchorEl(null);

  // Status filter options
  const statusFilters = [
    {
      value: "ALL",
      label: "All Statuses",
      icon: <FilterList fontSize="small" />,
    },
    {
      value: "PENDING",
      label: "Pending",
      icon: <Pending color="warning" fontSize="small" />,
    },
    {
      value: "APPROVED",
      label: "Approved",
      icon: <CheckCircle color="success" fontSize="small" />,
    },
    {
      value: "REJECTED",
      label: "Rejected",
      icon: <Cancel color="error" fontSize="small" />,
    },
  ];

  // Prepare data for charts
  const getStatusData = () => {
    const statusCounts = applications.reduce(
      (acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      },
      { PENDING: 0, APPROVED: 0, REJECTED: 0 }
    );
    return [
      {
        name: "Pending",
        value: statusCounts.PENDING,
        color: theme.palette.warning.main,
      },
      {
        name: "Approved",
        value: statusCounts.APPROVED,
        color: theme.palette.success.main,
      },
      {
        name: "Rejected",
        value: statusCounts.REJECTED,
        color: theme.palette.error.main,
      },
    ].filter((item) => item.value > 0);
  };

  const getPurposeData = () => {
    const purposeSums = applications.reduce((acc, app) => {
      acc[app.purpose] = (acc[app.purpose] || 0) + Number(app.loanAmount);
      return acc;
    }, {});
    return Object.keys(purposeSums).map((purpose) => ({
      purpose,
      amount: purposeSums[purpose],
    }));
  };

  const getMonthlyData = () => {
    // Simulate monthly data for the chart
    return [
      { month: "Jan", applications: 12, approved: 8 },
      { month: "Feb", applications: 18, approved: 12 },
      { month: "Mar", applications: 15, approved: 10 },
      { month: "Apr", applications: 22, approved: 16 },
      { month: "May", applications: 19, approved: 14 },
      { month: "Jun", applications: 25, approved: 18 },
    ];
  };

  // Filter applications based on search and status filter
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    if (!user.id || !user.role) {
      setError("User not logged in or invalid session");
      setLoading(false);
      toast.error("Please log in to view your dashboard");
      return;
    }
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const endpoint =
        user.role === "ADMIN"
          ? "http://localhost:8732/api/loans/all"
          : `http://localhost:8732/api/loans/user/${user.id}`;
      const response = await axios.get(endpoint);
      setApplications(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to load applications";
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      await axios.put(
        `http://localhost:8732/api/loans/update-status/${applicationId}`,
        null,
        { params: { status } }
      );
      toast.success(`Application ${status.toLowerCase()}!`);
      fetchApplications();
    } catch (error) {
      toast.error(error.response?.data?.message || "Status update failed");
    }
  };

  const handleDisburse = async (applicationId) => {
    try {
      const application = applications.find(
        (app) => app.applicationId === applicationId
      );
      await axios.post(
        `http://localhost:8732/api/disbursements/disburse/${applicationId}`,
        null,
        { params: { amount: application.loanAmount } }
      );
      toast.success("Loan disbursed!");
      fetchApplications();
    } catch (error) {
      toast.error(error.response?.data?.message || "Disbursement failed");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: theme.palette.background.default,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 400, textAlign: "center", p: 4 }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{ display: "inline-block" }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: theme.palette.primary.main,
                mb: 3,
              }}
            >
              <DashboardIcon fontSize="large" />
            </Avatar>
          </motion.div>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Loading Your Dashboard
          </Typography>
          <LinearProgress color="primary" />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: theme.palette.background.default,
        }}
      >
        <Paper
          sx={{
            p: 4,
            maxWidth: 500,
            textAlign: "center",
            borderRadius: 4,
            boxShadow: theme.shadows[10],
          }}
        >
          <Typography variant="h5" color="error" gutterBottom>
            Dashboard Error
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {typeof error === "string"
              ? error
              : "Failed to load dashboard data"}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={fetchApplications}
            sx={{ borderRadius: 3, px: 4 }}
          >
            Try Again
          </Button>
        </Paper>
      </Box>
    );
  }

  // Format date without date-fns
  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          theme.palette.mode === "light"
            ? "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)"
            : theme.palette.background.default,
        pb: 8,
      }}
    >
      {/* App Bar */}
      <Paper
        elevation={0}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1100,
          borderRadius: 0,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backdropFilter: "blur(20px)",
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          p: 2,
          mb: 4,
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                sx={{
                  mr: 2,
                  width: 40,
                  height: 40,
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                }}
              >
                <DashboardIcon />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Loan
                <span style={{ color: theme.palette.primary.main }}>Hub</span>
              </Typography>
            </Box>

            <Paper
              sx={{
                display: "flex",
                alignItems: "center",
                width: 400,
                borderRadius: 3,
                px: 2,
                py: 0.5,
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
              }}
            >
              <Search color="action" />
              <InputBase
                placeholder="Search applications..."
                sx={{ ml: 1, flex: 1 }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Paper>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton sx={{ mr: 1 }}>
                <Badge badgeContent={4} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
              <IconButton sx={{ mr: 1 }}>
                <Settings />
              </IconButton>
              <Button
                variant="outlined"
                startIcon={<AccountCircle />}
                onClick={handleMenuOpen}
                sx={{ borderRadius: 3 }}
              >
                {user.name || "User"}
              </Button>
            </Box>
          </Box>
        </Container>
      </Paper>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 200,
            borderRadius: 3,
            overflow: "visible",
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block",
              }}
            >
              {user.role === "ADMIN" ? "Admin Dashboard" : "My Loan Dashboard"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {formattedDate}
            </Typography>
          </motion.div>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ y: -5 }}>
              <Card
                sx={{
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha(
                    theme.palette.primary.main,
                    0.1
                  )} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                  boxShadow: "none",
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                }}
              >
                <CardContent>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography color="text.secondary" gutterBottom>
                      Total Applications
                    </Typography>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <AssignmentTurnedIn color="primary" />
                    </Box>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {applications.length}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <Box component="span" sx={{ color: "success.main" }}>
                      +12%
                    </Box>{" "}
                    from last month
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ y: -5 }}>
              <Card
                sx={{
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha(
                    theme.palette.success.main,
                    0.1
                  )} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
                  boxShadow: "none",
                  border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                }}
              >
                <CardContent>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography color="text.secondary" gutterBottom>
                      Approved
                    </Typography>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CheckCircle color="success" />
                    </Box>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {applications.filter((a) => a.status === "APPROVED").length}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <Box component="span" sx={{ color: "success.main" }}>
                      +8%
                    </Box>{" "}
                    from last month
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ y: -5 }}>
              <Card
                sx={{
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha(
                    theme.palette.warning.main,
                    0.1
                  )} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
                  boxShadow: "none",
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                }}
              >
                <CardContent>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography color="text.secondary" gutterBottom>
                      Pending
                    </Typography>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Pending color="warning" />
                    </Box>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {applications.filter((a) => a.status === "PENDING").length}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <Box component="span" sx={{ color: "warning.main" }}>
                      +5%
                    </Box>{" "}
                    from last month
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ y: -5 }}>
              <Card
                sx={{
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha(
                    theme.palette.error.main,
                    0.1
                  )} 0%, ${alpha(theme.palette.error.main, 0.05)} 100%)`,
                  boxShadow: "none",
                  border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                }}
              >
                <CardContent>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography color="text.secondary" gutterBottom>
                      Rejected
                    </Typography>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        bgcolor: alpha(theme.palette.error.main, 0.1),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Cancel color="error" />
                    </Box>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {applications.filter((a) => a.status === "REJECTED").length}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <Box component="span" sx={{ color: "error.main" }}>
                      -2%
                    </Box>{" "}
                    from last month
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Status Distribution */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  height: "100%",
                  background: theme.palette.background.paper,
                  boxShadow: theme.shadows[2],
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Application Status
                  </Typography>
                  <Chip
                    label="This Month"
                    size="small"
                    sx={{ borderRadius: 2 }}
                  />
                </Box>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getStatusData()}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {getStatusData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [
                          `${value} Applications`,
                          "Count",
                        ]}
                      />
                      <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          {/* Monthly Trends */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  height: "100%",
                  background: theme.palette.background.paper,
                  boxShadow: theme.shadows[2],
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Monthly Trends
                  </Typography>
                  <Button
                    size="small"
                    endIcon={<DateRange fontSize="small" />}
                    sx={{ borderRadius: 2 }}
                  >
                    2025
                  </Button>
                </Box>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={getMonthlyData()}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={theme.palette.divider}
                      />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="applications"
                        stackId="1"
                        stroke={theme.palette.primary.main}
                        fill={alpha(theme.palette.primary.main, 0.2)}
                      />
                      <Area
                        type="monotone"
                        dataKey="approved"
                        stackId="2"
                        stroke={theme.palette.success.main}
                        fill={alpha(theme.palette.success.main, 0.2)}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

        {/* Applications Section */}
        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            background: theme.palette.background.paper,
            boxShadow: theme.shadows[2],
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Loan Applications
            </Typography>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={handleFilterOpen}
                sx={{ borderRadius: 3 }}
              >
                Filter
              </Button>
              {user.role !== "ADMIN" && (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ borderRadius: 3 }}
                  href="/apply-loan"
                >
                  New Application
                </Button>
              )}
            </Box>
          </Box>

          {/* Filter Menu */}
          <Menu
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={handleFilterClose}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1,
                minWidth: 200,
                borderRadius: 3,
              },
            }}
          >
            {statusFilters.map((filter) => (
              <MenuItem
                key={filter.value}
                selected={statusFilter === filter.value}
                onClick={() => {
                  setStatusFilter(filter.value);
                  handleFilterClose();
                }}
              >
                <ListItemIcon>{filter.icon}</ListItemIcon>
                <ListItemText>{filter.label}</ListItemText>
              </MenuItem>
            ))}
          </Menu>

          {filteredApplications.length === 0 ? (
            <Box
              sx={{
                p: 8,
                textAlign: "center",
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.action.hover, 0.05),
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No applications found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchQuery
                  ? "Try a different search term"
                  : statusFilter !== "ALL"
                  ? "No applications with this status"
                  : "You have no applications yet"}
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              <AnimatePresence>
                {filteredApplications.map((app) => (
                  <Grid item xs={12} sm={6} md={4} key={app.applicationId}>
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ y: -5 }}
                    >
                      <Card
                        sx={{
                          borderRadius: 3,
                          height: "100%",
                          borderLeft: `4px solid ${
                            app.status === "APPROVED"
                              ? theme.palette.success.main
                              : app.status === "REJECTED"
                              ? theme.palette.error.main
                              : theme.palette.warning.main
                          }`,
                          boxShadow: theme.shadows[1],
                          transition: "all 0.3s ease",
                          "&:hover": {
                            boxShadow: theme.shadows[4],
                          },
                        }}
                      >
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 2,
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 600,
                                color: theme.palette.text.primary,
                              }}
                            >
                              {app.name}
                            </Typography>
                            <Chip
                              label={app.status}
                              size="small"
                              sx={{
                                borderRadius: 2,
                                fontWeight: 500,
                                backgroundColor:
                                  app.status === "APPROVED"
                                    ? alpha(theme.palette.success.main, 0.1)
                                    : app.status === "REJECTED"
                                    ? alpha(theme.palette.error.main, 0.1)
                                    : alpha(theme.palette.warning.main, 0.1),
                                color:
                                  app.status === "APPROVED"
                                    ? theme.palette.success.main
                                    : app.status === "REJECTED"
                                    ? theme.palette.error.main
                                    : theme.palette.warning.main,
                              }}
                            />
                          </Box>

                          <Stack spacing={1.5} sx={{ mb: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Work
                                sx={{
                                  mr: 1,
                                  color: theme.palette.text.secondary,
                                  fontSize: 20,
                                }}
                              />
                              <Typography variant="body2">
                                {app.profession}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Home
                                sx={{
                                  mr: 1,
                                  color: theme.palette.text.secondary,
                                  fontSize: 20,
                                }}
                              />
                              <Typography variant="body2">
                                {app.purpose}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <AttachMoney
                                sx={{
                                  mr: 1,
                                  color: theme.palette.text.secondary,
                                  fontSize: 20,
                                }}
                              />
                              <Typography variant="body2">
                                ${Number(app.loanAmount).toLocaleString()}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Score
                                sx={{
                                  mr: 1,
                                  color: theme.palette.text.secondary,
                                  fontSize: 20,
                                }}
                              />
                              <Typography variant="body2">
                                Credit Score: {app.creditScore}
                              </Typography>
                            </Box>
                          </Stack>

                          {user.role === "ADMIN" && (
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                mt: 2,
                              }}
                            >
                              {app.status === "PENDING" && (
                                <>
                                  <Button
                                    variant="contained"
                                    color="success"
                                    size="small"
                                    onClick={() =>
                                      handleStatusUpdate(
                                        app.applicationId,
                                        "APPROVED"
                                      )
                                    }
                                    sx={{
                                      borderRadius: 2,
                                      flex: 1,
                                      textTransform: "none",
                                    }}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    onClick={() =>
                                      handleStatusUpdate(
                                        app.applicationId,
                                        "REJECTED"
                                      )
                                    }
                                    sx={{
                                      borderRadius: 2,
                                      flex: 1,
                                      textTransform: "none",
                                    }}
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                              {app.status === "APPROVED" && (
                                <Button
                                  variant="contained"
                                  color="primary"
                                  size="small"
                                  onClick={() =>
                                    handleDisburse(app.applicationId)
                                  }
                                  sx={{
                                    borderRadius: 2,
                                    width: "100%",
                                    textTransform: "none",
                                  }}
                                >
                                  Disburse Loan
                                </Button>
                              )}
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </AnimatePresence>
            </Grid>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default Dashboard;

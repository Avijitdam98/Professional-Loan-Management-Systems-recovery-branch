import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { Briefcase, CreditCard, CurrencyDollar, FileText, Upload, User, X } from "@phosphor-icons/react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function LoanApplication() {
  const [formData, setFormData] = useState({
    name: "",
    profession: "",
    purpose: "",
    loanAmount: "",
    creditScore: "",
  });
  const [files, setFiles] = useState({
    pfAccountPdf: null,
    salarySlip: null,
  });
  const [loading, setLoading] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const fileInputRefs = {
    pfAccountPdf: useRef(null),
    salarySlip: useRef(null),
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFocus = (fieldName) => {
    setActiveField(fieldName);
  };

  const handleBlur = () => {
    setActiveField(null);
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      setFiles({ ...files, [name]: selectedFiles[0] });
    }
  };

  const removeFile = (fileType) => {
    setFiles({ ...files, [fileType]: null });
    if (fileInputRefs[fileType].current) {
      fileInputRefs[fileType].current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user.id) {
      toast.error("Please log in to apply for a loan");
      navigate("/login");
      return;
    }

    setLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    data.append("userId", user.id);
    if (files.pfAccountPdf) data.append("pfAccountPdf", files.pfAccountPdf);
    if (files.salarySlip) data.append("salarySlip", files.salarySlip);

    try {
      await axios.post("http://localhost:8732/api/loans/apply", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Application submitted successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Application failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user.id) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background:
            "radial-gradient(circle at center, #f0f4ff 0%, #d6e3ff 100%)",
        }}
      >
        <Box
          sx={{
            p: 6,
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(20px)",
            borderRadius: 4,
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
            maxWidth: 500,
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
            Authentication Required
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
            Please sign in to access the loan application portal
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/login")}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 3,
              background: "linear-gradient(90deg, #4361ee 0%, #3a0ca3 100%)",
              textTransform: "none",
              fontSize: "1rem",
            }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, #f8f9ff 0%, #e6ecff 100%)",
        py: 8,
        px: 2,
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box
            sx={{
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(16px)",
              borderRadius: 4,
              boxShadow: "0 16px 40px rgba(0, 0, 0, 0.08)",
              p: { xs: 3, md: 5 },
              border: "1px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ mb: 4 }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                <FileText size={28} weight="fill" />
              </Box>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    background:
                      "linear-gradient(90deg, #4361ee 0%, #3a0ca3 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Loan Application
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Complete your application in just a few steps
                </Typography>
              </Box>
            </Stack>

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => handleFocus("name")}
                    onBlur={handleBlur}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <User
                          size={20}
                          color={activeField === "name" ? "#4361ee" : "#64748b"}
                          style={{ marginRight: 12 }}
                        />
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        border:
                          activeField === "name"
                            ? "2px solid #4361ee"
                            : "1px solid #e2e8f0",
                        transition: "all 0.3s ease",
                        backgroundColor:
                          activeField === "name"
                            ? "rgba(67, 97, 238, 0.05)"
                            : "transparent",
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Profession"
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    onFocus={() => handleFocus("profession")}
                    onBlur={handleBlur}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <Briefcase
                          size={20}
                          color={
                            activeField === "profession" ? "#4361ee" : "#64748b"
                          }
                          style={{ marginRight: 12 }}
                        />
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        border:
                          activeField === "profession"
                            ? "2px solid #4361ee"
                            : "1px solid #e2e8f0",
                        transition: "all 0.3s ease",
                        backgroundColor:
                          activeField === "profession"
                            ? "rgba(67, 97, 238, 0.05)"
                            : "transparent",
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Loan Purpose"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    onFocus={() => handleFocus("purpose")}
                    onBlur={handleBlur}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <FileText
                          size={20}
                          color={
                            activeField === "purpose" ? "#4361ee" : "#64748b"
                          }
                          style={{ marginRight: 12 }}
                        />
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        border:
                          activeField === "purpose"
                            ? "2px solid #4361ee"
                            : "1px solid #e2e8f0",
                        transition: "all 0.3s ease",
                        backgroundColor:
                          activeField === "purpose"
                            ? "rgba(67, 97, 238, 0.05)"
                            : "transparent",
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Loan Amount (₹)"
                    name="loanAmount"
                    type="number"
                    value={formData.loanAmount}
                    onChange={handleChange}
                    onFocus={() => handleFocus("loanAmount")}
                    onBlur={handleBlur}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <CurrencyDollar
                          size={20}
                          color={
                            activeField === "loanAmount" ? "#4361ee" : "#64748b"
                          }
                          style={{ marginRight: 12 }}
                        />
                      ),
                      inputProps: { min: 1000 },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        border:
                          activeField === "loanAmount"
                            ? "2px solid #4361ee"
                            : "1px solid #e2e8f0",
                        transition: "all 0.3s ease",
                        backgroundColor:
                          activeField === "loanAmount"
                            ? "rgba(67, 97, 238, 0.05)"
                            : "transparent",
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Credit Score"
                    name="creditScore"
                    type="number"
                    value={formData.creditScore}
                    onChange={handleChange}
                    onFocus={() => handleFocus("creditScore")}
                    onBlur={handleBlur}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <CreditCard
                          size={20}
                          color={
                            activeField === "creditScore"
                              ? "#4361ee"
                              : "#64748b"
                          }
                          style={{ marginRight: 12 }}
                        />
                      ),
                      inputProps: { min: 300, max: 850 },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        border:
                          activeField === "creditScore"
                            ? "2px solid #4361ee"
                            : "1px solid #e2e8f0",
                        transition: "all 0.3s ease",
                        backgroundColor:
                          activeField === "creditScore"
                            ? "rgba(67, 97, 238, 0.05)"
                            : "transparent",
                      },
                    }}
                  />
                  <Box sx={{ mt: 1, ml: 1 }}>
                    <Chip
                      label="Minimum score: 600"
                      size="small"
                      sx={{
                        borderRadius: 2,
                        background: "rgba(239, 68, 68, 0.1)",
                        color: "#ef4444",
                        fontWeight: 500,
                      }}
                    />
                  </Box>
                </Grid>

                {/* File Uploads */}
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 2, fontWeight: 600 }}
                  >
                    Required Documents
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box
                    onClick={() => fileInputRefs.pfAccountPdf.current?.click()}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      border: files.pfAccountPdf
                        ? "2px solid #10b981"
                        : "2px dashed #94a3b8",
                      backgroundColor: files.pfAccountPdf
                        ? "rgba(16, 185, 129, 0.05)"
                        : "rgba(241, 245, 249, 0.5)",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      "&:hover": {
                        borderColor: files.pfAccountPdf ? "#10b981" : "#6366f1",
                        backgroundColor: files.pfAccountPdf
                          ? "rgba(16, 185, 129, 0.08)"
                          : "rgba(241, 245, 249, 0.8)",
                      },
                      position: "relative",
                    }}
                  >
                    <input
                      type="file"
                      name="pfAccountPdf"
                      accept=".pdf"
                      onChange={handleFileChange}
                      ref={fileInputRefs.pfAccountPdf}
                      style={{ display: "none" }}
                      required={!files.pfAccountPdf}
                    />
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
                          background: files.pfAccountPdf
                            ? "rgba(16, 185, 129, 0.1)"
                            : "rgba(99, 102, 241, 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Upload
                          size={24}
                          color={files.pfAccountPdf ? "#10b981" : "#6366f1"}
                        />
                      </Box>
                      <Box>
                        <Typography variant="body1" fontWeight={500}>
                          PF Account Statement
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {files.pfAccountPdf
                            ? files.pfAccountPdf.name
                            : "PDF file (max 5MB)"}
                        </Typography>
                      </Box>
                    </Stack>
                    {files.pfAccountPdf && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile("pfAccountPdf");
                        }}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          color: "error.main",
                        }}
                      >
                        <X size={20} />
                      </IconButton>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box
                    onClick={() => fileInputRefs.salarySlip.current?.click()}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      border: files.salarySlip
                        ? "2px solid #10b981"
                        : "2px dashed #94a3b8",
                      backgroundColor: files.salarySlip
                        ? "rgba(16, 185, 129, 0.05)"
                        : "rgba(241, 245, 249, 0.5)",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      "&:hover": {
                        borderColor: files.salarySlip ? "#10b981" : "#6366f1",
                        backgroundColor: files.salarySlip
                          ? "rgba(16, 185, 129, 0.08)"
                          : "rgba(241, 245, 249, 0.8)",
                      },
                      position: "relative",
                    }}
                  >
                    <input
                      type="file"
                      name="salarySlip"
                      accept=".pdf"
                      onChange={handleFileChange}
                      ref={fileInputRefs.salarySlip}
                      style={{ display: "none" }}
                      required={!files.salarySlip}
                    />
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
                          background: files.salarySlip
                            ? "rgba(16, 185, 129, 0.1)"
                            : "rgba(99, 102, 241, 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Upload
                          size={24}
                          color={files.salarySlip ? "#10b981" : "#6366f1"}
                        />
                      </Box>
                      <Box>
                        <Typography variant="body1" fontWeight={500}>
                          Salary Slip
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {files.salarySlip
                            ? files.salarySlip.name
                            : "PDF file (max 5MB)"}
                        </Typography>
                      </Box>
                    </Stack>
                    {files.salarySlip && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile("salarySlip");
                        }}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          color: "error.main",
                        }}
                      >
                        <X size={20} />
                      </IconButton>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      size="large"
                      disabled={loading}
                      sx={{
                        mt: 2,
                        py: 1.5,
                        borderRadius: 3,
                        background:
                          "linear-gradient(90deg, #4361ee 0%, #3a0ca3 100%)",
                        fontSize: "1rem",
                        fontWeight: 600,
                        textTransform: "none",
                        boxShadow: "0 4px 14px rgba(67, 97, 238, 0.3)",
                        "&:hover": {
                          boxShadow: "0 6px 20px rgba(67, 97, 238, 0.4)",
                        },
                      }}
                    >
                      {loading ? (
                        <>
                          <CircularProgress
                            size={24}
                            color="inherit"
                            sx={{ mr: 2 }}
                          />
                          Processing...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </Button>
                  </motion.div>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}

export default LoanApplication;

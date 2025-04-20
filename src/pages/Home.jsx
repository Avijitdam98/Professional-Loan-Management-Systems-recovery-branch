import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  Container,
  Grid,
  IconButton,
  ListItemIcon,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Images (ensure these exist in src/assets/)
import Avatar1 from "../assets/avatar1.png";
import Avatar2 from "../assets/avatar2.png";
import Avatar3 from "../assets/avatar3.png";
import HeroImage from "../assets/hero-image-1.png";
import HeroImage3 from "../assets/hero-image-3.png";
import HeroImage2 from "../assets/hero-image.png";

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-8px)",
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #002D62 30%, #F9B233 90%)",
  border: 0,
  color: "white",
  height: 48,
  padding: "0 30px",
  boxShadow: "0 3px 5px 2px rgba(0, 45, 98, .3)",
  "&:hover": {
    background: "linear-gradient(45deg, #F9B233 30%, #002D62 90%)",
  },
}));

const AnimatedContainer = styled(motion.div)({
  width: "100%",
});

// Add new styled components for the carousel
const CarouselContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  height: "500px",
  overflow: "hidden",
  borderRadius: "20px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  backgroundColor: "#f5f5f5",
  margin: "20px 0",
  [theme.breakpoints.down("sm")]: {
    height: "300px",
  },
}));

const CarouselImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
  position: "absolute",
  top: 0,
  left: 0,
  opacity: 1,
  transition: "opacity 0.5s ease-in-out",
});

const CarouselContent = styled(Box)({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  padding: "20px",
  background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
  color: "white",
  zIndex: 2,
});

const CarouselDot = styled(Box)(({ active }) => ({
  width: "12px",
  height: "12px",
  borderRadius: "50%",
  backgroundColor: active ? "#F9B233" : "#fff",
  margin: "0 6px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.2)",
  },
}));

// Add new styled component for testimonial carousel
const TestimonialCarousel = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  padding: theme.spacing(4, 0),
  "& .MuiPaper-root": {
    padding: theme.spacing(4),
    margin: theme.spacing(0, 2),
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    transition: "transform 0.3s ease-in-out",
    "&:hover": {
      transform: "translateY(-8px)",
    },
  },
}));

const CarouselButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  backgroundColor: "rgba(0, 45, 98, 0.8)",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#F9B233",
  },
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

// Update hero content with online images
const heroContent = [
  {
    image: "https://img.freepik.com/free-photo/business-people-shaking-hands-together_53876-30568.jpg",
    title: "Easy Loan Application",
    subtitle: "Quick and hassle-free loan application process",
    description:
      "Apply for loans with just a few clicks. Our streamlined process makes it simple to get the financial support you need.",
  },
  {
    image: "https://img.freepik.com/free-photo/financial-data-concept_53876-124672.jpg",
    title: "Track Your Loans",
    subtitle: "Real-time loan tracking and management",
    description:
      "Monitor your loan status, EMI payments, and documents all in one place.",
  },
  {
    image: "https://img.freepik.com/free-photo/business-people-discussing-charts_53876-102975.jpg",
    title: "Smart EMI Calculator",
    subtitle: "Plan your finances with precision",
    description:
      "Use our advanced EMI calculator to plan your loan payments and make informed decisions.",
  },
];

function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Hero Carousel State with enhanced transitions
  const [currentHero, setCurrentHero] = useState(0);
  const [direction, setDirection] = useState(0);

  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState(50000);
  const [interestRate, setInterestRate] = useState(10);
  const [loanTenure, setLoanTenure] = useState(12);
  const [emi, setEmi] = useState(0);

  // Add testimonial carousel state
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentHero((prev) => (prev + 1) % heroContent.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroContent.length]);

  // EMI Calculation Function
  const calculateEmi = () => {
    const principal = parseFloat(loanAmount);
    const rateOfInterest = parseFloat(interestRate) / 12 / 100;
    const tenureInMonths = parseFloat(loanTenure);

    const emi =
      (principal *
        rateOfInterest *
        Math.pow(1 + rateOfInterest, tenureInMonths)) /
      (Math.pow(1 + rateOfInterest, tenureInMonths) - 1);
    setEmi(emi.toFixed(2));
  };

  // Eligibility Criteria Data
  const eligibility = [
    { icon: <CheckCircleIcon color="primary" />, text: "Indian Resident" },
    { icon: <CheckCircleIcon color="primary" />, text: "Age 21 to 60 years" },
    { icon: <CheckCircleIcon color="primary" />, text: "Stable Income Source" },
    { icon: <CheckCircleIcon color="primary" />, text: "Valid KYC Documents" },
    { icon: <CheckCircleIcon color="primary" />, text: "Good Credit History" },
  ];

  // Update testimonials with online avatar images
  const testimonials = [
    {
      avatar: "https://i.pravatar.cc/150?img=1",
      name: "Anil Kumar",
      text: "Sundaram's quick process helped me get my dream car! Highly recommended.",
    },
    {
      avatar: "https://i.pravatar.cc/150?img=5",
      name: "Priya Sharma",
      text: "The EMI calculator is so easy and transparent. Loved the experience!",
    },
    {
      avatar: "https://i.pravatar.cc/150?img=3",
      name: "Ravi Menon",
      text: "Excellent customer service and support. Sundaram is trustworthy.",
    },
  ];

  // FAQ Data
  const faqs = [
    {
      title: "How do I apply for a loan?",
      desc: "You can apply online through our portal or visit any Sundaram Finance branch.",
    },
    {
      title: "What documents are required?",
      desc: "Basic KYC documents, proof of income, and address proof are required.",
    },
    {
      title: "How is EMI calculated?",
      desc: "EMI is calculated based on the principal, interest rate, and tenure.",
    },
  ];

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const handleNextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f4f7fb",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Enhanced Hero Section with Modern Carousel */}
      <Container
        sx={{
          py: { xs: 6, md: 10 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            >
              <Typography
                variant="h2"
                gutterBottom
                sx={{
                  color: "#002D62",
                  fontWeight: 800,
                  letterSpacing: 1,
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  lineHeight: 1.2,
                  mb: 2,
                }}
              >
                {heroContent[currentHero].title}
              </Typography>
              <Typography
                variant="h5"
                paragraph
                sx={{
                  color: "#F9B233",
                  fontWeight: 600,
                  mb: 2,
                  fontSize: { xs: "1.1rem", md: "1.3rem" },
                }}
              >
                {heroContent[currentHero].subtitle}
              </Typography>
              <Typography
                variant="body1"
                paragraph
                sx={{
                  color: "#666",
                  mb: 4,
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  lineHeight: 1.6,
                }}
              >
                {heroContent[currentHero].description}
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <GradientButton component={Link} to="/apply" size="large">
                  Apply Now
                </GradientButton>
                <Button
                  variant="outlined"
                  size="large"
                  component={Link}
                  to="/contact"
                  sx={{
                    borderColor: "#002D62",
                    color: "#002D62",
                    "&:hover": {
                      borderColor: "#F9B233",
                      backgroundColor: "rgba(249, 178, 51, 0.1)",
                    },
                  }}
                >
                  Learn More
                </Button>
              </Box>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <CarouselContainer>
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentHero}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <CarouselImage
                    src={heroContent[currentHero].image}
                    alt={heroContent[currentHero].title}
                    loading="eager"
                  />
                  <CarouselContent>
                    <Typography variant="h4" gutterBottom>
                      {heroContent[currentHero].title}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      {heroContent[currentHero].subtitle}
                    </Typography>
                    <Typography variant="body1">
                      {heroContent[currentHero].description}
                    </Typography>
                  </CarouselContent>
                </motion.div>
              </AnimatePresence>
              <Box
                sx={{
                  position: "absolute",
                  bottom: 20,
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  gap: 1,
                  zIndex: 2,
                }}
              >
                {heroContent.map((_, index) => (
                  <CarouselDot
                    key={index}
                    active={currentHero === index}
                    onClick={() => {
                      setDirection(index > currentHero ? 1 : -1);
                      setCurrentHero(index);
                    }}
                  />
                ))}
              </Box>
            </CarouselContainer>
          </Grid>
        </Grid>
      </Container>

      {/* Enhanced EMI Calculator Section */}
      <Box
        sx={{
          py: 8,
          backgroundColor: "#ffffff",
          width: "100%",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "100%",
            background:
              "linear-gradient(45deg, rgba(0,45,98,0.05) 0%, rgba(249,178,51,0.05) 100%)",
            zIndex: 0,
          },
        }}
      >
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h3"
              align="center"
              gutterBottom
              sx={{
                color: "#002D62",
                fontWeight: 700,
                mb: 4,
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -10,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 100,
                  height: 3,
                  backgroundColor: "#F9B233",
                },
              }}
            >
              EMI Calculator
            </Typography>
          </motion.div>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={8}>
              <StyledCard sx={{ p: 4, boxShadow: 3, borderRadius: 4 }}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <Typography
                      variant="subtitle1"
                      sx={{ mb: 1, fontWeight: 600 }}
                    >
                      Loan Amount (₹)
                    </Typography>
                    <input
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "2px solid #e0e0e0",
                        fontSize: "1rem",
                        transition: "all 0.3s ease",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography
                      variant="subtitle1"
                      sx={{ mb: 1, fontWeight: 600 }}
                    >
                      Interest Rate (%)
                    </Typography>
                    <input
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "2px solid #e0e0e0",
                        fontSize: "1rem",
                        transition: "all 0.3s ease",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography
                      variant="subtitle1"
                      sx={{ mb: 1, fontWeight: 600 }}
                    >
                      Tenure (months)
                    </Typography>
                    <input
                      type="number"
                      value={loanTenure}
                      onChange={(e) => setLoanTenure(Number(e.target.value))}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "2px solid #e0e0e0",
                        fontSize: "1rem",
                        transition: "all 0.3s ease",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ textAlign: "center", mt: 2 }}>
                    <GradientButton
                      onClick={calculateEmi}
                      sx={{
                        px: 6,
                        py: 1.5,
                        fontSize: "1.1rem",
                      }}
                    >
                      Calculate EMI
                    </GradientButton>
                  </Grid>
                  {emi > 0 && (
                    <Grid item xs={12}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Typography
                          variant="h5"
                          sx={{
                            textAlign: "center",
                            mt: 3,
                            color: "#002D62",
                            fontWeight: 600,
                          }}
                        >
                          Your Monthly EMI: ₹{emi}
                        </Typography>
                      </motion.div>
                    </Grid>
                  )}
                </Grid>
              </StyledCard>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Enhanced Eligibility Criteria Section */}
      <Box
        sx={{
          py: 8,
          backgroundColor: "#f9fafc",
          width: "100%",
          position: "relative",
        }}
      >
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{
                color: "#002D62",
                fontWeight: 700,
                mb: 6,
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -10,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 100,
                  height: 3,
                  backgroundColor: "#F9B233",
                },
              }}
            >
              Eligibility Criteria
            </Typography>
          </motion.div>
          <Grid container spacing={4} justifyContent="center">
            {eligibility.map((item, idx) => (
              <Grid item xs={12} sm={6} md={2.4} key={idx}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <StyledCard
                    sx={{
                      p: 3,
                      textAlign: "center",
                      boxShadow: 3,
                      borderRadius: 4,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        justifyContent: "center",
                        mb: 2,
                        "& svg": {
                          fontSize: "2.5rem",
                        },
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: "#002D62",
                      }}
                    >
                      {item.text}
                    </Typography>
                  </StyledCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Enhanced Testimonials Section with Carousel */}
      <Box sx={{ py: 8, width: "100%", backgroundColor: "#fff" }}>
        <Container>
            <Typography
            variant="h3"
              align="center"
              gutterBottom
              sx={{
                color: "#002D62",
                fontWeight: 700,
                mb: 6,
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -10,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 100,
                  height: 3,
                  backgroundColor: "#F9B233",
                },
              }}
            >
              What Our Customers Say
            </Typography>
          <TestimonialCarousel>
            <CarouselButton onClick={handlePrevTestimonial} sx={{ left: 0 }}>
              <ArrowBackIosNewIcon />
            </CarouselButton>
          <Grid container spacing={4} justifyContent="center">
              {testimonials.map((testimonial, index) => (
                <Grid item xs={12} md={4} key={index}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: currentTestimonial === index ? 1 : 0.5,
                      y: currentTestimonial === index ? 0 : 20,
                      scale: currentTestimonial === index ? 1 : 0.9,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <Paper elevation={3}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        overflow: "hidden",
                          margin: "0 auto",
                          mb: 2,
                        border: "3px solid #F9B233",
                      }}
                    >
                      <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                      <Typography variant="h6" sx={{ color: "#002D62", mb: 1 }}>
                        {testimonial.name}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#666",
                        fontStyle: "italic",
                          mb: 2,
                      }}
                    >
                        "{testimonial.text}"
                    </Typography>
                    </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
            <CarouselButton onClick={handleNextTestimonial} sx={{ right: 0 }}>
              <ArrowForwardIosIcon />
            </CarouselButton>
          </TestimonialCarousel>
        </Container>
      </Box>

      {/* Enhanced FAQ Section */}
      <Box
        sx={{
          py: 8,
          backgroundColor: "#f9fafc",
          width: "100%",
          position: "relative",
        }}
      >
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{
                color: "#002D62",
                fontWeight: 700,
                mb: 6,
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -10,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 100,
                  height: 3,
                  backgroundColor: "#F9B233",
                },
              }}
            >
              Frequently Asked Questions
            </Typography>
          </motion.div>
          <Grid container spacing={4} justifyContent="center">
            {faqs.map((faq, index) => (
              <Grid item xs={12} md={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Accordion
                    sx={{
                      borderRadius: "8px !important",
                      mb: 2,
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      "&:before": {
                        display: "none",
                      },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ color: "#002D62" }} />}
                      aria-controls={`panel${index + 1}-content`}
                      id={`panel${index + 1}-header`}
                      sx={{
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        "&.Mui-expanded": {
                          borderBottom: "1px solid #e0e0e0",
                        },
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#002D62",
                          fontWeight: 600,
                        }}
                      >
                        {faq.title}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{
                        backgroundColor: "#f9fafc",
                        borderRadius: "0 0 8px 8px",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#444",
                          lineHeight: 1.6,
                        }}
                      >
                        {faq.desc}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Modern Footer */}
      <Box
        component="footer"
        sx={{
          backgroundColor: "#002D62",
          color: "#fff",
          py: 6,
          width: "100%",
          mt: "auto",
        }}
      >
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ color: "#F9B233", mb: 2 }}>
                About Us
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Sundaram Finance is a leading financial services provider,
                committed to helping individuals and businesses achieve their
                financial goals.
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Link href="#" style={{ color: "#fff" }}>
                  <img
                    src="/facebook.svg"
                    alt="Facebook"
                    style={{ width: 24, height: 24 }}
                  />
                </Link>
                <Link href="#" style={{ color: "#fff" }}>
                  <img
                    src="/twitter.svg"
                    alt="Twitter"
                    style={{ width: 24, height: 24 }}
                  />
                </Link>
                <Link href="#" style={{ color: "#fff" }}>
                  <img
                    src="/linkedin.svg"
                    alt="LinkedIn"
                    style={{ width: 24, height: 24 }}
                  />
                </Link>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ color: "#F9B233", mb: 2 }}>
                Quick Links
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Link
                  href="/about"
                  style={{ color: "#fff", textDecoration: "none" }}
                >
                  About Us
                </Link>
                <Link
                  href="/services"
                  style={{ color: "#fff", textDecoration: "none" }}
                >
                  Our Services
                </Link>
                <Link
                  href="/contact"
                  style={{ color: "#fff", textDecoration: "none" }}
                >
                  Contact Us
                </Link>
                <Link
                  href="/careers"
                  style={{ color: "#fff", textDecoration: "none" }}
                >
                  Careers
                </Link>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ color: "#F9B233", mb: 2 }}>
                Contact Info
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                21, Patullos Road, Chennai - 600002
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Phone: +91 44 2345 6789
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Email: info@sundaramfinance.com
              </Typography>
            </Grid>
          </Grid>
          <Box
                sx={{
              borderTop: "1px solid rgba(255,255,255,0.1)",
              mt: 4,
              pt: 4,
              textAlign: "center",
                }}
              >
            <Typography variant="body2">
              © {new Date().getFullYear()} Sundaram Finance. All rights
              reserved.
              </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default Home; 

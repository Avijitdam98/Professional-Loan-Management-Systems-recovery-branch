import { Box, Typography, Container, Link } from "@mui/material";
import { Facebook, Twitter, LinkedIn } from "@mui/icons-material";

function Footer() {
  return (
    <Box sx={{ bgcolor: "grey.900", color: "white", py: 4, mt: "auto" }}>
      <Container>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography variant="h6">Sundaram Finance</Typography>
            <Typography variant="body2">
              Leading with trust and reliability.
            </Typography>
          </Box>
          <Box sx={{ textAlign: { xs: "center", md: "right" } }}>
            <Typography variant="body2">
              Contact: support@sundaramfinance.com
            </Typography>
            <Typography variant="body2">
              © 2025 Sundaram Finance. All rights reserved.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Link href="https://www.facebook.com" color="inherit" sx={{ mx: 1 }}>
                <Facebook />
              </Link>
              <Link href="https://www.twitter.com" color="inherit" sx={{ mx: 1 }}>
                <Twitter />
              </Link>
              <Link href="https://www.linkedin.com" color="inherit" sx={{ mx: 1 }}>
                <LinkedIn />
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;


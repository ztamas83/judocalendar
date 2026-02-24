import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "~/services/auth-provider";
import { useUserData } from "~/services/user-data-hook";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
} from "@mui/material";

export default function Header() {
  const { logout, user } = useAuth();
  const { isLoggedIn, userData, setUserdata } = useUserData();
  const isAdminUser = useMemo(() => userData?.role == "admin", [userData]);
  const navigate = useNavigate();

  const pages = [
    { label: "Trainings", path: "/trainings" },
    { label: "Techniques", path: "/techniques" },
  ];
  const userSettings = ["Profile", "Logout"];
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handlePageNavigation = (path: string) => {
    setAnchorElNav(null);
    navigate(path);
  };

  const handleCloseUserMenu = (target: string) => {
    setAnchorElUser(null);
    navigate(`/${target.toLowerCase()}`);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box className="grow flex items-center gap-2 md:hidden">
            {/* this is hidden on a desktop, but visible on mobile to open the menu */}
            <Menu
              id="menu-appbar"
              className="block"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.label}
                  className="header-button"
                  onClick={() => handlePageNavigation(page.path)}
                >
                  <Typography className="text-center">{page.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box className="grow flex items-center gap-2 xs:hidden">
            {/* this is hidden on a mobile, but visible on desktop to open the menu */}
            {pages.map((page) => (
              <Button
                key={page.label}
                color="inherit"
                onClick={() => handlePageNavigation(page.path)}
                className="header-button"
              >
                {page.label}
              </Button>
            ))}
          </Box>

          {isLoggedIn && (
            <Box className="flex items-center gap-2">
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} className="p-0">
                  <Avatar
                    alt={user?.displayName ?? ""}
                    src={user?.photoURL ?? ""}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                className="margin-top-45px"
                id="menu-appbar"
                anchorEl={anchorElUser}
                slotProps={{
                  paper: {
                    className: "bg-primary text-primary-foreground mt-1",
                  },
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {userSettings.map((setting) => (
                  <MenuItem
                    key={setting}
                    className="header-button"
                    onClick={() => handleCloseUserMenu(setting)}
                  >
                    <Typography className="text-center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

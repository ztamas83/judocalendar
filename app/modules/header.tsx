import { u } from "node_modules/react-router/dist/development/index-react-server-client-DRhjXpk2.mjs";
import { useContext, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "~/services/auth-provider";
import { useUserData } from "~/services/user-data-hook";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { MenuIcon } from "lucide-react";
import siteLogo from "~images/site_logo.png";

export default function Header() {
  const { logout, user } = useAuth();
  const { isLoggedIn, userData, setUserdata } = useUserData();
  const isAdminUser = useMemo(() => userData?.role == "admin", [userData]);
  const navigate = useNavigate();

  const pages = ["Trainings", "Techniques"];
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

  const handleCloseUserMenu = (target: string) => {
    setAnchorElUser(null);
    navigate(`/${target.toLowerCase()}`);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <img alt="Logo" src={siteLogo} className="h-10 mr-2" />
          {/* <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LOGO
          </Typography> */}

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
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
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography sx={{ textAlign: "center" }}>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>
          {isLoggedIn && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={user?.displayName} src={user?.photoURL || ""} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {userSettings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => handleCloseUserMenu(setting)}
                  >
                    <Typography sx={{ textAlign: "center" }}>
                      {setting}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
  // return (
  //   <header className="bg-gray-800 text-white p-4">
  //     <nav className="container mx-auto flex items-center justify-between">
  //       <div className="flex items-center space-x-6">
  //         <Link to="/" className="text-xl font-bold">
  //           JudoCalendar
  //         </Link>
  //         {user ? (
  //           <Link
  //             to="/profile"
  //             className="hover:text-gray-500 transition-colors"
  //           >
  //             My Profile
  //           </Link>
  //         ) : null}
  //         <Link
  //           to="/trainings"
  //           className="hover:text-gray-500 transition-colors"
  //         >
  //           Trainings
  //         </Link>
  //         <Link
  //           to="/techniques"
  //           className="hover:text-gray-500 transition-colors disabled:opacity-50 "
  //         >
  //           Techniques
  //         </Link>

  //         <Link
  //           to="/admin"
  //           className="hover:text-gray-500 transition-colors disabled:opacity-50 "
  //         >
  //           Techniques
  //         </Link>
  //         {isAdminUser ? (
  //           <Link to="/admin" className="hover:text-gray-500 transition-colors">
  //             {" "}
  //             Admin{" "}
  //           </Link>
  //         ) : null}
  //       </div>
  //       <div className="flex items-center space-x-4">
  //         {user ? (
  //           <div className="flex items-center space-x-2">
  //             <img
  //               src={user.photoURL}
  //               alt={user.displayName}
  //               className="border rounded-full h-10"
  //             />
  //             <button
  //               onClick={logout}
  //               className="text-xs rounded-md bg-red-600 p-1"
  //             >
  //               Logout
  //             </button>
  //           </div>
  //         ) : null}
  //         {/* <span>{user?.displayName}</span>
  //         <Link
  //           to="/logout"
  //           className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition-colors"
  //         >
  //           Logout
  //         </Link> */}
  //       </div>
  //     </nav>
  //   </header>
  // );
}

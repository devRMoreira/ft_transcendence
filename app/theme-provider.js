"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  "palette": {
    "mode": "dark",
    "primary": {
      "main": "#605dff"
    },
    "secondary": {
      "main": "#f43098"
    },
    "error": {
      "main": "#ff627d"
    },
    "warning": {
      "main": "#fcb700"
    },
    "info": {
      "main": "#00bafe"
    },
    "success": {
      "main": "#00d390"
    },
    "background": {
      "default": "#191e24",
      "paper": "#1d232a"
    },
    "divider": "rgba(21, 25, 30, 0.14)",
    "text": {
      "primary": "rgba(236, 249, 255, 0.87)",
      "secondary": "rgba(236, 249, 255, 0.72)"
    },
    "action": {
      "active": "rgba(236, 249, 255, 0.54)",
      "hover": "rgba(236, 249, 255, 0.04)",
      "selected": "rgba(236, 249, 255, 0.08)",
      "disabled": "rgba(236, 249, 255, 0.26)",
      "disabledBackground": "rgba(236, 249, 255, 0.12)",
      "focus": "rgba(236, 249, 255, 0.12)"
    }
  },
  "typography": {
    "fontFamily": "\"Be Vietnam Pro\", \"Helvetica Neue\", Arial, sans-serif",
    "fontSize": 14,
    "h1": {
      "fontFamily": "\"Be Vietnam Pro\", \"Helvetica Neue\", Arial, sans-serif",
      "fontWeight": 300,
      "fontSize": "6rem",
      "lineHeight": 1.167,
      "letterSpacing": "-0.01562em"
    },
    "h2": {
      "fontFamily": "\"Be Vietnam Pro\", \"Helvetica Neue\", Arial, sans-serif",
      "fontWeight": 300,
      "fontSize": "3.75rem",
      "lineHeight": 1.2,
      "letterSpacing": "-0.00833em"
    },
    "h3": {
      "fontFamily": "\"Be Vietnam Pro\", \"Helvetica Neue\", Arial, sans-serif",
      "fontWeight": 400,
      "fontSize": "3rem",
      "lineHeight": 1.167,
      "letterSpacing": "0em"
    },
    "h4": {
      "fontFamily": "\"Be Vietnam Pro\", \"Helvetica Neue\", Arial, sans-serif",
      "fontWeight": 400,
      "fontSize": "2.125rem",
      "lineHeight": 1.235,
      "letterSpacing": "0.00735em"
    },
    "h5": {
      "fontFamily": "\"Be Vietnam Pro\", \"Helvetica Neue\", Arial, sans-serif",
      "fontWeight": 400,
      "fontSize": "1.5rem",
      "lineHeight": 1.334,
      "letterSpacing": "0em"
    },
    "h6": {
      "fontFamily": "\"Be Vietnam Pro\", \"Helvetica Neue\", Arial, sans-serif",
      "fontWeight": 500,
      "fontSize": "1.25rem",
      "lineHeight": 1.6,
      "letterSpacing": "0.0075em"
    }
  },
  "shape": {
    "borderRadius": 4
  },
  "components": {
    "MuiCard": {
      "styleOverrides": {
        "root": {
          "borderRadius": 8
        }
      }
    },
    "MuiDialog": {
      "styleOverrides": {
        "paper": {
          "borderRadius": 8
        }
      }
    },
    "MuiAlert": {
      "styleOverrides": {
        "root": {
          "borderRadius": 8
        }
      }
    },
    "MuiButton": {
      "styleOverrides": {
        "root": {
          "borderRadius": 4,
          "minHeight": 41,
          "paddingInline": 16
        },
        "outlined": {
          "borderWidth": 1
        }
      }
    },
    "MuiOutlinedInput": {
      "styleOverrides": {
        "root": {
          "borderRadius": 4
        },
        "input": {
          "paddingTop": 9,
          "paddingBottom": 9
        },
        "notchedOutline": {
          "borderWidth": 1
        }
      }
    },
    "MuiTabs": {
      "styleOverrides": {
        "root": {
          "minHeight": 41
        }
      }
    },
    "MuiTab": {
      "styleOverrides": {
        "root": {
          "minHeight": 41
        }
      }
    },
    "MuiChip": {
      "styleOverrides": {
        "root": {
          "borderRadius": 8,
          "height": 22,
          "fontSize": 11
        }
      }
    },
    "MuiBadge": {
      "styleOverrides": {
        "badge": {
          "borderRadius": 8,
          "minWidth": 22,
          "height": 22,
          "fontSize": 10
        }
      }
    },
    "MuiSwitch": {
      "styleOverrides": {
        "root": {
          "transform": "scale(0.92)",
          "transformOrigin": "left center"
        }
      }
    },
    "MuiCheckbox": {
      "styleOverrides": {
        "root": {
          "& .MuiSvgIcon-root": {
            "fontSize": 22
          }
        }
      }
    },
    "MuiRadio": {
      "styleOverrides": {
        "root": {
          "& .MuiSvgIcon-root": {
            "fontSize": 22
          }
        }
      }
    }
  }
});

export default function AppThemeProvider({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

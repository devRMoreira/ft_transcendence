import { Typography, Box } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

export const RANK_COLORS = {
  1: "#FFD700", 
  2: "#C0C0C0",
  3: "#CD7F32",
};

//defaults to trophy icon
export default function RankIcon({ rank, icon = <EmojiEventsIcon /> }) {
  if (rank <= 3 && rank >= 1) {
    return (
      <Box sx={{ color: RANK_COLORS[rank], display: "inline-flex", alignItems: "center" }}>
        {icon}
      </Box>
    )
  }

  return (
    <Typography variant="body2" sx={{ fontWeight: "bold", color: "text.secondary" }}>
      #{rank}
    </Typography>
  )
}
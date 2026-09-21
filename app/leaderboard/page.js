"use client";

import { Container, Box, Typography, Paper, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert, Stack } from "@mui/material";
import { fetchLeaderboard } from "@/services/leaderboard";
import { useEffect, useState } from "react";
import RankIcon from "@/components/RankIcon";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setError(null)
      const res = await fetchLeaderboard()

      if (res.error) {
        setError(res.error)
      } else {
        setLeaderboard(res.leaderboard)
      }
      setLoading(false)
    }

    loadData()
  }, [])

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 3,
          minHeight: "75dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <Stack>
            {/* Page Header */}
            <Typography component="h1" variant="h4" sx={{ mt: 1, p: 1.5, px: 5, fontWeight: "bold" }}>
              Leaderboard
            </Typography>

            <Divider variant="fullWidth" sx={{ borderBottomWidth: 2 }} />

            {/* 1. Loading State */}
            {loading && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress />
              </Box>
            )}

            {/* 2. Error State */}
            {!loading && error && (
              <Box sx={{ p: 3 }}>
                <Alert severity="error">{error}</Alert>
              </Box>
            )}

            {/* 3. Empty State */}
            {!loading && !error && leaderboard.length === 0 && (
              <Typography align="center" sx={{ py: 3, color: "text.secondary" }}>
                No qualified players on the leaderboard yet
              </Typography>
            )}

            {/* 4. Leaderboard Table */}
            {!loading && !error && leaderboard.length > 0 && (
              <TableContainer>
                <Table sx={{ minWidth: 350 }}>
                  <TableHead sx={{ backgroundColor: "background.lighter" }}>
                    <TableRow>
                      <TableCell align="center" sx={{ fontWeight: "bold", py: 1.5 }}>
                        Rank
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", py: 1.5 }}>Player</TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold", py: 1.5 }}>
                        Points
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold", py: 1.5 }}>
                        Win Rate
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold", py: 1.5 }}>
                        Wins / Losses
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {leaderboard.map((player) => {
                      const isTopThree = player.rank <= 3;
                      return (
                        <TableRow
                          key={player.id}
                          hover
                          sx={{
                            backgroundColor: isTopThree ? "action.hover" : "inherit",
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell align="center">
                            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                              <RankIcon rank={player.rank}/>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            {player.name}
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: "bold", color: "primary.main" }}>
                            {player.points}
                          </TableCell>
                          <TableCell align="center">
                            {player.winRate}%
                          </TableCell>
                          <TableCell align="right">
                            {player.wins}W - {player.losses}L
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
}
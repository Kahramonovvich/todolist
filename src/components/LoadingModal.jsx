"use client";
import { Modal, Box, CircularProgress, Typography } from "@mui/material";
import { useMyContexts } from "@/app/layout";

export default function LoadingModal() {
    const { isLoading } = useMyContexts();

    return (
        <Modal
            open={isLoading}
            aria-labelledby="loading-modal"
            aria-describedby="loading-indicator"
            sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
            <Box
                sx={{
                    bgcolor: "background.paper",
                    p: 4,
                    borderRadius: 3,
                    boxShadow: 24,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                <CircularProgress size={60} />
                <Typography variant="h6" color="text.secondary">
                    Загрузка...
                </Typography>
            </Box>
        </Modal>
    );
};
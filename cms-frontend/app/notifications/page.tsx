"use client";

import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Chip,
  Divider,
  Select,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import { apiFetch } from "@/services/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

export default function NotificationsPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [notifications, setNotifications] =
    useState<any[]>([]);

  const [articleId, setArticleId] =
    useState("");
  const [recipients, setRecipients] =
    useState("");
  const [subject, setSubject] =
    useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const arts = await apiFetch("/articles");
    const notifs =
      await apiFetch("/notifications");

    setArticles(arts.data || []);
    setNotifications(notifs);
  };

  const selectedArticle = articles.find(
    (a) => a.id === articleId
  );

  const handleSend = async () => {
    const emails = recipients
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);

    await apiFetch("/notifications", {
      method: "POST",
      body: JSON.stringify({
        articleId,
        subject,
        recipients: emails,
      }),
    });

    setRecipients("");
    setSubject("");
    setArticleId("");

    load();
  };

  const columns: GridColDef[] = [
    {
      field: "articleId",
      headerName: "Article",
      flex: 1,
      valueGetter: (value) =>
        articles.find(
          (a) => a.id === value
        )?.title || value,
    },
    {
      field: "recipientCount",
      headerName: "Recipients",
      width: 120,
    },
    {
      field: "sentAt",
      headerName: "Date",
      width: 180,
      valueGetter: (value) =>
        new Date(value).toLocaleString(),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === "sent"
              ? "success"
              : "error"
          }
        />
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Notifications
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" mb={2}>
          Send Notification
        </Typography>

        <Select
          fullWidth
          value={articleId}
          onChange={(e) => {
            const id = e.target.value;
            setArticleId(id);
            const article =
              articles.find(
                (a) => a.id === id
              );
            if (article) {
              setSubject(
                `New article: ${article.title}`
              );
            }
          }}
        >
          {articles.map((a) => (
            <MenuItem
              key={a.id}
              value={a.id}
            >
              {a.title}
            </MenuItem>
          ))}
        </Select>

        <TextField
          label="Recipients (comma separated)"
          fullWidth
          margin="normal"
          value={recipients}
          onChange={(e) =>
            setRecipients(e.target.value)
          }
        />

        <TextField
          label="Subject"
          fullWidth
          margin="normal"
          value={subject}
          onChange={(e) =>
            setSubject(e.target.value)
          }
        />

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1">
          Email Preview
        </Typography>

        <Paper
          sx={{
            p: 2,
            mt: 1,
            background: "#f5f5f5",
          }}
        >
          <Typography variant="h6">
            {subject}
          </Typography>

          {selectedArticle && (
            <>
              <Typography mt={2}>
                {selectedArticle.content}
              </Typography>
            </>
          )}
        </Paper>

        <Button
          variant="contained"
          sx={{ mt: 2 }}
          disabled={!articleId || !recipients}
          onClick={handleSend}
        >
          Send Notification
        </Button>
      </Paper>

      <Typography variant="h6" mb={2}>
        History
      </Typography>

      <DataGrid
        rows={notifications}
        columns={columns}
        getRowId={(row) => row.id}
        autoHeight
      />
    </Box>
  );
}
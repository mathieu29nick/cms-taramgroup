"use client";

import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useState } from "react";
import { apiFetch } from "@/services/api";

interface ImportResult {
  success: number;
  errors: string[];
}

export default function ImportPage() {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState<any[]>([]);
  const [result, setResult] =
    useState<ImportResult | null>(null);
  const [error, setError] = useState("");

  const validateFormat = (data: any[]) => {
    const errors: string[] = [];

    data.forEach((item, index) => {
      if (!item.title)
        errors.push(`Row ${index + 1}: Missing title`);
      if (!item.content)
        errors.push(`Row ${index + 1}: Missing content`);
      if (!item.category)
        errors.push(`Row ${index + 1}: Missing category`);
      if (!item.network)
        errors.push(`Row ${index + 1}: Missing network`);
    });

    return errors;
  };

  const handleFile = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setError("");
    setResult(null);

    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      if (!Array.isArray(json)) {
        throw new Error(
          "JSON must be an array"
        );
      }

      const formatErrors =
        validateFormat(json);

      if (formatErrors.length > 0) {
        setResult({
          success: 0,
          errors: formatErrors,
        });
        return;
      }

      setPreview(json.slice(0, 5));
      setLoading(true);

      const res = await apiFetch(
        "/import/articles",
        {
          method: "POST",
          body: JSON.stringify(json),
        }
      );

      setResult({
        success: res.count || 0,
        errors: res.errors || [],
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Import Articles (JSON)
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Button
          variant="contained"
          component="label"
        >
          Upload JSON File
          <input
            type="file"
            hidden
            accept=".json"
            onChange={handleFile}
          />
        </Button>

        {fileName && (
          <Typography mt={2}>
            Selected file: {fileName}
          </Typography>
        )}

        {loading && (
          <Box mt={2}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {result && (
          <Box mt={3}>
            <Alert
              severity={
                result.errors.length > 0
                  ? "warning"
                  : "success"
              }
            >
              {result.success} articles imported
            </Alert>

            {result.errors.length > 0 && (
              <List>
                {result.errors.map(
                  (err, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={err}
                      />
                    </ListItem>
                  )
                )}
              </List>
            )}
          </Box>
        )}
      </Paper>

      {preview.length > 0 && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6">
            Preview (first 5)
          </Typography>

          <Paper sx={{ p: 2, mt: 2 }}>
            <pre>
              {JSON.stringify(
                preview,
                null,
                2
              )}
            </pre>
          </Paper>
        </>
      )}
    </Box>
  );
}
"use client";

import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Snackbar,
  Alert
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { apiFetch } from "@/services/api";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
} from "@mui/x-data-grid";

interface Category {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  color: string;
}

interface Article {
  id: string;
  categories: string[];
}

export default function CategoriesPage() {
  const role = useAppStore.getState().role;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({
    name: "",
    color: "#1976d2",
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const cats = await apiFetch("/categories");
    const arts = await apiFetch("/articles");
    setCategories(cats);
    setArticles(
      Array.isArray(arts?.data)
        ? arts.data
        : []
    );
  };

  const articleCount = (catId: string) =>
  Array.isArray(articles)
    ? articles.filter(
        (a) =>
          Array.isArray(a.categories) &&
          a.categories.includes(catId)
      ).length
    : 0;

  const handleSave = async () => {
    try{
      if (!form.name.trim()) return;

    if (editing) {
      await apiFetch(`/categories/${editing.id}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });
    } else {
      await apiFetch("/categories", {
        method: "POST",
        body: JSON.stringify(form),
      });
    }

    setOpen(false);
    setEditing(null);
    setForm({ name: "", color: "#1976d2" });
    load();
    } catch(error: any){
      setErrorMessage("Admin role required for this action!");
      setOpen(false);
      setForm({ name: "", color: "#1976d2" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiFetch(`/categories/${id}`, {
        method: "DELETE",
      });
      load();
    } catch {
      if(role === "editor"){
        setErrorMessage("Admin role required for this action!");
      }else{
        setErrorMessage("Category is used by articles");
      }
      
    }
  };

  const columns: GridColDef<Category>[] = [
    {
      field: "name",
      headerName: "Category",
      flex: 1,
      renderCell: (
        params: GridRenderCellParams<
          Category,
          string
        >
      ) => (
        <Chip
          label={params.value}
          sx={{
            backgroundColor: params.row.color,
            color: "#fff",
            fontWeight: 500,
          }}
        />
      ),
    },
    {
      field: "count",
      headerName: "Articles",
      width: 120,
      valueGetter: (_value, row) =>
        articleCount(row.id),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 220,
      sortable: false,
      renderCell: (
        params: GridRenderCellParams<
          Category
        >
      ) => (
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            onClick={() => {
              setEditing(params.row);
              setForm({
                name: params.row.name,
                color: params.row.color,
              });
              setOpen(true);
            }}
          >
            Edit
          </Button>

          <Button
            size="small"
            color="error"
            disabled={
              articleCount(params.row.id) > 0
            }
            onClick={() =>
              handleDelete(params.row.id)
            }
          >
            Delete
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Categories Management
      </Typography>

      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{ mb: 3 }}
      >
        Add Category
      </Button>

      <DataGrid
        rows={categories}
        columns={columns}
        getRowId={(row) => row.id}
        autoHeight
        pageSizeOptions={[5, 10]}
      />

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
      >
        <DialogTitle>
          {editing ? "Edit" : "Create"} Category
        </DialogTitle>

        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          <TextField
            type="color"
            fullWidth
            margin="normal"
            value={form.color}
            onChange={(e) =>
              setForm({
                ...form,
                color: e.target.value,
              })
            }
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              setEditing(null);
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={4000}
        onClose={() => setErrorMessage(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={() => setErrorMessage(null)}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
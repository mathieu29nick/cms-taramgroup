"use client";

import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  Button,
  Chip,
} from "@mui/material";
import {
  GridColDef,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/services/api";
import dynamic from "next/dynamic";
import { formatDate } from "@/utils/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";

const DataGrid = dynamic(
  () =>
    import("@mui/x-data-grid").then(
      (mod) => mod.DataGrid
    ),
  { ssr: false }
);

export default function ArticlesPage() {
  const router = useRouter();

  const [selectionModel, setSelectionModel] =
    useState<GridRowSelectionModel>({
      type: "include",
      ids: new Set(),
    });

  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [networks, setNetworks] = useState<any[]>([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>([]);
  const [network, setNetwork] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(false);

  useEffect(() => {
    apiFetch("/articles").then((res) => setArticles(res.data));
    apiFetch("/categories").then(setCategories);
    apiFetch("/networks").then(setNetworks);
  }, []);

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      return (
        (!status || a.status === status) &&
        (!network || a.network === network) &&
        (!featuredOnly || a.featured) &&
        (selectedCategories.length === 0 ||
          selectedCategories.every((cat) =>
            a.categories.includes(cat)
          )) &&
        (a.title.toLowerCase().includes(search.toLowerCase()) ||
          a.content
            .toLowerCase()
            .includes(search.toLowerCase()))
      );
    });
  }, [
    articles,
    search,
    status,
    selectedCategories,
    network,
    featuredOnly,
  ]);

  const handleDelete = async (id: string) => {
    await apiFetch(`/articles/${id}`, { method: "DELETE" });
    setArticles((prev) =>
      prev.filter((a) => a.id !== id)
    );
  };

  const changeStatus = async (
    id: string,
    newStatus: string
  ) => {
    await apiFetch(`/articles/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: newStatus }),
    });

    setArticles((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: newStatus }
          : a
      )
    );
  };

  const bulkArchive = async () => {
    const selectedIds = Array.from(
      selectionModel.ids
    );

    await Promise.all(
      selectedIds.map((id) =>
        apiFetch(`/articles/${id}/status`, {
          method: "PATCH",
          body: JSON.stringify({
            status: "archived",
          }),
        })
      )
    );

    setArticles((prev) =>
      prev.map((a) =>
        selectedIds.includes(a.id)
          ? { ...a, status: "archived" }
          : a
      )
    );

    setSelectionModel({
      type: "include",
      ids: new Set(),
    });
  };

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <Link
            href={`/articles/${params.row.id}`}
            style={{ textDecoration: "none" }}
          >
            <Typography
              color="primary"
              fontWeight={500}
              sx={{
                cursor: "pointer",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {params.value}
            </Typography>
          </Link>
        </Box>
      ),
    },
    {
      field: "createdAt",
      headerName: "Date",
      width: 130,
      valueGetter: (_value, row) =>
        formatDate(row.createdAt),
    },
    { field: "status", headerName: "Status", width: 130 },
    { field: "network", headerName: "Network", width: 130 },
    {
      field: "featured",
      headerName: "Featured",
      width: 120,
      renderCell: (params) =>
        params.value ? (
          <Chip label="Yes" color="primary" />
        ) : (
          "No"
        ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <Button
            size="small"
            variant="contained"
            onClick={() =>
              router.push(
                `/articles/${params.row.id}`
              )
            }
          >
            Edit
          </Button>

          <Button
            size="small"
            color="error"
            onClick={() =>
              handleDelete(params.row.id)
            }
          >
            Delete
          </Button>

          <Button
            size="small"
            onClick={() =>
              changeStatus(
                params.row.id,
                "archived"
              )
            }
          >
            Archive
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Articles Management
      </Typography>

      <Box
        display="flex"
        gap={2}
        flexWrap="wrap"
        mb={3}
      >
        <Button
          variant="contained"
          onClick={() => router.push("/articles/new")}
        >
          New Article
        </Button>
      </Box>

      <Box
        display="flex"
        gap={2}
        flexWrap="wrap"
        mb={3}
      >
        <TextField
          label="Search"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <FormControl sx={{ minWidth: 220 }}>
          <InputLabel>Categories</InputLabel>
          <Select
            multiple
            value={selectedCategories}
            label="Categories"
            onChange={(e) =>
              setSelectedCategories(
                e.target.value as string[]
              )
            }
            renderValue={(selected) =>
              (selected as string[])
                .map((id) => {
                  const cat = categories.find(
                    (c: any) => c.id === id
                  );
                  return cat?.name;
                })
                .join(", ")
            }
          >
            {categories.map((cat: any) => (
              <MenuItem key={cat.id} value={cat.id}>
                <Checkbox
                  checked={
                    selectedCategories.indexOf(cat.id) > -1
                  }
                />
                <ListItemText primary={cat.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            label="Status"
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="draft">
              Draft
            </MenuItem>
            <MenuItem value="published">
              Published
            </MenuItem>
            <MenuItem value="archived">
              Archived
            </MenuItem>
          </Select>
        </FormControl>

        <Button
          variant={
            featuredOnly
              ? "contained"
              : "outlined"
          }
          onClick={() =>
            setFeaturedOnly(!featuredOnly)
          }
        >
          Featured Only
        </Button>

        {selectionModel.ids.size > 0 && (
          <Button
            variant="contained"
            color="warning"
            onClick={bulkArchive}
          >
            Archive Selected (
            {selectionModel.ids.size})
          </Button>
        )}
      </Box>

      <DataGrid
        rows={filtered}
        columns={columns}
        getRowId={(row) => row.id}
        checkboxSelection
        pageSizeOptions={[20]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 20,
              page: 0,
            },
          },
        }}
        rowSelectionModel={selectionModel}
        onRowSelectionModelChange={(newSelection) =>
          setSelectionModel(newSelection)
        }
        autoHeight
      />
    </Box>
  );
}
"use client";

import {
  Box,
  Typography,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { apiFetch } from "@/services/api";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
} from "@mui/x-data-grid";

interface Network {
  id: string;
  name: string;
  color?: string;
}

interface Article {
  id: string;
  network: string;
}

export default function NetworksPage() {
  const [networks, setNetworks] = useState<Network[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const networksRes = await apiFetch("/networks");
    const articlesRes = await apiFetch("/articles");

    setNetworks(Array.isArray(networksRes) ? networksRes : []);
    setArticles(
      Array.isArray(articlesRes?.data)
        ? articlesRes.data
        : []
    );
  };

  const articleCount = (networkId: string) =>
    articles.filter(
      (a) => a.network === networkId
    ).length;

  const columns: GridColDef<Network>[] = [
    {
      field: "name",
      headerName: "Network",
      flex: 1,
      renderCell: (
        params: GridRenderCellParams<
          Network,
          string
        >
      ) => (
        <Chip
          label={params.value}
          sx={{
            backgroundColor:
              params.row.color || "#1976d2",
            color: "#fff",
            fontWeight: 500,
          }}
        />
      ),
    },
    {
      field: "count",
      headerName: "Articles",
      width: 150,
      valueGetter: (_value, row) =>
        articleCount(row.id),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Networks
      </Typography>

      <DataGrid
        rows={networks}
        columns={columns}
        getRowId={(row) => row.id}
        autoHeight
        pageSizeOptions={[5, 10]}
      />
    </Box>
  );
}
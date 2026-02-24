"use client";

import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/services/api";
import { useAppStore } from "@/stores/useAppStore";
import {
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Article {
  id: string;
  title: string;
  status: string;
  network: string;
  categories: string[];
  createdAt: string;
}

const PieChart = dynamic(
  () => import("recharts").then((mod) => mod.PieChart),
  { ssr: false }
);

export default function Dashboard() {
  const role = useAppStore((s) => s.role);

  const [articles, setArticles] =
    useState<Article[]>([]);
  const [categories, setCategories] =
    useState<any[]>([]);
  const [notifications, setNotifications] =
    useState<any[]>([]);
  const [networks, setNetworks] = 
    useState<any[]>([]);

  useEffect(() => {
    load();
  }, [role]);

  const load = async () => {
    const arts =
      await apiFetch("/articles");
    const cats =
      await apiFetch("/categories");
    const notifs =
      await apiFetch("/notifications");
    const networks = 
    await apiFetch("/networks");

    setNetworks(networks || []);
    setArticles(arts.data || []);
    setCategories(cats);
    setNotifications(notifs || []);
  };

  const total = articles.length;

  const byStatus = useMemo(() => {
    return {
      draft: articles.filter(
        (a) => a.status === "draft"
      ).length,
      published: articles.filter(
        (a) => a.status === "published"
      ).length,
      archived: articles.filter(
        (a) => a.status === "archived"
      ).length,
    };
  }, [articles]);

  const byNetwork = useMemo(() => {
    const map: Record<string, number> = {};
    articles.forEach((a) => {
      const networkName =
        networks.find((n) => n.id === a.network)
          ?.name || "Unknown";

      map[networkName] =
        (map[networkName] || 0) + 1;
    });

    return map;
  }, [articles, networks]);

  const categoryStats = useMemo(() => {
    const map: Record<string, number> =
      {};

    articles.forEach((article) => {
      article.categories?.forEach(
        (catId) => {
          map[catId] =
            (map[catId] || 0) + 1;
        }
      );
    });

    return categories.map((cat) => ({
      name: cat.name,
      value: map[cat.id] || 0,
      color: cat.color,
    }));
  }, [articles, categories]);

  const last5 = useMemo(() => {
    return articles
      .filter(
        (a) => a.status === "published"
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )
      .slice(0, 5);
  }, [articles]);

  const lastNotifications = useMemo(() => {
    return notifications
      .sort(
        (a, b) =>
          new Date(b.sentAt).getTime() -
          new Date(a.sentAt).getTime()
      )
      .slice(0, 5);
  }, [notifications]);

  return (
    <Box>
      <Typography variant="h4" mb={4}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Total Articles
              </Typography>
              <Typography variant="h4">
                {total}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography>
                Draft
              </Typography>
              <Typography variant="h5">
                {byStatus.draft}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography>
                Published
              </Typography>
              <Typography variant="h5">
                {byStatus.published}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography>
                Archived
              </Typography>
              <Typography variant="h5">
                {byStatus.archived}
              </Typography>
            </CardContent>
          </Card>
      </Grid>

      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6">
          Articles by Network
        </Typography>

        <Box mt={2}>
          {Object.entries(byNetwork).map(
            ([network, count]) => (
              <Chip
                key={network}
                label={`${network} : ${count}`}
                sx={{ mr: 1, mb: 1 }}
              />
            )
          )}
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" mb={2}>
          Articles by Category
        </Typography>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryStats}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={60}
              paddingAngle={3}
              animationDuration={800}
            >
              {categoryStats.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.color}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "none",
                boxShadow:
                  "0 4px 20px rgba(0,0,0,0.1)",
              }}
            />

            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </Paper>

      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6">
          Last 5 Published Articles
        </Typography>

        <List>
          {last5.map((a) => (
            <ListItem key={a.id}>
              <ListItemText
                primary={a.title}
                secondary={
                  new Date(
                    a.createdAt
                  ).toLocaleDateString()
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6">
          Latest Notifications Sent
        </Typography>

        <List>
          {lastNotifications.map((n) => {
            const article = articles.find(
              (a) => a.id === n.articleId
            );

            return (
              <ListItem key={n.id}>
                <ListItemText
                  primary={
                    article?.title ||
                    "Unknown Article"
                  }
                  secondary={`${
                    n.recipientCount
                  } recipients • ${new Date(
                    n.sentAt
                  ).toLocaleString()}`}
                />
                <Chip
                  label={n.status}
                  color={
                    n.status === "sent"
                      ? "success"
                      : "error"
                  }
                  size="small"
                />
              </ListItem>
            );
          })}
        </List>
      </Paper>
    </Box>
  );
}
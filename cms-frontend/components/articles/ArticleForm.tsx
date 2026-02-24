"use client";

import {
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Chip,
  Switch,
  FormControlLabel,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiFetch } from "@/services/api";
import dynamic from "next/dynamic";

const RichEditor = dynamic(
  () => import("@/components/RichEditor"),
  { ssr: false }
);

const schema = z.object({
  title: z.string().min(5, "Minimum 5 characters"),
  content: z.string().min(50, "Minimum 50 characters"),
  excerpt: z.string().optional(),
  author: z.string().optional(),
  categories: z.array(z.string()).min(1, "Select at least one category"),
  network: z.string().min(1, "Network required"),
  featured: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  article?: any;
  categories: any[];
  networks: any[];
  onSuccess?: () => void;
}

export default function ArticleForm({
  article,
  categories,
  networks,
  onSuccess
}: Props) {
  const [unsaved, setUnsaved] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: article || {
      title: "",
      content: "",
      excerpt: "",
      author: "",
      categories: [],
      network: "",
      featured: false,
    },
  });

  const values = watch();

  useEffect(() => {
    setUnsaved(true);
  }, [values]);

  useEffect(() => {
    if (!article) return;
    const interval = setInterval(() => {
      if (unsaved) {
        saveDraft();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [unsaved, values, article]);

  const saveDraft = async () => {
    const result = schema.safeParse(values);

    if (!result.success) {
      return;
    }

    await apiFetch(
      article
        ? `/articles/${article.id}`
        : "/articles",
      {
        method: article ? "PUT" : "POST",
        body: JSON.stringify({
          ...values,
          status: "draft",
        }),
      }
    );

    setUnsaved(false);
  };

  const onSubmit = async (data: FormData) => {
    await apiFetch(
      article
        ? `/articles/${article.id}`
        : "/articles",
      {
        method: article ? "PUT" : "POST",
        body: JSON.stringify(data),
      }
    );

    setUnsaved(false);

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Box display="flex" gap={4}>
      <Box flex={1}>
        <Typography variant="h5" mb={2}>
          {article ? "Edit Article" : "Create Article"}
        </Typography>

        {unsaved && (
          <Typography color="warning.main">
            Unsaved changes...
          </Typography>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            {...register("title")}
            error={!!errors.title}
            helperText={errors.title?.message}
          />

          <TextField
            label="Excerpt"
            fullWidth
            margin="normal"
            {...register("excerpt")}
          />

          <TextField
            label="Author"
            fullWidth
            margin="normal"
            {...register("author")}
          />

          <FormControl fullWidth margin="normal">
            <Typography variant="subtitle2" mb={1}>
              Content
            </Typography>

            <RichEditor
              value={values.content}
              onChange={(val) =>
                setValue("content", val)
              }
            />

            {errors.content && (
              <Typography color="error" variant="caption">
                {errors.content.message}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Categories</InputLabel>
            <Select
              multiple
              value={values.categories}
              onChange={(e) =>
                setValue(
                  "categories",
                  e.target.value as string[]
                )
              }
              renderValue={(selected) => (
                <Box display="flex" gap={1} flexWrap="wrap">
                  {(selected as string[]).map((id) => {
                    const cat = categories.find(
                      (c) => c.id === id
                    );
                    return (
                      <Chip
                        key={id}
                        label={cat?.name}
                      />
                    );
                  })}
                </Box>
              )}
            >
              {categories.map((cat) => (
                <MenuItem
                  key={cat.id}
                  value={cat.id}
                >
                  <Checkbox
                    checked={
                      values.categories.indexOf(cat.id) >
                      -1
                    }
                  />
                  <ListItemText
                    primary={cat.name}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Network</InputLabel>
            <Select
              value={values.network}
              onChange={(e) =>
                setValue(
                  "network",
                  e.target.value
                )
              }
              error={!!errors.network}
            >
              {networks.map((n) => (
                <MenuItem
                  key={n.id}
                  value={n.id}
                >
                  {n.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={values.featured}
                onChange={(e) =>
                  setValue(
                    "featured",
                    e.target.checked
                  )
                }
              />
            }
            label="Featured Article"
          />

          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3 }}
          >
            Save Article
          </Button>
        </form>
      </Box>

      <Box flex={1} bgcolor="#f5f5f5" p={3}>
        <Typography variant="h5">
          Live Preview
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h4">
          {values.title || "Article Title"}
        </Typography>

        <Typography variant="subtitle1" color="text.secondary">
          By : {values.author}
        </Typography>

        <Box mt={2}>
          {values.categories.map((id) => {
            const cat = categories.find(
              (c) => c.id === id
            );
            return (
              <Chip
                key={id}
                label={cat?.name}
                sx={{ 
                  mr: 1,
                  color: "#fff",
                  backgroundColor: cat?.color,
                }}
              />
            );
          })}
        </Box>

        <Box
          mt={3}
          dangerouslySetInnerHTML={{
            __html: values.content,
          }}
        />
      </Box>
    </Box>
  );
}
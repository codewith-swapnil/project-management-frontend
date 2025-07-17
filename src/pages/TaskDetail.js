import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Button,
  Chip, Divider, CircularProgress, Avatar, Grid, Stack
} from '@mui/material';
import {
  Edit as EditIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';
import api from '../api';
import { format } from 'date-fns';

const TaskDetail = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const { data } = await api.get(`/api/tasks/${taskId}`);
        setTask(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [taskId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!task) {
    return <Typography>Task not found</Typography>;
  }

  return (
    <Box>
      <Button
        startIcon={<BackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Typography variant="h4" gutterBottom>
              {task.title}
            </Typography>
            <Button
              startIcon={<EditIcon />}
              onClick={() => navigate(`/tasks/${taskId}/edit`)}
            >
              Edit
            </Button>
          </Box>

          <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
            <Chip label={task.status} color="primary" />
            <Chip label={task.priority} color="secondary" />
          </Stack>

          <Typography variant="body1" paragraph>
            {task.description}
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Due Date
              </Typography>
              <Typography>
                {task.dueDate ? format(new Date(task.dueDate), 'MMM dd, yyyy') : 'Not set'}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Assigned To
              </Typography>
              {task.assignedTo ? (
                <Box display="flex" alignItems="center">
                  <Avatar src={task.assignedTo.avatar} sx={{ mr: 2 }} />
                  <Typography>{task.assignedTo.name}</Typography>
                </Box>
              ) : (
                <Typography>Unassigned</Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TaskDetail;
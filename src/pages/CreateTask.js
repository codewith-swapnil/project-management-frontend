import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Button, TextField, Typography,
    MenuItem, Alert, CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import api from '../api/index';

const CreateTask = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState({
        title: '',
        description: '',
        dueDate: null,
        assignedUser: ''
    });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Fetch users for assignment
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await api.get('/api/auth/users');
                setUsers(data);
            } catch (err) {
                console.error('Failed to fetch users:', err);
            }
        };
        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (!task.title) {
            setError('Title is required');
            return;
        }

        try {
            setLoading(true);

            // Format the payload according to your API
            const taskData = {
                title: task.title,
                description: task.description,
                dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : undefined,
                project: projectId,
                assignedUser: task.assignedTo || undefined
            };

            await api.post('/api/tasks', taskData);
            setSuccess(true);
            setTimeout(() => navigate(`/projects/${projectId}`), 1500);
        } catch (err) {
            console.error('Task creation failed:', err);
            setError(err.response?.data?.message || 'Failed to create task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Create New Task
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    Task created successfully! Redirecting...
                </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    label="Title"
                    value={task.title}
                    onChange={(e) => setTask({ ...task, title: e.target.value })}
                    fullWidth
                    margin="normal"
                    required
                />

                <TextField
                    label="Description"
                    value={task.description}
                    onChange={(e) => setTask({ ...task, description: e.target.value })}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                />

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Due Date"
                        value={task.dueDate}
                        onChange={(newValue) => setTask({ ...task, dueDate: newValue })}
                        renderInput={(params) => (
                            <TextField {...params} fullWidth margin="normal" />
                        )}
                    />
                </LocalizationProvider>

                <TextField
                    select
                    label="Assign To"
                    value={task.assignedTo}
                    onChange={(e) => setTask({ ...task, assignedTo: e.target.value })}
                    fullWidth
                    margin="normal"
                >
                    <MenuItem value="">
                        <em>Unassigned</em>
                    </MenuItem>
                    {users.map((user) => (
                        <MenuItem key={user._id} value={user._id}>
                            {user.name} ({user.email})
                        </MenuItem>
                    ))}
                </TextField>

                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading || success}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Create Task'}
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => navigate(`/projects/${projectId}`)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default CreateTask;
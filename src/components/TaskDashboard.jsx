import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { toast } from 'sonner';
import api from '../api/axios';
import { logoutUser } from '../api/axios';
import { logout } from '../redux/slices/authSlice';

ChartJS.register(ArcElement, Tooltip, Legend);

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    dueDate: ''
  });
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL);

    socket.on('taskCreated', (newTask) => {
      setTasks(prev => [...prev, newTask]);
      fetchStats();
    });

    socket.on('taskUpdated', (updatedTask) => {
      setTasks(prev => prev.map(task => 
        task._id === updatedTask._id ? updatedTask : task
      ));
      fetchStats();
    });

    socket.on('taskDeleted', (taskId) => {
      setTasks(prev => prev.filter(task => task._id !== taskId));
      fetchStats();
    });

    fetchTasks();
    fetchStats();

    return () => socket.disconnect();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/api/tasks');
      setTasks(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout();
      }
      toast.error('Error fetching tasks');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/tasks/stats');
      setStats(response.data);
    } catch (error) {
      toast.error('Error fetching statistics');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await api.put(`/api/tasks/${editingTask._id}`, formData);
        toast.success('Task updated successfully');
      } else {
        await api.post('/api/tasks', formData);
        toast.success('Task created successfully');
      }
      setShowTaskForm(false);
      setEditingTask(null);
      setFormData({ title: '', description: '', status: 'pending', dueDate: '' });
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving task');
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await api.delete(`/api/tasks/${taskId}`);
      toast.success('Task deleted successfully');
      fetchTasks();
    } catch (error) {
      toast.error('Error deleting task');
    }
  };

  const getStatusBadgeClass = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-semibold";
    switch (status) {
      case 'pending': return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'in-progress': return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'completed': return `${baseClasses} bg-green-100 text-green-800`;
      default: return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const chartData = stats ? {
    labels: ['Pending', 'In Progress', 'Completed', 'Overdue'],
    datasets: [{
      data: [stats.pending, stats['in-progress'], stats.completed, stats.overdueTasks],
      backgroundColor: ['#FFA500', '#4169E1', '#32CD32', '#DC143C']
    }]
  } : null;

  return (
    <div className="min-h-screen bg-[#d8d4cd]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Task Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome back!</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-pink-100 rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total Tasks</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{tasks.length}</p>
        </div>
        <div className="bg-yellow-100 rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Pending</h3>
          <p className="mt-2 text-3xl font-bold text-yellow-600">{stats?.pending || 0}</p>
        </div>
        <div className="bg-blue-100 rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">In Progress</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{stats?.['in-progress'] || 0}</p>
        </div>
        <div className="bg-green-100 rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Completed</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">{stats?.completed || 0}</p>
        </div>
      </div>


        {/* Task List and Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Task List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
                  <button
                    onClick={() => setShowTaskForm(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Add New Task
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {tasks.map(task => (
                  <div key={task._id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                        <p className="mt-1 text-sm text-gray-500">{task.description}</p>
                        <div className="mt-2 flex items-center space-x-4">
                          <span className={getStatusBadgeClass(task.status)}>
                            {task.status}
                          </span>
                          <span className="text-sm text-gray-500">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => {
                            setEditingTask(task);
                            setFormData(task);
                            setShowTaskForm(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(task._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Task Distribution</h2>
            {chartData && (
              <Pie
                data={chartData}
                options={{
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Task Form Modal */}
      {showTaskForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate.split('T')[0]}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowTaskForm(false);
                      setEditingTask(null);
                      setFormData({ title: '', description: '', status: 'pending', dueDate: '' });
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {editingTask ? 'Update Task' : 'Create Task'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDashboard;
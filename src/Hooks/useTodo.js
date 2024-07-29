import axios from 'axios';
import config from '../config';
import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';

export const useTodo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [todos, setTodos] = useState([]);

  const token = useSelector((state) => state.user.token);

  const viewTodos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.apiBaseUrl}/v2/viewAllTodos/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const addTodo = async (name, details) => {
    setLoading(true);
    const payload = {
      data: {
        name: name,
        details: details,
      },
    };
    try {
      const response = await axios.post(`${config.apiBaseUrl}/v2/createTodo/`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error('Error adding todo', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (todo) => {
    setLoading(true);
    try {
      const response = await axios.delete(`${config.apiBaseUrl}/v2/deleteTodo/${todo._id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error('Error deleting todo', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const editTodo = async (data) => {
    setLoading(true);
    const payload = {
      data: data,
    };
    try {
      const response = await axios.put(`${config.apiBaseUrl}/v2/updateTodo`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error('Error updating todo', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    viewTodos();
  }, [viewTodos]);

  return {
    loading,
    error,
    todos,
    addTodo,
    viewTodos,
    deleteTodo,
    editTodo,
  };
};

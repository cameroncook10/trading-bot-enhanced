import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

let socket = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 3000;

// Initialize socket connection with proper error handling
export const initializeSocket = (onConnect, onDisconnect, onError) => {
  if (socket?.connected) {
    console.log('Socket already connected');
    return socket;
  }

  try {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: RECONNECT_DELAY,
      reconnectionDelayMax: 10000,
      reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
      forceNew: false
    });

    socket.on('connect', () => {
      console.log('✓ Socket connected:', socket.id);
      reconnectAttempts = 0;
      if (typeof onConnect === 'function') {
        onConnect(socket.id);
      }
    });

    socket.on('disconnect', (reason) => {
      console.log('✗ Socket disconnected:', reason);
      if (typeof onDisconnect === 'function') {
        onDisconnect(reason);
      }
    });

    socket.on('connect_error', (error) => {
      reconnectAttempts++;
      console.error('Socket connection error:', error);
      if (typeof onError === 'function') {
        onError(error);
      }
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
      if (typeof onError === 'function') {
        onError(error);
      }
    });

    return socket;
  } catch (error) {
    console.error('Failed to initialize socket:', error);
    if (typeof onError === 'function') {
      onError(error);
    }
    return null;
  }
};

// Get current socket instance
export const getSocket = () => socket;

// Emit event with error handling
export const emitEvent = (eventName, data = {}, callback) => {
  if (!socket?.connected) {
    console.warn('Socket not connected, cannot emit:', eventName);
    if (typeof callback === 'function') {
      callback({ success: false, error: 'Socket not connected' });
    }
    return;
  }

  try {
    if (typeof callback === 'function') {
      socket.emit(eventName, data, callback);
    } else {
      socket.emit(eventName, data);
    }
  } catch (error) {
    console.error('Error emitting event:', error);
  }
};

// Listen to event with error handling
export const onEvent = (eventName, handler) => {
  if (!socket) {
    console.warn('Socket not initialized');
    return;
  }

  try {
    socket.on(eventName, (data) => {
      try {
        if (typeof handler === 'function') {
          handler(data);
        }
      } catch (error) {
        console.error(`Error in handler for ${eventName}:`, error);
      }
    });
  } catch (error) {
    console.error('Error setting up event listener:', error);
  }
};

// Remove event listener
export const offEvent = (eventName, handler) => {
  if (!socket) return;
  try {
    socket.off(eventName, handler);
  } catch (error) {
    console.error('Error removing event listener:', error);
  }
};

// Disconnect socket
export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
    socket = null;
    console.log('Socket disconnected');
  }
};

// Check connection status
export const isSocketConnected = () => socket?.connected || false;

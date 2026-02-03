const app = require("./app");
require("dotenv").config();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🏛️  Our Lady Of Sorrows Shrine Backend`);
  console.log(`📍 Environment: ${NODE_ENV}`);
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 URL: ${NODE_ENV === 'production' ? 'Production URL' : `http://localhost:${PORT}`}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

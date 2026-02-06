const db = require('../db/db');

class PrayerModel {
  // Create prayer_requests table if it doesn't exist
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS prayer_requests (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(100),
        phone VARCHAR(20),
        prayer_intention TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'unread',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create indexes for better performance
      CREATE INDEX IF NOT EXISTS idx_prayer_requests_status ON prayer_requests(status);
      CREATE INDEX IF NOT EXISTS idx_prayer_requests_created_at ON prayer_requests(created_at);
    `;
    
    try {
      await db.query(query);
      console.log('Prayer requests table created or already exists');
    } catch (error) {
      console.error('Error creating prayer requests table:', error);
      throw error;
    }
  }

  // Get all prayer requests
  static async getAll() {
    try {
      const query = 'SELECT * FROM prayer_requests ORDER BY created_at DESC';
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error getting prayer requests:', error);
      throw error;
    }
  }

  // Create new prayer request
  static async create(prayerData) {
    try {
      const { name, email, phone, prayer_intention } = prayerData;
      
      const query = `
        INSERT INTO prayer_requests (name, email, phone, prayer_intention) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *
      `;
      
      const values = [name, email || null, phone || null, prayer_intention];
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating prayer request:', error);
      throw error;
    }
  }

  // Delete prayer request
  static async delete(id) {
    try {
      const query = 'DELETE FROM prayer_requests WHERE id = $1 RETURNING *';
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error deleting prayer request:', error);
      throw error;
    }
  }

  // Update prayer request status
  static async updateStatus(id, status) {
    try {
      const query = `
        UPDATE prayer_requests 
        SET status = $1, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $2 
        RETURNING *
      `;
      const result = await db.query(query, [status, id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating prayer request status:', error);
      throw error;
    }
  }

  // Get prayer requests by status
  static async getByStatus(status) {
    try {
      const query = 'SELECT * FROM prayer_requests WHERE status = $1 ORDER BY created_at DESC';
      const result = await db.query(query, [status]);
      return result.rows;
    } catch (error) {
      console.error('Error getting prayer requests by status:', error);
      throw error;
    }
  }

  // Get prayer request statistics
  static async getStats() {
    try {
      const query = `
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'unread' THEN 1 END) as unread,
          COUNT(CASE WHEN status = 'read' THEN 1 END) as read
        FROM prayer_requests
      `;
      const result = await db.query(query);
      return result.rows[0];
    } catch (error) {
      console.error('Error getting prayer request stats:', error);
      throw error;
    }
  }
}

module.exports = PrayerModel;
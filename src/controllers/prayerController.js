const pool = require("../db/db");

// CREATE prayer request
exports.createPrayer = async (req, res) => {
  try {
    console.log('=== PRAYER REQUEST RECEIVED ===');
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);
    
    // Accept both 'prayer' and 'prayer_intention' for backward compatibility
    const { name, email, prayer, prayer_intention } = req.body;
    const prayerText = prayer_intention || prayer;

    if (!name || !prayerText) {
      console.log('Validation failed - missing fields:', { name: !!name, prayer: !!prayerText });
      return res.status(400).json({ message: "Name and prayer are required" });
    }

    console.log('Attempting to insert prayer request...');
    const result = await pool.query(
      `INSERT INTO prayer_requests (name, email, prayer)
       VALUES ($1, $2, $3) RETURNING *`,
      [name, email || null, prayerText]
    );

    console.log('Prayer request created successfully:', result.rows[0]);
    res.status(201).json({
      message: "Prayer request submitted successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error('=== PRAYER CREATION ERROR ===');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET all prayer requests (Admin)
exports.getAllPrayers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM prayer_requests ORDER BY created_at DESC"
    );

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE prayer request
exports.deletePrayer = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM prayer_requests WHERE id = $1", [id]);

    res.status(200).json({ message: "Prayer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

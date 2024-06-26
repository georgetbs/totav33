// pages/api/getCurrentTime.js

export default async (req, res) => {
    const now = new Date();
    res.status(200).json({ currentTime: now.toISOString() });
  };
  
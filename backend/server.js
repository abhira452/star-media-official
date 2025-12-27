const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
app.use(express.json());

// ===== THIRD-PARTY API KEY =====
const PROVIDER_API_KEY = process.env.PROVIDER_API_KEY;

// ===== CREATE ORDER API =====
app.post("/api/create-order", async (req, res) => {
  const { service, quantity, username } = req.body;

  if (!service || !quantity || !username) {
    return res.status(400).json({ success: false, error: "Missing data" });
  }

  try {
    const response = await fetch("https://provider-api-url.com/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": 244cf989f5e079e55822b31322509416efe73e6d
      },
      body: JSON.stringify({
        service,
        quantity,
        link: username
      })
    });

    const data = await response.json();

    res.json({
      success: true,
      providerOrder: data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Third-party order failed"
    });
  }
});

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});

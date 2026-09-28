const express = require("express");
const cors = require("cors");
require("dotenv").config();

const supabase = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

// ==================================================
// HOME
// ==================================================

app.get("/", (req, res) => {
  res.json({
    message: "Digital Elderly Care Backend is running with Supabase",
  });
});

// ==================================================
// TEST SUPABASE
// ==================================================

app.get("/test-supabase", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .limit(1);

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      message: "Supabase connected successfully!",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==================================================
// SOS REQUESTS
// ==================================================

// CREATE SOS
app.post("/api/sos", async (req, res) => {
  try {
    const {
      elderly_id,
      elderly_name,
      type,
      message,
    } = req.body;

    const { data, error } = await supabase
      .from("sos_requests")
      .insert([
        {
          elderly_id,
          elderly_name,
          type,
          message,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      message: "SOS request created successfully!",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET PENDING SOS
app.get("/api/sos/pending", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("sos_requests")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET ELDERLY SOS STATUS
app.get("/api/sos/elderly/:name", async (req, res) => {
  try {
    const name = decodeURIComponent(req.params.name);

    const { data, error } = await supabase
      .from("sos_requests")
      .select("*")
      .eq("elderly_name", name)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
// ==================================================
// GET SOS REQUEST FOR SPECIFIC HELPER
// ==================================================

app.get("/api/sos/helper/:name", async (req, res) => {
  try {
    const name = decodeURIComponent(req.params.name);

    const { data, error } = await supabase
      .from("sos_requests")
      .select("*")
      .eq("helper_name", name)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      data: data || null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ACCEPT SOS
app.put("/api/sos/:id/accept", async (req, res) => {
  try {
    const { id } = req.params;
    const { helper_id, helper_name } = req.body;

    const { data, error } = await supabase
      .from("sos_requests")
      .update({
        status: "accepted",
        helper_id,
        helper_name,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      message: "SOS request accepted successfully!",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==================================================
// START NORMAL HELP
// ==================================================

app.put("/api/help-requests/:id/start", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("help_requests")
      .update({
        status: "in_progress",
      })
      .eq("id", id)
      .eq("status", "accepted")
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      message: "Help request started successfully!",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// ==================================================
// COMPLETE NORMAL HELP
// ==================================================

app.put("/api/help-requests/:id/complete", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("help_requests")
      .update({
        status: "completed",
      })
      .eq("id", id)
      .eq("status", "in_progress")
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      message: "Help request completed successfully!",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
// ==================================================
// START SOS HELP
// ==================================================

app.put("/api/sos/:id/start", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("sos_requests")
      .update({
        status: "in_progress",
      })
      .eq("id", id)
      .eq("status", "accepted")
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      message: "SOS help started successfully!",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// ==================================================
// COMPLETE SOS HELP
// ==================================================

app.put("/api/sos/:id/complete", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("sos_requests")
      .update({
        status: "completed",
      })
      .eq("id", id)
      .eq("status", "in_progress")
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      message: "SOS request completed successfully!",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==================================================
// APPROVED AND AVAILABLE HELPERS
// ==================================================

app.get("/api/helpers", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("helpers")
      .select("*")
      .eq("status", "approved")
      .eq("availability", true)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==================================================
// NORMAL HELP REQUESTS
// ==================================================

// CREATE HELP REQUEST
app.post("/api/help-requests", async (req, res) => {
  try {
    const {
      elderly_id,
      elderly_name,
      helper_name,
      helper_phone,
      request_type,
      description,
      preferred_time,
    } = req.body;

    const { data, error } = await supabase
      .from("help_requests")
      .insert([
        {
          elderly_id,
          elderly_name,
          helper_name,
          helper_phone,
          request_type,
          description,
          preferred_time,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      message: "Help request created successfully!",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET PENDING HELP REQUEST
app.get("/api/help-requests/pending", async (req, res) => {
  try {
    const { helper_name } = req.query;

    let query = supabase
      .from("help_requests")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(1);

    if (helper_name) {
      query = query.eq("helper_name", helper_name);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET ELDERLY HELP REQUESTS
app.get("/api/help-requests/elderly/:name", async (req, res) => {
  try {
    const name = decodeURIComponent(req.params.name);

    const { data, error } = await supabase
      .from("help_requests")
      .select("*")
      .eq("elderly_name", name)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ACCEPT HELP REQUEST
app.put("/api/help-requests/:id/accept", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      helper_id,
      helper_name,
      helper_phone,
    } = req.body;

    const { data, error } = await supabase
      .from("help_requests")
      .update({
        status: "accepted",
        helper_id,
        helper_name,
        helper_phone,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      message: "Help request accepted successfully!",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==================================================
// FAMILY CONNECT
// ==================================================

// ADD FAMILY MEMBER
app.post("/api/family-members", async (req, res) => {
  try {
    const {
      elderly_name,
      family_name,
      relation,
      phone,
    } = req.body;

    const { data, error } = await supabase
      .from("family_members")
      .insert([
        {
          elderly_name,
          family_name,
          relation,
          phone,
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      message: "Family member added successfully!",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET FAMILY MEMBERS
app.get("/api/family-members/:elderly_name", async (req, res) => {
  try {
    const elderly_name = decodeURIComponent(
      req.params.elderly_name
    );

    const { data, error } = await supabase
      .from("family_members")
      .select("*")
      .eq("elderly_name", elderly_name)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==================================================
// FAMILY MEETING REQUESTS
// ==================================================

// CREATE MEETING REQUEST
app.post("/api/meeting-requests", async (req, res) => {
  try {
    const {
      elderly_name,
      family_name,
      meeting_date,
      meeting_time,
      meeting_place,
    } = req.body;

    if (
      !elderly_name ||
      !family_name ||
      !meeting_date ||
      !meeting_time ||
      !meeting_place
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all meeting details.",
      });
    }

    const { data, error } = await supabase
      .from("meeting_requests")
      .insert([
        {
          elderly_name,
          family_name,
          meeting_date,
          meeting_time,
          meeting_place,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      message: "Meeting request sent successfully!",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET MEETINGS FOR ELDERLY
app.get("/api/meeting-requests/elderly/:name", async (req, res) => {
  try {
    const name = decodeURIComponent(req.params.name);

    const { data, error } = await supabase
      .from("meeting_requests")
      .select("*")
      .eq("elderly_name", name)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET MEETINGS FOR FAMILY
app.get("/api/meeting-requests/family/:name", async (req, res) => {
  try {
    const name = decodeURIComponent(req.params.name);

    const { data, error } = await supabase
      .from("meeting_requests")
      .select("*")
      .eq("family_name", name)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ACCEPT MEETING
app.put("/api/meeting-requests/:id/accept", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("meeting_requests")
      .update({ status: "accepted" })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      message: "Meeting request accepted!",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// REJECT MEETING
app.put("/api/meeting-requests/:id/reject", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("meeting_requests")
      .update({ status: "rejected" })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      message: "Meeting request rejected!",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// CANCEL MEETING
app.delete("/api/meeting-requests/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("meeting_requests")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      message: "Meeting request cancelled successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==================================================
// HEALTH LOGS
// ==================================================

// CREATE HEALTH LOG
app.post("/api/health-logs", async (req, res) => {
  try {
    const {
      elderly_name,
      blood_pressure,
      heart_rate,
      temperature,
      blood_sugar,
      medicines,
      doctor_visit,
      notes,
    } = req.body;

    if (!elderly_name) {
      return res.status(400).json({
        success: false,
        message: "Elderly name is required.",
      });
    }

    const { data, error } = await supabase
      .from("health_logs")
      .insert([
        {
          elderly_name,
          blood_pressure,
          heart_rate,
          temperature,
          blood_sugar,
          medicines,
          doctor_visit,
          notes,
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "Health record saved successfully!",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET HEALTH LOGS
app.get("/api/health-logs/:elderly_name", async (req, res) => {
  try {
    const elderly_name = decodeURIComponent(
      req.params.elderly_name
    );

    const { data, error } = await supabase
      .from("health_logs")
      .select("*")
      .eq("elderly_name", elderly_name)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// UPDATE HEALTH LOG
app.put("/api/health-logs/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      elderly_name,
      blood_pressure,
      heart_rate,
      temperature,
      blood_sugar,
      medicines,
      doctor_visit,
      notes,
    } = req.body;

    if (!elderly_name) {
      return res.status(400).json({
        success: false,
        message: "Elderly name is required.",
      });
    }

    const { data, error } = await supabase
      .from("health_logs")
      .update({
        elderly_name,
        blood_pressure,
        heart_rate,
        temperature,
        blood_sugar,
        medicines,
        doctor_visit,
        notes,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      message: "Health record updated successfully!",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// DELETE HEALTH LOG
app.delete("/api/health-logs/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("health_logs")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      message: "Health record deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==================================================
// START SERVER
// ==================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
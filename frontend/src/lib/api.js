const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Common request wrapper with JSON handling and user header
 */
async function request(endpoint, options = {}, userId = null) {
  const headers = {
    ...(options.headers || {})
  };

  if (userId) {
    headers["x-user-id"] = userId;
  }

  const config = {
    ...options,
    headers
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data?.error || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Live Weather API
  async getWeather() {
    return request("/api/weather");
  },

  // Menu Management
  async getMenu(userId = null) {
    return request("/api/menu", { method: "GET" }, userId);
  },

  async createMenuItem(item, userId = null) {
    return request(
      "/api/menu",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
      },
      userId
    );
  },

  async updateMenuItem(id, item, userId = null) {
    return request(
      `/api/menu/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
      },
      userId
    );
  },

  async deleteMenuItem(id, userId = null) {
    return request(`/api/menu/${id}`, { method: "DELETE" }, userId);
  },

  async resetMenu(userId = null) {
    return request("/api/menu/reset", { method: "POST" }, userId);
  },

  // Multimodal Register OCR Scanner
  async scanRegister(file, userId = null) {
    const formData = new FormData();
    formData.append("register_image", file);

    const headers = {};
    if (userId) {
      headers["x-user-id"] = userId;
    }

    const response = await fetch(`${API_BASE_URL}/api/scan-register`, {
      method: "POST",
      headers,
      body: formData
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to scan handwritten register");
    }
    return data;
  },

  // Multi-Factor Simulator
  async simulate(scenarioInputs, items = null, userId = null) {
    return request(
      "/api/simulate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario_inputs: scenarioInputs,
          items: items
        })
      },
      userId
    );
  },

  // Autonomous Kitchen & Revenue Rescue Generator
  async generateActions(simulationResults, scenarioInputs, expiringIngredients = [], userId = null) {
    return request(
      "/api/generate-actions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          simulation_results: simulationResults,
          scenario_inputs: scenarioInputs,
          expiring_ingredients: expiringIngredients
        })
      },
      userId
    );
  },

  // Audit Logs
  async getLogs(userId = null) {
    return request("/api/logs", { method: "GET" }, userId);
  }
};

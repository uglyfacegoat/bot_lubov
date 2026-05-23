const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `API error ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  health: () => request<{ status: string }>("/health"),
  dashboard: () => request("/dashboard"),
  progress: () => request("/progress"),
  rewards: () => request("/rewards"),
  tasks: () => request("/tasks"),
  changeWater: (mode: "add" | "remove", liters: number) =>
    request("/water/change", {
      method: "POST",
      body: JSON.stringify({ mode, liters }),
    }),
  buyReward: (rewardId: string) =>
    request(`/rewards/${rewardId}/buy`, {
      method: "POST",
    }),
  selectTaskOption: (taskId: string, optionId: string) =>
    request(`/tasks/${taskId}/select`, {
      method: "POST",
      body: JSON.stringify({ option_id: optionId }),
    }),
  completeTask: (taskId: string) =>
    request(`/tasks/${taskId}/complete`, {
      method: "POST",
    }),
};

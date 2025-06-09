import { fetchWithAuth } from "../lib/authFetch";
import { AuthContextType } from "../stores/authStore";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export interface CreateSessionTypeData {
  name: string;
  description?: string;
  workDuration: number; // in seconds
  breakDuration?: number; // in seconds
  numberOfCycles?: number;
}

export interface UpdateSessionTypeData {
  name?: string;
  description?: string;
  workDuration?: number; // in seconds
  breakDuration?: number; // in seconds
  numberOfCycles?: number;
  isActive?: boolean;
}

export class SessionTypeService {
  constructor(private authHelpers: AuthContextType) {}

  async createSessionType(data: CreateSessionTypeData) {
    const response = await fetchWithAuth(
      `${API_BASE}/api/SessionType`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
      this.authHelpers
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to create session type: ${response.status} ${errorText}`
      );
    }

    return response.json();
  }

  async updateSessionType(id: number, data: UpdateSessionTypeData) {
    const response = await fetchWithAuth(
      `${API_BASE}/api/SessionType/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
      this.authHelpers
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to update session type: ${response.status} ${errorText}`
      );
    }

    return response.json();
  }

  async deleteSessionType(id: number) {
    const response = await fetchWithAuth(
      `${API_BASE}/api/SessionType/${id}`,
      {
        method: "DELETE",
      },
      this.authHelpers
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to delete session type: ${response.status} ${errorText}`
      );
    }
  }
}

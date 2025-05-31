import { fetchWithAuth } from "../lib/authFetch";
import { AuthContextType } from "../context/AuthContext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export interface CreateTagData {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateTagData {
  name?: string;
  description?: string;
  color?: string;
}

export class TagService {
  constructor(private authHelpers: AuthContextType) {}

  async createTag(data: CreateTagData) {
    const response = await fetchWithAuth(
      `${API_BASE}/api/Tag`,
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
      throw new Error(`Failed to create tag: ${response.status} ${errorText}`);
    }

    return response.json();
  }

  async updateTag(id: number, data: UpdateTagData) {
    const response = await fetchWithAuth(
      `${API_BASE}/api/Tag/${id}`,
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
      throw new Error(`Failed to update tag: ${response.status} ${errorText}`);
    }
  }

  async deleteTag(id: number) {
    const response = await fetchWithAuth(
      `${API_BASE}/api/Tag/${id}`,
      {
        method: "DELETE",
      },
      this.authHelpers
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete tag: ${response.status} ${errorText}`);
    }
  }
}

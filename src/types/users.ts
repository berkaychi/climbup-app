export interface UserProfileResponseDto {
  fullName: string;
  userName: string;
  email: string;
  dateAdded: string;
  profilePictureUrl?: string | null;
  totalSteps: number;
  stepstones: number;
}

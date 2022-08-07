export type RoomType = 'CONTACT' | 'GROUP';

export interface SidebarSettings {
  currentRoomType: RoomType;
}

export type UpdateSettings = (
  callback: (currentSettings: SidebarSettings) => SidebarSettings,
) => void;

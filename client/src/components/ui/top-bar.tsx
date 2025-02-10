import { ProfileMenu } from "./profile-menu";

export function TopBar() {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold">Gemini</h1>
        <span className="text-sm text-muted-foreground">2.0 Flash</span>
      </div>
      <ProfileMenu />
    </div>
  );
}

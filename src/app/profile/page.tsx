
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>
            This is your profile page. We can add more details here later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Profile content will go here.</p>
        </CardContent>
      </Card>
    </div>
  );
}

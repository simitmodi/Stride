
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AppointmentSchedulingPage() {
  return (
    <div className="flex w-full flex-col">
      <Card>
        <CardHeader>
          <CardTitle>Appointment Scheduling</CardTitle>
          <CardDescription>
            Book and manage your bank appointments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is a placeholder for the Appointment Scheduling page. We can add more details here later.</p>
        </CardContent>
      </Card>
    </div>
  );
}

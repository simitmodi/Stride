
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AppointmentDetailsPage() {
  return (
    <div className="flex w-full flex-col items-center p-4 md:p-8" style={{ backgroundColor: '#BFBAB0' }}>
       <Card className="w-full max-w-2xl shadow-lg" style={{ backgroundColor: '#D0CBC1' }}>
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold" style={{ color: '#092910' }}>Appointment Details</CardTitle>
          <CardDescription className="text-center" style={{ color: '#000F00' }}>
            This feature is coming soon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">Please check back later for updates on this feature.</p>
        </CardContent>
      </Card>
    </div>
  );
}

    
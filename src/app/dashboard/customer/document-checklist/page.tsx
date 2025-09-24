
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DocumentChecklistPage() {
  return (
    <div className="flex w-full flex-col">
      <Card>
        <CardHeader>
          <CardTitle>Document Checklist</CardTitle>
          <CardDescription>
            Prepare your documents for a smooth bank visit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is a placeholder for the Document Checklist page. We can add more details here later.</p>
        </CardContent>
      </Card>
    </div>
  );
}

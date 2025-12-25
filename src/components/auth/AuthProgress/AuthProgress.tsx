import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  label: string;
}

interface AuthProgressProps {
  steps: Step[];
  currentStep: string;
}

export function AuthProgress({ steps, currentStep }: AuthProgressProps) {
  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center gap-2">
        {steps.map((s, index) => (
          <div key={s.id} className="flex items-center">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                index <= currentStepIndex
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              {index < currentStepIndex ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                index + 1
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-8 sm:w-12 mx-1 rounded-full transition-colors",
                  index < currentStepIndex ? "bg-accent" : "bg-secondary"
                )}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-2">
        <span className="text-xs text-muted-foreground">
          {steps[currentStepIndex]?.label}
        </span>
      </div>
    </div>
  );
}


import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function AddBillDialogHeader() {
  return (
    <DialogHeader>
      <DialogTitle>Add New Bill</DialogTitle>
      <DialogDescription>
        Add a bill to be covered by AutoFloat. A 4-week payment plan will be created.
      </DialogDescription>
    </DialogHeader>
  );
}



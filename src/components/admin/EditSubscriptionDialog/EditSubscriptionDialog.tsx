import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Subscription {
  id: string;
  user_id: string;
  tier: string;
  access_limit: number;
  access_used: number;
  is_active: boolean;
}

interface EditSubscriptionDialogProps {
  subscription: Subscription | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (subscription: Subscription) => void;
}

export function EditSubscriptionDialog({
  subscription,
  open,
  onOpenChange,
  onUpdate
}: EditSubscriptionDialogProps) {
  const [tier, setTier] = useState("basic");
  const [accessLimit, setAccessLimit] = useState(500);
  const [accessUsed, setAccessUsed] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (subscription) {
      setTier(subscription.tier);
      setAccessLimit(subscription.access_limit);
      setAccessUsed(subscription.access_used);
      setIsActive(subscription.is_active);
    }
  }, [subscription]);

  const handleSave = async () => {
    if (!subscription) return;
    
    setSaving(true);
    const { error } = await supabase
      .from("subscriptions")
      .update({
        tier: tier as "basic" | "plus" | "auto_plus",
        access_limit: accessLimit,
        access_used: accessUsed,
        is_active: isActive
      })
      .eq("id", subscription.id);

    setSaving(false);

    if (error) {
      toast.error("Failed to update subscription");
      return;
    }

    toast.success("Subscription updated successfully");
    onUpdate({
      ...subscription,
      tier,
      access_limit: accessLimit,
      access_used: accessUsed,
      is_active: isActive
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle>Edit Subscription</DialogTitle>
          <DialogDescription>
            Update subscription details for user {subscription?.user_id.slice(0, 8)}...
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="tier">Tier</Label>
            <Select value={tier} onValueChange={setTier}>
              <SelectTrigger>
                <SelectValue placeholder="Select tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="plus">Plus</SelectItem>
                <SelectItem value="auto_plus">Auto Plus</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="accessLimit">Access Limit ($)</Label>
            <Input
              id="accessLimit"
              type="number"
              value={accessLimit}
              onChange={(e) => setAccessLimit(Number(e.target.value))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="accessUsed">Access Used ($)</Label>
            <Input
              id="accessUsed"
              type="number"
              value={accessUsed}
              onChange={(e) => setAccessUsed(Number(e.target.value))}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="isActive">Active Status</Label>
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


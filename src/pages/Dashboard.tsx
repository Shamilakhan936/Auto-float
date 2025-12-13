import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Car, 
  CreditCard, 
  Calendar, 
  ArrowUpRight, 
  Plus,
  Zap,
  Home,
  Phone,
  Shield,
  Wifi,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { format, addDays } from "date-fns";

const categoryIcons: Record<string, typeof Home> = {
  Rent: Home,
  Utilities: Zap,
  Phone: Phone,
  Insurance: Shield,
  Internet: Wifi,
};

const tierLimits = {
  basic: 500,
  plus: 1500,
  auto_plus: 3000,
};

const tierNames = {
  basic: "Basic",
  plus: "Plus",
  auto_plus: "Auto+",
};

interface Bill {
  id: string;
  name: string;
  category: string;
  amount: number;
  due_date: string;
  status: string;
}

interface Subscription {
  tier: "basic" | "plus" | "auto_plus";
  access_limit: number;
  access_used: number;
  is_active: boolean;
  next_settlement_date: string | null;
}

interface Vehicle {
  is_verified: boolean;
  make: string | null;
  model: string | null;
  year: number | null;
  insurance_provider: string | null;
  insurance_verified: boolean;
  vin: string | null;
  license_plate: string | null;
}

interface BankAccount {
  bank_name: string;
  account_last_four: string | null;
  is_connected: boolean;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [bills, setBills] = useState<Bill[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [bankAccount, setBankAccount] = useState<BankAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [addBillOpen, setAddBillOpen] = useState(false);
  const [manageBankOpen, setManageBankOpen] = useState(false);
  const [manageVehicleOpen, setManageVehicleOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // New bill form
  const [newBillName, setNewBillName] = useState("");
  const [newBillCategory, setNewBillCategory] = useState("");
  const [newBillAmount, setNewBillAmount] = useState("");
  const [newBillDueDate, setNewBillDueDate] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch subscription
      const { data: subData, error: subError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      
      if (subError) throw subError;
      if (subData) {
        setSubscription(subData as Subscription);
      }

      // Fetch bills
      const { data: billsData, error: billsError } = await supabase
        .from("bills")
        .select("*")
        .eq("user_id", user!.id)
        .order("due_date", { ascending: true });
      
      if (billsError) throw billsError;
      setBills((billsData as Bill[]) || []);

      // Fetch vehicle
      const { data: vehicleData, error: vehicleError } = await supabase
        .from("vehicles")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      
      if (vehicleError && vehicleError.code !== "PGRST116") throw vehicleError;
      if (vehicleData) {
        setVehicle(vehicleData as Vehicle);
      }

      // Fetch bank account
      const { data: bankData, error: bankError } = await supabase
        .from("bank_accounts")
        .select("*")
        .eq("user_id", user!.id)
        .eq("is_primary", true)
        .maybeSingle();
      
      if (bankError && bankError.code !== "PGRST116") throw bankError;
      if (bankData) {
        setBankAccount(bankData as BankAccount);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddBill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !subscription) return;

    const amount = parseFloat(newBillAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid bill amount.",
        variant: "destructive",
      });
      return;
    }

    if (subscription.access_used + amount > subscription.access_limit) {
      toast({
        title: "Access limit exceeded",
        description: "This bill would exceed your monthly access limit.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      // Insert bill
      const { error: billError } = await supabase.from("bills").insert({
        user_id: user.id,
        name: newBillName,
        category: newBillCategory,
        amount: amount,
        due_date: newBillDueDate,
        status: "pending",
      });

      if (billError) throw billError;

      // Update access used
      const { error: subError } = await supabase
        .from("subscriptions")
        .update({ access_used: subscription.access_used + amount })
        .eq("user_id", user.id);

      if (subError) throw subError;

      toast({
        title: "Bill added",
        description: `${newBillName} has been added to your upcoming bills.`,
      });

      setAddBillOpen(false);
      setNewBillName("");
      setNewBillCategory("");
      setNewBillAmount("");
      setNewBillDueDate("");
      fetchData();
    } catch (error) {
      console.error("Error adding bill:", error);
      toast({
        title: "Error",
        description: "Failed to add bill. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const accessUsed = subscription?.access_used || 0;
  const accessLimit = subscription?.access_limit || 500;
  const accessRemaining = accessLimit - accessUsed;
  const accessPercent = (accessUsed / accessLimit) * 100;
  const isVerified = vehicle?.is_verified || false;
  const tierName = subscription ? tierNames[subscription.tier] : "Basic";
  
  const nextSettlement = subscription?.next_settlement_date 
    ? format(new Date(subscription.next_settlement_date), "MMMM d, yyyy")
    : format(addDays(new Date(), 18), "MMMM d, yyyy");

  const daysUntilSettlement = subscription?.next_settlement_date
    ? Math.ceil((new Date(subscription.next_settlement_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 18;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-8 md:py-12">
        <div className="container px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">Manage your bills and track your access.</p>
            </div>
            <div className="flex items-center gap-3">
              {isVerified && (
                <Badge variant="verified" className="py-2 px-4">
                  <Car className="h-4 w-4 mr-2" />
                  Auto+ Verified
                </Badge>
              )}
              <Button variant="accent" onClick={() => setAddBillOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Bill
              </Button>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Access Card */}
            <Card className="md:col-span-2 animate-fade-in">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Current Access</CardTitle>
                  <Badge variant="outline">{accessPercent.toFixed(0)}% used</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-4xl font-bold text-foreground">${accessUsed.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">of ${accessLimit.toLocaleString()} limit</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-accent">${accessRemaining.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">remaining</p>
                  </div>
                </div>
                <Progress value={accessPercent} className="h-3 rounded-full" />
                <div className="mt-6 flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Resets {nextSettlement}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CreditCard className="h-4 w-4" />
                    <span>{tierName} Plan</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Settlement Card */}
            <Card className="animate-fade-in [animation-delay:100ms] opacity-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Next Settlement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {format(addDays(new Date(), daysUntilSettlement), "MMM d")}
                    </p>
                    <p className="text-sm text-muted-foreground">{daysUntilSettlement} days away</p>
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-secondary/30 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Amount due</span>
                    <span className="text-lg font-semibold text-foreground">${accessUsed.toLocaleString()}</span>
                  </div>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  Balance clears automatically via ACH on settlement date.
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Upcoming Bills */}
          <Card className="animate-fade-in [animation-delay:200ms] opacity-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Upcoming Bills</CardTitle>
                  <CardDescription>Your scheduled and pending bill payments</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setAddBillOpen(true)}>
                  Add Bill
                  <Plus className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {bills.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                    <CreditCard className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-4">No bills added yet</p>
                  <Button variant="accent" onClick={() => setAddBillOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Bill
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bills.map((bill) => {
                    const IconComponent = categoryIcons[bill.category] || CreditCard;
                    return (
                      <div
                        key={bill.id}
                        className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-secondary/30 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                            <IconComponent className="h-6 w-6 text-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{bill.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {bill.category} • Due {format(new Date(bill.due_date), "MMM d")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="text-lg font-semibold text-foreground">${bill.amount}</p>
                          {bill.status === "scheduled" || bill.status === "paid" ? (
                            <Badge variant="success" className="gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              {bill.status === "paid" ? "Paid" : "Scheduled"}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="gap-1">
                              <AlertCircle className="h-3 w-3" />
                              Pending
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <Card 
              className="hover:border-accent/30 transition-colors cursor-pointer animate-fade-in [animation-delay:300ms] opacity-0"
              onClick={() => setAddBillOpen(true)}
            >
              <CardContent className="flex flex-col items-center justify-center py-6 text-center">
                <Plus className="h-8 w-8 text-accent mb-3" />
                <p className="font-medium text-foreground">Add Bill</p>
                <p className="text-xs text-muted-foreground">Schedule new payment</p>
              </CardContent>
            </Card>
            <Card 
              className="hover:border-accent/30 transition-colors cursor-pointer animate-fade-in [animation-delay:400ms] opacity-0"
              onClick={() => setManageBankOpen(true)}
            >
              <CardContent className="flex flex-col items-center justify-center py-6 text-center">
                <CreditCard className="h-8 w-8 text-accent mb-3" />
                <p className="font-medium text-foreground">Bank Account</p>
                <p className="text-xs text-muted-foreground">
                  {bankAccount ? bankAccount.bank_name : "Connect bank"}
                </p>
              </CardContent>
            </Card>
            <Card 
              className="hover:border-accent/30 transition-colors cursor-pointer animate-fade-in [animation-delay:500ms] opacity-0"
              onClick={() => setManageVehicleOpen(true)}
            >
              <CardContent className="flex flex-col items-center justify-center py-6 text-center">
                <Car className="h-8 w-8 text-accent mb-3" />
                <p className="font-medium text-foreground">Vehicle Info</p>
                <p className="text-xs text-muted-foreground">
                  {isVerified ? "Verified" : "Not verified"}
                </p>
              </CardContent>
            </Card>
            <Link to="/plans">
              <Card className="hover:border-accent/30 transition-colors cursor-pointer h-full animate-fade-in [animation-delay:600ms] opacity-0">
                <CardContent className="flex flex-col items-center justify-center py-6 text-center">
                  <ArrowUpRight className="h-8 w-8 text-accent mb-3" />
                  <p className="font-medium text-foreground">Upgrade Plan</p>
                  <p className="text-xs text-muted-foreground">Increase your limit</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />

      {/* Add Bill Dialog */}
      <Dialog open={addBillOpen} onOpenChange={setAddBillOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a New Bill</DialogTitle>
            <DialogDescription>
              Add a bill to your upcoming payments. It will count against your monthly access.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddBill} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="billName">Bill Name</Label>
              <Input
                id="billName"
                placeholder="e.g., Electric Bill"
                value={newBillName}
                onChange={(e) => setNewBillName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={newBillCategory} onValueChange={setNewBillCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Rent">Rent</SelectItem>
                  <SelectItem value="Utilities">Utilities</SelectItem>
                  <SelectItem value="Phone">Phone</SelectItem>
                  <SelectItem value="Insurance">Insurance</SelectItem>
                  <SelectItem value="Internet">Internet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={newBillAmount}
                onChange={(e) => setNewBillAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={newBillDueDate}
                onChange={(e) => setNewBillDueDate(e.target.value)}
                required
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setAddBillOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="accent" className="flex-1" disabled={submitting}>
                {submitting ? "Adding..." : "Add Bill"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Manage Bank Account Dialog */}
      <Dialog open={manageBankOpen} onOpenChange={setManageBankOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bank Account</DialogTitle>
            <DialogDescription>
              Manage your connected bank account for auto-settlement.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {bankAccount ? (
              <div className="rounded-xl border border-border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                      <CreditCard className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{bankAccount.bank_name}</p>
                      <p className="text-sm text-muted-foreground">
                        ••••{bankAccount.account_last_four || "4567"}
                      </p>
                    </div>
                  </div>
                  <Badge variant={bankAccount.is_connected ? "success" : "outline"}>
                    {bankAccount.is_connected ? "Connected" : "Disconnected"}
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No bank account connected</p>
              </div>
            )}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setManageBankOpen(false)}>
                Close
              </Button>
              <Link to="/connect-bank" className="flex-1">
                <Button variant="accent" className="w-full">
                  {bankAccount ? "Update Bank" : "Connect Bank"}
                </Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manage Vehicle Dialog */}
      <Dialog open={manageVehicleOpen} onOpenChange={setManageVehicleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vehicle Information</DialogTitle>
            <DialogDescription>
              View and manage your vehicle verification status.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {vehicle ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                        <Car className="h-5 w-5 text-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {vehicle.vin ? `VIN: ${vehicle.vin.slice(0, 8)}...` : vehicle.license_plate ? `Plate: ${vehicle.license_plate}` : "Vehicle Info"}
                        </p>
                      </div>
                    </div>
                    <Badge variant={vehicle.is_verified ? "verified" : "outline"}>
                      {vehicle.is_verified ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                  
                  {vehicle.insurance_provider && (
                    <div className="pt-3 border-t border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Insurance</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{vehicle.insurance_provider}</span>
                          <Badge variant={vehicle.insurance_verified ? "success" : "outline"} className="text-xs">
                            {vehicle.insurance_verified ? "Verified" : "Pending"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {vehicle.is_verified && (
                  <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 text-center">
                    <Badge variant="verified" className="mb-2">
                      <Car className="h-3 w-3 mr-1" />
                      Auto+ Verified
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      You have access to the maximum $3,000 monthly limit
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <Car className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-2">No vehicle verified</p>
                <p className="text-xs text-muted-foreground">
                  Verify your vehicle to unlock up to $3,000 monthly access
                </p>
              </div>
            )}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setManageVehicleOpen(false)}>
                Close
              </Button>
              <Link to="/verify" className="flex-1">
                <Button variant="accent" className="w-full">
                  {vehicle?.is_verified ? "Update Vehicle" : "Verify Vehicle"}
                </Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
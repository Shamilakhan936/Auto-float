import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  CreditCard,
  Car,
  Building2,
  Bell,
  Lock,
  Calendar,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  Gift,
  Copy,
  DollarSign,
  Clock,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Profile {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  referral_code: string | null;
  drivers_license_url: string | null;
  paystub_url: string | null;
  documents_verified: boolean | null;
}

interface Subscription {
  tier: "basic" | "plus" | "auto_plus";
  access_limit: number;
  access_used: number;
  is_active: boolean;
  settlement_timing: string | null;
  settlement_frequency: string | null;
  next_settlement_date: string | null;
}

interface Vehicle {
  id: string;
  make: string | null;
  model: string | null;
  year: number | null;
  vin: string | null;
  license_plate: string | null;
  insurance_provider: string | null;
  is_verified: boolean;
  insurance_verified: boolean;
}

interface BankAccount {
  id: string;
  bank_name: string;
  account_last_four: string | null;
  is_primary: boolean;
  is_connected: boolean;
}

interface Referral {
  id: string;
  referral_code: string;
  reward_amount: number;
  reward_paid: boolean;
  created_at: string;
}

const tierNames = {
  basic: "Basic",
  plus: "Plus",
  auto_plus: "AutoFloat",
};

const tierPrices = {
  basic: 15,
  plus: 25,
  auto_plus: 75,
};

const insuranceProviders = [
  "State Farm",
  "Geico",
  "Progressive",
  "Allstate",
  "USAA",
  "Liberty Mutual",
  "Other",
];

const bankNames = [
  "Chase",
  "Bank of America",
  "Wells Fargo",
  "Citibank",
  "Capital One",
  "Other Bank",
];

export default function SettingsPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const [addVehicleOpen, setAddVehicleOpen] = useState(false);
  const [newVehicleVin, setNewVehicleVin] = useState("");
  const [newVehiclePlate, setNewVehiclePlate] = useState("");
  const [newVehicleMake, setNewVehicleMake] = useState("");
  const [newVehicleModel, setNewVehicleModel] = useState("");
  const [newVehicleYear, setNewVehicleYear] = useState("");
  const [newVehicleInsurance, setNewVehicleInsurance] = useState("");

  const [addBankOpen, setAddBankOpen] = useState(false);
  const [newBankName, setNewBankName] = useState("");

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
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (profileData) setProfile(profileData as Profile);

      const { data: subData } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (subData) setSubscription(subData as Subscription);

      const { data: vehicleData } = await supabase
        .from("vehicles")
        .select("*")
        .eq("user_id", user!.id);

      if (vehicleData) setVehicles(vehicleData as Vehicle[]);

      const { data: bankData } = await supabase
        .from("bank_accounts")
        .select("*")
        .eq("user_id", user!.id);

      if (bankData) setBankAccounts(bankData as BankAccount[]);

      const { data: referralData } = await supabase
        .from("referrals")
        .select("*")
        .eq("referrer_id", user!.id);

      if (referralData) setReferrals(referralData as Referral[]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: editFirstName,
          last_name: editLastName,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({ title: "Profile updated!" });
      setEditProfileOpen(false);
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSettlementFrequency = async (frequency: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("subscriptions")
        .update({ settlement_frequency: frequency })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({ title: "Settlement frequency updated!" });
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settlement frequency.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSettlementTiming = async (timing: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("subscriptions")
        .update({ settlement_timing: timing })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({ title: "Settlement timing updated!" });
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settlement timing.",
        variant: "destructive",
      });
    }
  };

  const handleAddVehicle = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const { error } = await supabase.from("vehicles").insert({
        user_id: user.id,
        vin: newVehicleVin || null,
        license_plate: newVehiclePlate || null,
        make: newVehicleMake || null,
        model: newVehicleModel || null,
        year: newVehicleYear ? parseInt(newVehicleYear) : null,
        insurance_provider: newVehicleInsurance || null,
        is_verified: false,
      });

      if (error) throw error;

      toast({ title: "Vehicle added!" });
      setAddVehicleOpen(false);
      setNewVehicleVin("");
      setNewVehiclePlate("");
      setNewVehicleMake("");
      setNewVehicleModel("");
      setNewVehicleYear("");
      setNewVehicleInsurance("");
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add vehicle.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("vehicles")
        .delete()
        .eq("id", vehicleId)
        .eq("user_id", user.id);

      if (error) throw error;

      toast({ title: "Vehicle removed." });
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove vehicle.",
        variant: "destructive",
      });
    }
  };

  const handleAddBank = async () => {
    if (!user || !newBankName) return;
    setSaving(true);

    try {
      await supabase
        .from("bank_accounts")
        .update({ is_primary: false })
        .eq("user_id", user.id);

      const { error } = await supabase.from("bank_accounts").insert({
        user_id: user.id,
        bank_name: newBankName,
        account_last_four: "••••",
        is_primary: true,
        is_connected: true,
      });

      if (error) throw error;

      toast({ title: "Bank account added!" });
      setAddBankOpen(false);
      setNewBankName("");
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add bank account.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSetPrimaryBank = async (bankId: string) => {
    if (!user) return;

    try {
      await supabase
        .from("bank_accounts")
        .update({ is_primary: false })
        .eq("user_id", user.id);

      const { error } = await supabase
        .from("bank_accounts")
        .update({ is_primary: true })
        .eq("id", bankId);

      if (error) throw error;

      toast({ title: "Primary bank updated!" });
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update primary bank.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBank = async (bankId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("bank_accounts")
        .delete()
        .eq("id", bankId)
        .eq("user_id", user.id);

      if (error) throw error;

      toast({ title: "Bank account removed." });
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove bank account.",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleEditProfileClick = () => {
    setEditFirstName(profile?.first_name || "");
    setEditLastName(profile?.last_name || "");
    setEditProfileOpen(true);
  };

  const copyReferralCode = () => {
    const code = profile?.referral_code || `REF-${user?.id?.slice(0, 8).toUpperCase()}`;
    navigator.clipboard.writeText(code);
    toast({ title: "Copied!", description: "Referral code copied to clipboard." });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user) return null;

  const referralCode = profile?.referral_code || `REF-${user.id.slice(0, 8).toUpperCase()}`;
  const totalReferralEarnings = referrals.reduce((sum, r) => sum + (r.reward_paid ? r.reward_amount : 0), 0);
  const pendingReferralEarnings = referrals.reduce((sum, r) => sum + (!r.reward_paid ? r.reward_amount : 0), 0);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-8 md:py-12">
        <div className="container px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Manage your account, vehicles, and payment settings.</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="subscription">Plan</TabsTrigger>
              <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
              <TabsTrigger value="banks">Banks</TabsTrigger>
              <TabsTrigger value="referrals">Referrals</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Your account details</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEditProfileClick}
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/30">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Full Name</p>
                        <p className="font-medium">
                          {profile?.first_name} {profile?.last_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/30">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="font-medium">{profile?.email || user.email}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Document Verification</CardTitle>
                  <CardDescription>Your uploaded documents for verification</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Driver's License</p>
                        <p className="text-sm text-muted-foreground">
                          {profile?.drivers_license_url ? "Uploaded" : "Not uploaded"}
                        </p>
                      </div>
                    </div>
                    {profile?.drivers_license_url ? (
                      <Badge variant="success">Uploaded</Badge>
                    ) : (
                      <Badge variant="outline">Missing</Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Paystub</p>
                        <p className="text-sm text-muted-foreground">
                          {profile?.paystub_url ? "Uploaded" : "Not uploaded"}
                        </p>
                      </div>
                    </div>
                    {profile?.paystub_url ? (
                      <Badge variant="success">Uploaded</Badge>
                    ) : (
                      <Badge variant="outline">Missing</Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-accent/30 bg-accent/5">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-accent" />
                      <div>
                        <p className="font-medium">Verification Status</p>
                        <p className="text-sm text-muted-foreground">
                          {profile?.documents_verified ? "Your documents have been verified" : "Pending review"}
                        </p>
                      </div>
                    </div>
                    {profile?.documents_verified ? (
                      <Badge variant="success">Verified</Badge>
                    ) : (
                      <Badge variant="warning">Pending</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Manage your password and security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-3">
                      <Lock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Password</p>
                        <p className="text-sm text-muted-foreground">Last changed: Never</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Change Password
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-destructive/30">
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  <CardDescription>Irreversible actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="text-destructive" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscription" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>Your subscription details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-accent/10 border border-accent/30">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-6 w-6 text-accent" />
                      <div>
                        <p className="text-lg font-bold">
                          {subscription ? tierNames[subscription.tier] : "Basic"} Plan
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ${subscription ? tierPrices[subscription.tier] : 15}/month •{" "}
                          ${subscription?.access_limit || 500} access limit
                        </p>
                      </div>
                    </div>
                    <Badge variant="accent">Active</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-secondary/30">
                      <p className="text-sm text-muted-foreground mb-1">Access Used</p>
                      <p className="text-2xl font-bold">
                        ${subscription?.access_used || 0}
                        <span className="text-sm font-normal text-muted-foreground">
                          {" "}
                          / ${subscription?.access_limit || 500}
                        </span>
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/30">
                      <p className="text-sm text-muted-foreground mb-1">Next Settlement</p>
                      <p className="text-2xl font-bold">
                        {subscription?.next_settlement_date
                          ? format(new Date(subscription.next_settlement_date), "MMM d")
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label>Settlement Frequency</Label>
                      <Select
                        value={subscription?.settlement_frequency || "bi-weekly"}
                        onValueChange={handleUpdateSettlementFrequency}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        How often your balance is settled via ACH.
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <Label>Settlement Timing</Label>
                      <Select
                        value={subscription?.settlement_timing || "month-end"}
                        onValueChange={handleUpdateSettlementTiming}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select timing" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="month-end">Month End</SelectItem>
                          <SelectItem value="mid-month">Mid Month (15th)</SelectItem>
                          <SelectItem value="custom">Custom Date</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        When in the month your settlement occurs.
                      </p>
                    </div>
                  </div>

                  <Button variant="accent" className="w-full" onClick={() => navigate("/plans")}>
                    Upgrade Plan
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="vehicles" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Your Vehicles</CardTitle>
                      <CardDescription>Manage your verified vehicles</CardDescription>
                    </div>
                    <Button variant="accent" size="sm" onClick={() => setAddVehicleOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Vehicle
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {vehicles.length === 0 ? (
                    <div className="text-center py-12">
                      <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No vehicles added yet</p>
                      <Button variant="outline" className="mt-4" onClick={() => setAddVehicleOpen(true)}>
                        Add Your First Vehicle
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {vehicles.map((vehicle) => (
                        <div
                          key={vehicle.id}
                          className="p-4 rounded-lg border border-border space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center">
                                <Car className="h-6 w-6 text-foreground" />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {vehicle.year} {vehicle.make} {vehicle.model}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {vehicle.license_plate || vehicle.vin || "No ID"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {vehicle.is_verified ? (
                                <Badge variant="success" className="gap-1">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Verified
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="gap-1">
                                  <AlertCircle className="h-3 w-3" />
                                  Pending
                                </Badge>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive"
                                onClick={() => handleDeleteVehicle(vehicle.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                            <div className="flex items-center gap-3">
                              <Shield className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">Insurance</p>
                                <p className="text-xs text-muted-foreground">
                                  {vehicle.insurance_provider || "Not provided"}
                                </p>
                              </div>
                            </div>
                            {vehicle.insurance_verified ? (
                              <Badge variant="success" className="gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Verified
                              </Badge>
                            ) : (
                              <Badge variant="warning" className="gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Unverified
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="banks" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Bank Accounts</CardTitle>
                      <CardDescription>Manage your connected bank accounts</CardDescription>
                    </div>
                    <Button variant="accent" size="sm" onClick={() => setAddBankOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Bank
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {bankAccounts.length === 0 ? (
                    <div className="text-center py-12">
                      <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No bank accounts connected</p>
                      <Button variant="outline" className="mt-4" onClick={() => setAddBankOpen(true)}>
                        Connect Your Bank
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bankAccounts.map((bank) => (
                        <div
                          key={bank.id}
                          className="flex items-center justify-between p-4 rounded-lg border border-border"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center">
                              <Building2 className="h-6 w-6 text-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">{bank.bank_name}</p>
                              <p className="text-sm text-muted-foreground">
                                ••••{bank.account_last_four}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {bank.is_primary ? (
                              <Badge variant="accent">Primary</Badge>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSetPrimaryBank(bank.id)}
                              >
                                Set Primary
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                              onClick={() => handleDeleteBank(bank.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="referrals" className="space-y-6">
              <Card className="border-accent/30 bg-gradient-to-r from-accent/5 to-transparent">
                <CardContent className="py-6">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 shrink-0">
                      <Gift className="h-8 w-8 text-accent" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-xl font-bold text-foreground mb-1">Your Referral Code</h3>
                      <p className="text-muted-foreground">
                        Share this code with friends. You both get $5 when they sign up!
                      </p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-secondary border border-border">
                      <span className="text-lg font-mono font-bold text-foreground">{referralCode}</span>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={copyReferralCode}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="py-6 text-center">
                    <DollarSign className="h-8 w-8 text-accent mx-auto mb-2" />
                    <p className="text-2xl font-bold">${totalReferralEarnings}</p>
                    <p className="text-sm text-muted-foreground">Total Earned</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="py-6 text-center">
                    <Clock className="h-8 w-8 text-accent mx-auto mb-2" />
                    <p className="text-2xl font-bold">${pendingReferralEarnings}</p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="py-6 text-center">
                    <User className="h-8 w-8 text-accent mx-auto mb-2" />
                    <p className="text-2xl font-bold">{referrals.length}</p>
                    <p className="text-sm text-muted-foreground">Referrals</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Referral History</CardTitle>
                  <CardDescription>People who signed up with your code</CardDescription>
                </CardHeader>
                <CardContent>
                  {referrals.length === 0 ? (
                    <div className="text-center py-12">
                      <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No referrals yet</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Share your code to start earning!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {referrals.map((referral) => (
                        <div
                          key={referral.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-secondary/30"
                        >
                          <div>
                            <p className="font-medium">Referral</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(referral.created_at), "MMM d, yyyy")}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-accent">+${referral.reward_amount}</span>
                            {referral.reward_paid ? (
                              <Badge variant="success">Paid</Badge>
                            ) : (
                              <Badge variant="outline">Pending</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your personal information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input value={editFirstName} onChange={(e) => setEditFirstName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input value={editLastName} onChange={(e) => setEditLastName(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditProfileOpen(false)}>
              Cancel
            </Button>
            <Button variant="accent" onClick={handleUpdateProfile} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={addVehicleOpen} onOpenChange={setAddVehicleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Vehicle</DialogTitle>
            <DialogDescription>Add a new vehicle to your account</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Make</Label>
                <Input
                  placeholder="e.g., Honda"
                  value={newVehicleMake}
                  onChange={(e) => setNewVehicleMake(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Model</Label>
                <Input
                  placeholder="e.g., Civic"
                  value={newVehicleModel}
                  onChange={(e) => setNewVehicleModel(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Year</Label>
              <Input
                placeholder="e.g., 2020"
                value={newVehicleYear}
                onChange={(e) => setNewVehicleYear(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>VIN (optional)</Label>
              <Input
                placeholder="Vehicle Identification Number"
                value={newVehicleVin}
                onChange={(e) => setNewVehicleVin(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>License Plate (optional)</Label>
              <Input
                placeholder="e.g., ABC1234"
                value={newVehiclePlate}
                onChange={(e) => setNewVehiclePlate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Insurance Provider</Label>
              <Select value={newVehicleInsurance} onValueChange={setNewVehicleInsurance}>
                <SelectTrigger>
                  <SelectValue placeholder="Select insurance provider" />
                </SelectTrigger>
                <SelectContent>
                  {insuranceProviders.map((provider) => (
                    <SelectItem key={provider} value={provider}>
                      {provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddVehicleOpen(false)}>
              Cancel
            </Button>
            <Button variant="accent" onClick={handleAddVehicle} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Vehicle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={addBankOpen} onOpenChange={setAddBankOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Bank Account</DialogTitle>
            <DialogDescription>Connect a new bank account for settlements</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Bank Name</Label>
              <Select value={newBankName} onValueChange={setNewBankName}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your bank" />
                </SelectTrigger>
                <SelectContent>
                  {bankNames.map((bank) => (
                    <SelectItem key={bank} value={bank}>
                      {bank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddBankOpen(false)}>
              Cancel
            </Button>
            <Button variant="accent" onClick={handleAddBank} disabled={saving || !newBankName}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Connect Bank"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

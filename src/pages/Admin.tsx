import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, FileText, Search, Car, CreditCard,
  Landmark, Gift, Calendar
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { AdminStats } from "@/components/admin/AdminStats";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminTableWrapper, paginate } from "@/components/admin/AdminTableWrapper";
import { EmptyState } from "@/components/admin/EmptyState";

interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  documents_verified: boolean | null;
  created_at: string;
}

interface Bill {
  id: string;
  user_id: string;
  name: string;
  category: string;
  amount: number;
  due_date: string;
  status: string;
  created_at: string;
}

interface Subscription {
  id: string;
  user_id: string;
  tier: string;
  access_limit: number;
  access_used: number;
  is_active: boolean;
}

interface Vehicle {
  id: string;
  user_id: string;
  vin: string | null;
  license_plate: string | null;
  make: string | null;
  model: string | null;
  year: number | null;
  is_verified: boolean;
  insurance_verified: boolean;
  insurance_provider: string | null;
  created_at: string;
}

interface PaymentPlan {
  id: string;
  user_id: string;
  bill_id: string | null;
  total_amount: number;
  installment_amount: number;
  installments_total: number;
  installments_paid: number;
  amount_paid: number;
  status: string;
  next_payment_date: string | null;
  created_at: string;
}

interface PaymentInstallment {
  id: string;
  payment_plan_id: string;
  user_id: string;
  amount: number;
  due_date: string;
  status: string;
  paid_at: string | null;
}

interface BankAccount {
  id: string;
  user_id: string;
  bank_name: string;
  account_last_four: string | null;
  is_connected: boolean;
  is_primary: boolean;
  created_at: string;
}

interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  referral_code: string;
  reward_amount: number;
  reward_paid: boolean;
  created_at: string;
}

const ITEMS_PER_PAGE = 10;

const Admin = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([]);
  const [paymentInstallments, setPaymentInstallments] = useState<PaymentInstallment[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Record<string, number>>({
    users: 1,
    bills: 1,
    vehicles: 1,
    subscriptions: 1,
    paymentPlans: 1,
    bankAccounts: 1,
    referrals: 1
  });
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBills: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
    totalVehicles: 0,
    verifiedVehicles: 0,
    pendingBills: 0,
    paidBills: 0
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [profilesRes, billsRes, subsRes, vehiclesRes, plansRes, installmentsRes, bankRes, referralsRes] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("bills").select("*").order("created_at", { ascending: false }),
        supabase.from("subscriptions").select("*"),
        supabase.from("vehicles").select("*").order("created_at", { ascending: false }),
        supabase.from("payment_plans").select("*").order("created_at", { ascending: false }),
        supabase.from("payment_installments").select("*").order("due_date", { ascending: true }),
        supabase.from("bank_accounts").select("*").order("created_at", { ascending: false }),
        supabase.from("referrals").select("*").order("created_at", { ascending: false })
      ]);

      if (profilesRes.data) {
        setProfiles(profilesRes.data);
        setStats(prev => ({ ...prev, totalUsers: profilesRes.data.length }));
      }

      if (billsRes.data) {
        setBills(billsRes.data);
        const totalRevenue = billsRes.data.reduce((sum, bill) => sum + Number(bill.amount), 0);
        const pendingBills = billsRes.data.filter(b => b.status === 'pending').length;
        const paidBills = billsRes.data.filter(b => b.status === 'paid').length;
        setStats(prev => ({ ...prev, totalBills: billsRes.data.length, totalRevenue, pendingBills, paidBills }));
      }

      if (subsRes.data) {
        setSubscriptions(subsRes.data);
        const activeCount = subsRes.data.filter(s => s.is_active).length;
        setStats(prev => ({ ...prev, activeSubscriptions: activeCount }));
      }

      if (vehiclesRes.data) {
        setVehicles(vehiclesRes.data);
        const verifiedCount = vehiclesRes.data.filter(v => v.is_verified).length;
        setStats(prev => ({ ...prev, totalVehicles: vehiclesRes.data.length, verifiedVehicles: verifiedCount }));
      }

      if (plansRes.data) setPaymentPlans(plansRes.data);
      if (installmentsRes.data) setPaymentInstallments(installmentsRes.data);
      if (bankRes.data) setBankAccounts(bankRes.data);
      if (referralsRes.data) setReferrals(referralsRes.data);
    } finally {
      setLoading(false);
    }
  };

  // Edit functions
  const verifyUser = async (userId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("profiles")
      .update({ documents_verified: !currentStatus })
      .eq("user_id", userId);
    
    if (error) {
      toast.error("Failed to update user verification");
    } else {
      toast.success(`User ${!currentStatus ? 'verified' : 'unverified'}`);
      setProfiles(prev => prev.map(p => 
        p.user_id === userId ? { ...p, documents_verified: !currentStatus } : p
      ));
    }
  };

  const verifyVehicle = async (vehicleId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("vehicles")
      .update({ is_verified: !currentStatus })
      .eq("id", vehicleId);
    
    if (error) {
      toast.error("Failed to update vehicle verification");
    } else {
      toast.success(`Vehicle ${!currentStatus ? 'verified' : 'unverified'}`);
      setVehicles(prev => prev.map(v => 
        v.id === vehicleId ? { ...v, is_verified: !currentStatus } : v
      ));
      setStats(prev => ({
        ...prev,
        verifiedVehicles: prev.verifiedVehicles + (!currentStatus ? 1 : -1)
      }));
    }
  };

  const verifyInsurance = async (vehicleId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("vehicles")
      .update({ insurance_verified: !currentStatus })
      .eq("id", vehicleId);
    
    if (error) {
      toast.error("Failed to update insurance verification");
    } else {
      toast.success(`Insurance ${!currentStatus ? 'verified' : 'unverified'}`);
      setVehicles(prev => prev.map(v => 
        v.id === vehicleId ? { ...v, insurance_verified: !currentStatus } : v
      ));
    }
  };

  const updateBillStatus = async (billId: string, newStatus: 'pending' | 'paid' | 'failed' | 'scheduled') => {
    const { error } = await supabase
      .from("bills")
      .update({ 
        status: newStatus,
        paid_at: newStatus === 'paid' ? new Date().toISOString() : null
      })
      .eq("id", billId);
    
    if (error) {
      toast.error("Failed to update bill status");
    } else {
      toast.success(`Bill marked as ${newStatus}`);
      setBills(prev => prev.map(b => 
        b.id === billId ? { ...b, status: newStatus } : b
      ));
      const updatedBills = bills.map(b => b.id === billId ? { ...b, status: newStatus } : b);
      setStats(prev => ({
        ...prev,
        pendingBills: updatedBills.filter(b => b.status === 'pending').length,
        paidBills: updatedBills.filter(b => b.status === 'paid').length
      }));
    }
  };

  // Filter functions
  const filteredProfiles = profiles.filter(profile => 
    profile.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBills = bills.filter(bill =>
    bill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.vin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.license_plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = (tab: string, page: number) => {
    setCurrentPage(prev => ({ ...prev, [tab]: page }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground text-sm">Loading admin data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <AdminStats stats={stats} />

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users, bills, vehicles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 h-12 bg-card/50 border-border/50 focus:border-primary/50"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
            <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="bills" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FileText className="h-4 w-4 mr-2" />
              Bills
            </TabsTrigger>
            <TabsTrigger value="vehicles" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Car className="h-4 w-4 mr-2" />
              Vehicles
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <CreditCard className="h-4 w-4 mr-2" />
              Subscriptions
            </TabsTrigger>
            <TabsTrigger value="paymentPlans" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              Payment Plans
            </TabsTrigger>
            <TabsTrigger value="bankAccounts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Landmark className="h-4 w-4 mr-2" />
              Bank Accounts
            </TabsTrigger>
            <TabsTrigger value="referrals" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Gift className="h-4 w-4 mr-2" />
              Referrals
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <AdminTableWrapper
              title="User Management"
              description="View and manage all registered users"
              icon={<Users className="h-5 w-5" />}
              data={profiles}
              exportFilename="users"
              currentPage={currentPage.users}
              onPageChange={(page) => handlePageChange('users', page)}
            >
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Name</TableHead>
                    <TableHead className="text-muted-foreground">Email</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Joined</TableHead>
                    <TableHead className="text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginate(filteredProfiles, currentPage.users, ITEMS_PER_PAGE).map((profile) => (
                    <TableRow key={profile.id} className="border-border/50 hover:bg-muted/30">
                      <TableCell className="font-medium">
                        {profile.first_name || profile.last_name 
                          ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
                          : <span className="text-muted-foreground">N/A</span>}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{profile.email || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={profile.documents_verified ? "default" : "secondary"}
                          className={profile.documents_verified ? "bg-primary/20 text-primary" : ""}
                        >
                          {profile.documents_verified ? "Verified" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(profile.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => verifyUser(profile.user_id, profile.documents_verified || false)}
                          className="border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/50"
                        >
                          {profile.documents_verified ? "Unverify" : "Verify"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredProfiles.length === 0 && <EmptyState colSpan={5} message="No users found" />}
                </TableBody>
              </Table>
            </AdminTableWrapper>
          </TabsContent>

          {/* Bills Tab */}
          <TabsContent value="bills">
            <AdminTableWrapper
              title="Bill Management"
              description="View and manage all bills in the system"
              icon={<FileText className="h-5 w-5" />}
              data={bills}
              exportFilename="bills"
              currentPage={currentPage.bills}
              onPageChange={(page) => handlePageChange('bills', page)}
            >
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Bill Name</TableHead>
                    <TableHead className="text-muted-foreground">Category</TableHead>
                    <TableHead className="text-muted-foreground">Amount</TableHead>
                    <TableHead className="text-muted-foreground">Due Date</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginate(filteredBills, currentPage.bills, ITEMS_PER_PAGE).map((bill) => (
                    <TableRow key={bill.id} className="border-border/50 hover:bg-muted/30">
                      <TableCell className="font-medium">{bill.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-border/50">{bill.category}</Badge>
                      </TableCell>
                      <TableCell className="font-mono">${Number(bill.amount).toLocaleString()}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(bill.due_date), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={bill.status === "paid" ? "default" : bill.status === "pending" ? "secondary" : "destructive"}
                          className={bill.status === "paid" ? "bg-primary/20 text-primary" : ""}
                        >
                          {bill.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {bill.status !== 'paid' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateBillStatus(bill.id, 'paid')}
                              className="border-primary/50 text-primary hover:bg-primary/10"
                            >
                              Mark Paid
                            </Button>
                          )}
                          {bill.status === 'paid' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateBillStatus(bill.id, 'pending')}
                              className="border-border/50 hover:bg-muted/50"
                            >
                              Mark Pending
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredBills.length === 0 && <EmptyState colSpan={6} message="No bills found" />}
                </TableBody>
              </Table>
            </AdminTableWrapper>
          </TabsContent>

          {/* Vehicles Tab */}
          <TabsContent value="vehicles">
            <AdminTableWrapper
              title="Vehicle & VIN Management"
              description="View and manage all registered vehicles"
              icon={<Car className="h-5 w-5" />}
              data={vehicles}
              exportFilename="vehicles"
              currentPage={currentPage.vehicles}
              onPageChange={(page) => handlePageChange('vehicles', page)}
            >
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">VIN</TableHead>
                    <TableHead className="text-muted-foreground">License Plate</TableHead>
                    <TableHead className="text-muted-foreground">Vehicle</TableHead>
                    <TableHead className="text-muted-foreground">Insurance</TableHead>
                    <TableHead className="text-muted-foreground">Verified</TableHead>
                    <TableHead className="text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginate(filteredVehicles, currentPage.vehicles, ITEMS_PER_PAGE).map((vehicle) => (
                    <TableRow key={vehicle.id} className="border-border/50 hover:bg-muted/30">
                      <TableCell className="font-mono text-xs">
                        {vehicle.vin || <span className="text-muted-foreground">N/A</span>}
                      </TableCell>
                      <TableCell>{vehicle.license_plate || <span className="text-muted-foreground">N/A</span>}</TableCell>
                      <TableCell>
                        {vehicle.year && vehicle.make && vehicle.model 
                          ? `${vehicle.year} ${vehicle.make} ${vehicle.model}`
                          : <span className="text-muted-foreground">N/A</span>}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-muted-foreground">
                            {vehicle.insurance_provider || 'N/A'}
                          </span>
                          <Badge 
                            variant={vehicle.insurance_verified ? "default" : "secondary"} 
                            className={`w-fit ${vehicle.insurance_verified ? "bg-primary/20 text-primary" : ""}`}
                          >
                            {vehicle.insurance_verified ? "Verified" : "Pending"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={vehicle.is_verified ? "default" : "secondary"}
                          className={vehicle.is_verified ? "bg-primary/20 text-primary" : ""}
                        >
                          {vehicle.is_verified ? "Verified" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => verifyVehicle(vehicle.id, vehicle.is_verified)}
                            className="border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/50"
                          >
                            {vehicle.is_verified ? "Unverify" : "Verify"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => verifyInsurance(vehicle.id, vehicle.insurance_verified)}
                            className="border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/50"
                          >
                            {vehicle.insurance_verified ? "Unverify Ins." : "Verify Ins."}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredVehicles.length === 0 && <EmptyState colSpan={6} message="No vehicles found" />}
                </TableBody>
              </Table>
            </AdminTableWrapper>
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions">
            <AdminTableWrapper
              title="Subscriptions"
              description="View all subscription plans"
              icon={<CreditCard className="h-5 w-5" />}
              data={subscriptions}
              exportFilename="subscriptions"
              currentPage={currentPage.subscriptions}
              onPageChange={(page) => handlePageChange('subscriptions', page)}
            >
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">User ID</TableHead>
                    <TableHead className="text-muted-foreground">Tier</TableHead>
                    <TableHead className="text-muted-foreground">Access Used</TableHead>
                    <TableHead className="text-muted-foreground">Access Limit</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginate(subscriptions, currentPage.subscriptions, ITEMS_PER_PAGE).map((sub) => (
                    <TableRow key={sub.id} className="border-border/50 hover:bg-muted/30">
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {sub.user_id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize border-primary/50 text-primary">
                          {sub.tier}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">${sub.access_used}</TableCell>
                      <TableCell className="font-mono">${sub.access_limit}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={sub.is_active ? "default" : "secondary"}
                          className={sub.is_active ? "bg-primary/20 text-primary" : ""}
                        >
                          {sub.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {subscriptions.length === 0 && <EmptyState colSpan={5} message="No subscriptions found" />}
                </TableBody>
              </Table>
            </AdminTableWrapper>
          </TabsContent>

          {/* Payment Plans Tab */}
          <TabsContent value="paymentPlans">
            <AdminTableWrapper
              title="Payment Plans"
              description="View all payment plans and installments"
              icon={<Calendar className="h-5 w-5" />}
              data={paymentPlans}
              exportFilename="payment-plans"
              currentPage={currentPage.paymentPlans}
              onPageChange={(page) => handlePageChange('paymentPlans', page)}
            >
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">User ID</TableHead>
                    <TableHead className="text-muted-foreground">Total Amount</TableHead>
                    <TableHead className="text-muted-foreground">Progress</TableHead>
                    <TableHead className="text-muted-foreground">Next Payment</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginate(paymentPlans, currentPage.paymentPlans, ITEMS_PER_PAGE).map((plan) => (
                    <TableRow key={plan.id} className="border-border/50 hover:bg-muted/30">
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {plan.user_id.slice(0, 8)}...
                      </TableCell>
                      <TableCell className="font-mono">${plan.total_amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full transition-all"
                                style={{ width: `${(plan.installments_paid / plan.installments_total) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {plan.installments_paid}/{plan.installments_total}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ${plan.amount_paid} paid
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {plan.next_payment_date 
                          ? format(new Date(plan.next_payment_date), "MMM d, yyyy")
                          : <span className="text-muted-foreground">N/A</span>}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={plan.status === 'active' ? "default" : "secondary"}
                          className={plan.status === 'active' ? "bg-primary/20 text-primary" : ""}
                        >
                          {plan.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {paymentPlans.length === 0 && <EmptyState colSpan={5} message="No payment plans found" />}
                </TableBody>
              </Table>
            </AdminTableWrapper>
          </TabsContent>

          {/* Bank Accounts Tab */}
          <TabsContent value="bankAccounts">
            <AdminTableWrapper
              title="Bank Accounts"
              description="View all linked bank accounts"
              icon={<Landmark className="h-5 w-5" />}
              data={bankAccounts}
              exportFilename="bank-accounts"
              currentPage={currentPage.bankAccounts}
              onPageChange={(page) => handlePageChange('bankAccounts', page)}
            >
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">User ID</TableHead>
                    <TableHead className="text-muted-foreground">Bank Name</TableHead>
                    <TableHead className="text-muted-foreground">Account</TableHead>
                    <TableHead className="text-muted-foreground">Primary</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Added</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginate(bankAccounts, currentPage.bankAccounts, ITEMS_PER_PAGE).map((account) => (
                    <TableRow key={account.id} className="border-border/50 hover:bg-muted/30">
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {account.user_id.slice(0, 8)}...
                      </TableCell>
                      <TableCell className="font-medium">{account.bank_name}</TableCell>
                      <TableCell className="font-mono">
                        {account.account_last_four ? `****${account.account_last_four}` : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {account.is_primary && (
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Primary</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={account.is_connected ? "default" : "destructive"}
                          className={account.is_connected ? "bg-primary/20 text-primary" : ""}
                        >
                          {account.is_connected ? "Connected" : "Disconnected"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(account.created_at), "MMM d, yyyy")}
                      </TableCell>
                    </TableRow>
                  ))}
                  {bankAccounts.length === 0 && <EmptyState colSpan={6} message="No bank accounts found" />}
                </TableBody>
              </Table>
            </AdminTableWrapper>
          </TabsContent>

          {/* Referrals Tab */}
          <TabsContent value="referrals">
            <AdminTableWrapper
              title="Referrals"
              description="View all referral activity"
              icon={<Gift className="h-5 w-5" />}
              data={referrals}
              exportFilename="referrals"
              currentPage={currentPage.referrals}
              onPageChange={(page) => handlePageChange('referrals', page)}
            >
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Referrer ID</TableHead>
                    <TableHead className="text-muted-foreground">Referred ID</TableHead>
                    <TableHead className="text-muted-foreground">Code</TableHead>
                    <TableHead className="text-muted-foreground">Reward</TableHead>
                    <TableHead className="text-muted-foreground">Paid</TableHead>
                    <TableHead className="text-muted-foreground">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginate(referrals, currentPage.referrals, ITEMS_PER_PAGE).map((referral) => (
                    <TableRow key={referral.id} className="border-border/50 hover:bg-muted/30">
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {referral.referrer_id.slice(0, 8)}...
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {referral.referred_id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono border-border/50">
                          {referral.referral_code}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-primary">${referral.reward_amount}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={referral.reward_paid ? "default" : "secondary"}
                          className={referral.reward_paid ? "bg-primary/20 text-primary" : ""}
                        >
                          {referral.reward_paid ? "Paid" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(referral.created_at), "MMM d, yyyy")}
                      </TableCell>
                    </TableRow>
                  ))}
                  {referrals.length === 0 && <EmptyState colSpan={6} message="No referrals found" />}
                </TableBody>
              </Table>
            </AdminTableWrapper>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;

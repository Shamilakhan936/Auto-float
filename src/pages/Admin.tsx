import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, FileText, Shield, Search, ArrowLeft, Car, CheckCircle, XCircle, 
  DollarSign, Activity, Download, ChevronLeft, ChevronRight, CreditCard,
  Landmark, Gift, Calendar
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

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
  const navigate = useNavigate();
  
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
      // Fetch profiles
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (profilesData) {
        setProfiles(profilesData);
        setStats(prev => ({ ...prev, totalUsers: profilesData.length }));
      }

      // Fetch bills
      const { data: billsData } = await supabase
        .from("bills")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (billsData) {
        setBills(billsData);
        const totalRevenue = billsData.reduce((sum, bill) => sum + Number(bill.amount), 0);
        const pendingBills = billsData.filter(b => b.status === 'pending').length;
        const paidBills = billsData.filter(b => b.status === 'paid').length;
        setStats(prev => ({ 
          ...prev, 
          totalBills: billsData.length,
          totalRevenue,
          pendingBills,
          paidBills
        }));
      }

      // Fetch subscriptions
      const { data: subsData } = await supabase
        .from("subscriptions")
        .select("*");
      
      if (subsData) {
        setSubscriptions(subsData);
        const activeCount = subsData.filter(s => s.is_active).length;
        setStats(prev => ({ ...prev, activeSubscriptions: activeCount }));
      }

      // Fetch vehicles
      const { data: vehiclesData } = await supabase
        .from("vehicles")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (vehiclesData) {
        setVehicles(vehiclesData);
        const verifiedCount = vehiclesData.filter(v => v.is_verified).length;
        setStats(prev => ({ 
          ...prev, 
          totalVehicles: vehiclesData.length,
          verifiedVehicles: verifiedCount
        }));
      }

      // Fetch payment plans
      const { data: plansData } = await supabase
        .from("payment_plans")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (plansData) {
        setPaymentPlans(plansData);
      }

      // Fetch payment installments
      const { data: installmentsData } = await supabase
        .from("payment_installments")
        .select("*")
        .order("due_date", { ascending: true });
      
      if (installmentsData) {
        setPaymentInstallments(installmentsData);
      }

      // Fetch bank accounts
      const { data: bankData } = await supabase
        .from("bank_accounts")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (bankData) {
        setBankAccounts(bankData);
      }

      // Fetch referrals
      const { data: referralsData } = await supabase
        .from("referrals")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (referralsData) {
        setReferrals(referralsData);
      }
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
      // Update stats
      const updatedBills = bills.map(b => b.id === billId ? { ...b, status: newStatus } : b);
      setStats(prev => ({
        ...prev,
        pendingBills: updatedBills.filter(b => b.status === 'pending').length,
        paidBills: updatedBills.filter(b => b.status === 'paid').length
      }));
    }
  };

  // Export functions
  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      toast.error("No data to export");
      return;
    }
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => 
      Object.values(item).map(val => 
        typeof val === 'string' ? `"${val}"` : val
      ).join(',')
    ).join('\n');
    
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${data.length} records`);
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

  // Pagination helper
  const paginate = <T,>(items: T[], page: number) => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  };

  const totalPages = (items: any[]) => Math.ceil(items.length / ITEMS_PER_PAGE);

  const PaginationControls = ({ tab, items }: { tab: string; items: any[] }) => {
    const total = totalPages(items);
    if (total <= 1) return null;
    
    return (
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <span className="text-sm text-muted-foreground">
          Page {currentPage[tab]} of {total} ({items.length} total)
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => ({ ...prev, [tab]: prev[tab] - 1 }))}
            disabled={currentPage[tab] === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => ({ ...prev, [tab]: prev[tab] + 1 }))}
            disabled={currentPage[tab] >= total}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold">Admin Panel</h1>
              </div>
            </div>
            <Badge variant="outline" className="text-primary border-primary">
              Administrator
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Active Subs</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Total Bills</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBills}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Pending</CardTitle>
              <XCircle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{stats.pendingBills}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Paid</CardTitle>
              <CheckCircle className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.paidBills}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Bill Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Vehicles</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVehicles}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Verified</CardTitle>
              <Shield className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.verifiedVehicles}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users, bills, vehicles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="bills">Bills</TabsTrigger>
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="paymentPlans">Payment Plans</TabsTrigger>
            <TabsTrigger value="bankAccounts">Bank Accounts</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>View and manage all registered users</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => exportToCSV(profiles, 'users')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Verified</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginate(filteredProfiles, currentPage.users).map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell className="font-medium">
                          {profile.first_name || profile.last_name 
                            ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
                            : 'N/A'}
                        </TableCell>
                        <TableCell>{profile.email || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant={profile.documents_verified ? "default" : "secondary"}>
                            {profile.documents_verified ? "Verified" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(profile.created_at), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => verifyUser(profile.user_id, profile.documents_verified || false)}
                          >
                            {profile.documents_verified ? "Unverify" : "Verify"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredProfiles.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          No users found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <PaginationControls tab="users" items={filteredProfiles} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bills Tab */}
          <TabsContent value="bills">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Bill Management</CardTitle>
                  <CardDescription>View all bills in the system</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => exportToCSV(bills, 'bills')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bill Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginate(filteredBills, currentPage.bills).map((bill) => (
                      <TableRow key={bill.id}>
                        <TableCell className="font-medium">{bill.name}</TableCell>
                        <TableCell>{bill.category}</TableCell>
                        <TableCell>${Number(bill.amount).toLocaleString()}</TableCell>
                        <TableCell>{format(new Date(bill.due_date), "MMM d, yyyy")}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              bill.status === "paid" ? "default" : 
                              bill.status === "pending" ? "secondary" : "destructive"
                            }
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
                              >
                                Mark Paid
                              </Button>
                            )}
                            {bill.status === 'paid' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateBillStatus(bill.id, 'pending')}
                              >
                                Mark Pending
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredBills.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                          No bills found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <PaginationControls tab="bills" items={filteredBills} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vehicles Tab */}
          <TabsContent value="vehicles">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Vehicle & VIN Management</CardTitle>
                  <CardDescription>View and manage all registered vehicles</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => exportToCSV(vehicles, 'vehicles')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>VIN</TableHead>
                      <TableHead>License Plate</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Insurance</TableHead>
                      <TableHead>Verified</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginate(filteredVehicles, currentPage.vehicles).map((vehicle) => (
                      <TableRow key={vehicle.id}>
                        <TableCell className="font-mono text-xs">
                          {vehicle.vin || 'N/A'}
                        </TableCell>
                        <TableCell>{vehicle.license_plate || 'N/A'}</TableCell>
                        <TableCell>
                          {vehicle.year && vehicle.make && vehicle.model 
                            ? `${vehicle.year} ${vehicle.make} ${vehicle.model}`
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground">
                              {vehicle.insurance_provider || 'N/A'}
                            </span>
                            <Badge variant={vehicle.insurance_verified ? "default" : "secondary"} className="w-fit">
                              {vehicle.insurance_verified ? "Verified" : "Pending"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={vehicle.is_verified ? "default" : "secondary"}>
                            {vehicle.is_verified ? "Verified" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2 flex-wrap">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => verifyVehicle(vehicle.id, vehicle.is_verified)}
                            >
                              {vehicle.is_verified ? "Unverify" : "Verify"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => verifyInsurance(vehicle.id, vehicle.insurance_verified)}
                            >
                              {vehicle.insurance_verified ? "Unverify Ins." : "Verify Ins."}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredVehicles.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                          No vehicles found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <PaginationControls tab="vehicles" items={filteredVehicles} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Subscriptions</CardTitle>
                  <CardDescription>View all subscription plans</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => exportToCSV(subscriptions, 'subscriptions')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead>Access Used</TableHead>
                      <TableHead>Access Limit</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginate(subscriptions, currentPage.subscriptions).map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell className="font-mono text-xs">{sub.user_id.slice(0, 8)}...</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">{sub.tier}</Badge>
                        </TableCell>
                        <TableCell>${sub.access_used}</TableCell>
                        <TableCell>${sub.access_limit}</TableCell>
                        <TableCell>
                          <Badge variant={sub.is_active ? "default" : "secondary"}>
                            {sub.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {subscriptions.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          No subscriptions found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <PaginationControls tab="subscriptions" items={subscriptions} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Plans Tab */}
          <TabsContent value="paymentPlans">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Payment Plans
                  </CardTitle>
                  <CardDescription>View all payment plans and installments</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => exportToCSV(paymentPlans, 'payment-plans')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Installment</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Amount Paid</TableHead>
                      <TableHead>Next Payment</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginate(paymentPlans, currentPage.paymentPlans).map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell className="font-mono text-xs">{plan.user_id.slice(0, 8)}...</TableCell>
                        <TableCell>${Number(plan.total_amount).toLocaleString()}</TableCell>
                        <TableCell>${Number(plan.installment_amount).toLocaleString()}</TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {plan.installments_paid} / {plan.installments_total}
                          </span>
                        </TableCell>
                        <TableCell>${Number(plan.amount_paid).toLocaleString()}</TableCell>
                        <TableCell>
                          {plan.next_payment_date 
                            ? format(new Date(plan.next_payment_date), "MMM d, yyyy")
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={plan.status === 'active' ? "default" : "secondary"}>
                            {plan.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {paymentPlans.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground">
                          No payment plans found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <PaginationControls tab="paymentPlans" items={paymentPlans} />

                {/* Installments Sub-section */}
                {paymentInstallments.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Recent Installments</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Plan ID</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Paid At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paymentInstallments.slice(0, 10).map((inst) => (
                          <TableRow key={inst.id}>
                            <TableCell className="font-mono text-xs">{inst.payment_plan_id.slice(0, 8)}...</TableCell>
                            <TableCell>${Number(inst.amount).toLocaleString()}</TableCell>
                            <TableCell>{format(new Date(inst.due_date), "MMM d, yyyy")}</TableCell>
                            <TableCell>
                              <Badge variant={inst.status === 'paid' ? "default" : "secondary"}>
                                {inst.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {inst.paid_at 
                                ? format(new Date(inst.paid_at), "MMM d, yyyy")
                                : '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bank Accounts Tab */}
          <TabsContent value="bankAccounts">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Landmark className="h-5 w-5" />
                    Bank Accounts
                  </CardTitle>
                  <CardDescription>View all linked bank accounts</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => exportToCSV(bankAccounts, 'bank-accounts')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Bank Name</TableHead>
                      <TableHead>Account</TableHead>
                      <TableHead>Connected</TableHead>
                      <TableHead>Primary</TableHead>
                      <TableHead>Added</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginate(bankAccounts, currentPage.bankAccounts).map((account) => (
                      <TableRow key={account.id}>
                        <TableCell className="font-mono text-xs">{account.user_id.slice(0, 8)}...</TableCell>
                        <TableCell>{account.bank_name}</TableCell>
                        <TableCell>
                          {account.account_last_four ? `****${account.account_last_four}` : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={account.is_connected ? "default" : "destructive"}>
                            {account.is_connected ? "Connected" : "Disconnected"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {account.is_primary && (
                            <Badge variant="outline">Primary</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {format(new Date(account.created_at), "MMM d, yyyy")}
                        </TableCell>
                      </TableRow>
                    ))}
                    {bankAccounts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                          No bank accounts found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <PaginationControls tab="bankAccounts" items={bankAccounts} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Referrals Tab */}
          <TabsContent value="referrals">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    Referrals
                  </CardTitle>
                  <CardDescription>View all referral data</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => exportToCSV(referrals, 'referrals')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Referrer ID</TableHead>
                      <TableHead>Referred ID</TableHead>
                      <TableHead>Referral Code</TableHead>
                      <TableHead>Reward</TableHead>
                      <TableHead>Paid</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginate(referrals, currentPage.referrals).map((ref) => (
                      <TableRow key={ref.id}>
                        <TableCell className="font-mono text-xs">{ref.referrer_id.slice(0, 8)}...</TableCell>
                        <TableCell className="font-mono text-xs">{ref.referred_id.slice(0, 8)}...</TableCell>
                        <TableCell>
                          <Badge variant="outline">{ref.referral_code}</Badge>
                        </TableCell>
                        <TableCell>${Number(ref.reward_amount).toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={ref.reward_paid ? "default" : "secondary"}>
                            {ref.reward_paid ? "Paid" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(ref.created_at), "MMM d, yyyy")}
                        </TableCell>
                      </TableRow>
                    ))}
                    {referrals.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                          No referrals found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <PaginationControls tab="referrals" items={referrals} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;

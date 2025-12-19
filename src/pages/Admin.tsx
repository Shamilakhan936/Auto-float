import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Users, FileText, Search, Car, CreditCard,
  Landmark, Gift, Calendar, Eye, Pencil, Trash2, MoreHorizontal,
  RefreshCw, BarChart3
} from "lucide-react";
import { format, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";
import { toast } from "sonner";
import { AdminStats } from "@/components/admin/AdminStats";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminTableWrapper, paginate } from "@/components/admin/AdminTableWrapper";
import { EmptyState } from "@/components/admin/EmptyState";
import { UserDetailDialog } from "@/components/admin/UserDetailDialog";
import { EditUserDialog } from "@/components/admin/EditUserDialog";
import { EditBillDialog } from "@/components/admin/EditBillDialog";
import { EditVehicleDialog } from "@/components/admin/EditVehicleDialog";
import { EditSubscriptionDialog } from "@/components/admin/EditSubscriptionDialog";
import { EditPaymentPlanDialog } from "@/components/admin/EditPaymentPlanDialog";
import { EditBankAccountDialog } from "@/components/admin/EditBankAccountDialog";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { AdminFilters } from "@/components/admin/AdminFilters";
import { AdminCharts } from "@/components/admin/AdminCharts";
import { SortableTableHead } from "@/components/admin/SortableTableHead";
import { BulkActions } from "@/components/admin/BulkActions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  documents_verified: boolean | null;
  created_at: string;
  drivers_license_url?: string | null;
  paystub_url?: string | null;
  car_insurance_url?: string | null;
  referral_code?: string | null;
  referred_by?: string | null;
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

type SortConfig = { column: string; direction: 'asc' | 'desc' } | null;
type DeleteType = 'user' | 'bill' | 'vehicle' | 'subscription' | 'paymentPlan' | 'bankAccount' | 'referral';

const ITEMS_PER_PAGE = 10;

const STATUS_OPTIONS = {
  bills: [
    { value: 'pending', label: 'Pending' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'paid', label: 'Paid' },
    { value: 'failed', label: 'Failed' }
  ],
  subscriptions: [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ],
  vehicles: [
    { value: 'verified', label: 'Verified' },
    { value: 'pending', label: 'Pending' }
  ],
  paymentPlans: [
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'paused', label: 'Paused' },
    { value: 'cancelled', label: 'Cancelled' }
  ],
  bankAccounts: [
    { value: 'connected', label: 'Connected' },
    { value: 'disconnected', label: 'Disconnected' }
  ],
  referrals: [
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Pending' }
  ]
};

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
  const [refreshing, setRefreshing] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [currentPage, setCurrentPage] = useState<Record<string, number>>({
    users: 1, bills: 1, vehicles: 1, subscriptions: 1, paymentPlans: 1, bankAccounts: 1, referrals: 1
  });
  const [stats, setStats] = useState({
    totalUsers: 0, totalBills: 0, totalRevenue: 0, activeSubscriptions: 0,
    totalVehicles: 0, verifiedVehicles: 0, pendingBills: 0, paidBills: 0
  });

  // Filter states
  const [activeTab, setActiveTab] = useState("users");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  // Sort states
  const [sortConfig, setSortConfig] = useState<Record<string, SortConfig>>({});

  // Selection states
  const [selectedItems, setSelectedItems] = useState<Record<string, Set<string>>>({
    users: new Set(), bills: new Set(), vehicles: new Set(), subscriptions: new Set(),
    paymentPlans: new Set(), bankAccounts: new Set(), referrals: new Set()
  });

  // Dialog states
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [userDetailOpen, setUserDetailOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [editBillOpen, setEditBillOpen] = useState(false);
  
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [editVehicleOpen, setEditVehicleOpen] = useState(false);

  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [editSubscriptionOpen, setEditSubscriptionOpen] = useState(false);

  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState<PaymentPlan | null>(null);
  const [editPaymentPlanOpen, setEditPaymentPlanOpen] = useState(false);

  const [selectedBankAccount, setSelectedBankAccount] = useState<BankAccount | null>(null);
  const [editBankAccountOpen, setEditBankAccountOpen] = useState(false);

  // Delete states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<DeleteType | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async (showRefreshToast = false) => {
    if (showRefreshToast) setRefreshing(true);
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
        setStats(prev => ({ ...prev, activeSubscriptions: subsRes.data.filter(s => s.is_active).length }));
      }
      if (vehiclesRes.data) {
        setVehicles(vehiclesRes.data);
        setStats(prev => ({ 
          ...prev, 
          totalVehicles: vehiclesRes.data.length, 
          verifiedVehicles: vehiclesRes.data.filter(v => v.is_verified).length 
        }));
      }
      if (plansRes.data) setPaymentPlans(plansRes.data);
      if (installmentsRes.data) setPaymentInstallments(installmentsRes.data);
      if (bankRes.data) setBankAccounts(bankRes.data);
      if (referralsRes.data) setReferrals(referralsRes.data);

      if (showRefreshToast) toast.success("Data refreshed");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Chart data
  const subscriptionTiers = useMemo(() => {
    const counts: Record<string, number> = {};
    subscriptions.forEach(s => { counts[s.tier] = (counts[s.tier] || 0) + 1; });
    return Object.entries(counts).map(([tier, count]) => ({ tier: tier.charAt(0).toUpperCase() + tier.slice(1), count }));
  }, [subscriptions]);

  const billCategories = useMemo(() => {
    const amounts: Record<string, number> = {};
    bills.forEach(b => { amounts[b.category] = (amounts[b.category] || 0) + Number(b.amount); });
    return Object.entries(amounts)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [bills]);

  const monthlyTrend = useMemo(() => {
    const months: Record<string, { users: number; bills: number }> = {};
    profiles.forEach(p => {
      const month = format(new Date(p.created_at), 'MMM');
      if (!months[month]) months[month] = { users: 0, bills: 0 };
      months[month].users++;
    });
    bills.forEach(b => {
      const month = format(new Date(b.created_at), 'MMM');
      if (!months[month]) months[month] = { users: 0, bills: 0 };
      months[month].bills++;
    });
    return Object.entries(months).map(([month, data]) => ({ month, ...data })).slice(-6);
  }, [profiles, bills]);

  // Sorting
  const handleSort = (tab: string, column: string) => {
    setSortConfig(prev => ({
      ...prev,
      [tab]: prev[tab]?.column === column
        ? { column, direction: prev[tab]?.direction === 'asc' ? 'desc' : 'asc' }
        : { column, direction: 'asc' }
    }));
  };

  const sortData = <T extends Record<string, any>>(data: T[], tab: string): T[] => {
    const config = sortConfig[tab];
    if (!config) return data;
    return [...data].sort((a, b) => {
      const aVal = a[config.column];
      const bVal = b[config.column];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const comparison = typeof aVal === 'string' ? aVal.localeCompare(bVal) : aVal - bVal;
      return config.direction === 'asc' ? comparison : -comparison;
    });
  };

  // Selection
  const toggleSelection = (tab: string, id: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev[tab]);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return { ...prev, [tab]: newSet };
    });
  };

  const toggleSelectAll = (tab: string, items: { id: string }[], checked: boolean) => {
    setSelectedItems(prev => ({
      ...prev,
      [tab]: checked ? new Set(items.map(i => i.id)) : new Set()
    }));
  };

  // Update handlers
  const handleUserUpdate = (updatedUser: Profile) => {
    setProfiles(prev => prev.map(p => p.user_id === updatedUser.user_id ? updatedUser : p));
  };

  const handleBillUpdate = (updatedBill: Bill) => {
    setBills(prev => prev.map(b => b.id === updatedBill.id ? updatedBill : b));
  };

  const handleVehicleUpdate = (updatedVehicle: Vehicle) => {
    setVehicles(prev => prev.map(v => v.id === updatedVehicle.id ? updatedVehicle : v));
  };

  const handleSubscriptionUpdate = (updatedSub: Subscription) => {
    setSubscriptions(prev => prev.map(s => s.id === updatedSub.id ? updatedSub : s));
  };

  const handlePaymentPlanUpdate = (updatedPlan: PaymentPlan) => {
    setPaymentPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
  };

  const handleBankAccountUpdate = (updatedAccount: BankAccount) => {
    setBankAccounts(prev => prev.map(a => a.id === updatedAccount.id ? updatedAccount : a));
  };

  // Delete handlers
  const openDeleteDialog = (type: DeleteType, id: string) => {
    setDeleteType(type);
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteType || !deleteId) return;
    setDeleting(true);
    
    const tableMap: Record<DeleteType, string> = {
      user: 'profiles', bill: 'bills', vehicle: 'vehicles',
      subscription: 'subscriptions', paymentPlan: 'payment_plans',
      bankAccount: 'bank_accounts', referral: 'referrals'
    };
    
    const idField = deleteType === 'user' ? 'user_id' : 'id';
    const { error } = await supabase.from(tableMap[deleteType] as any).delete().eq(idField, deleteId);

    setDeleting(false);
    setDeleteDialogOpen(false);

    if (error) {
      toast.error(`Failed to delete ${deleteType}`);
    } else {
      toast.success(`${deleteType.charAt(0).toUpperCase() + deleteType.slice(1)} deleted`);
      fetchAdminData();
    }
  };

  const handleBulkDelete = async () => {
    const selected = selectedItems[activeTab];
    if (selected.size === 0) return;

    setDeleting(true);
    const tableMap: Record<string, string> = {
      users: 'profiles', bills: 'bills', vehicles: 'vehicles',
      subscriptions: 'subscriptions', paymentPlans: 'payment_plans',
      bankAccounts: 'bank_accounts', referrals: 'referrals'
    };

    const idField = activeTab === 'users' ? 'user_id' : 'id';
    const { error } = await supabase.from(tableMap[activeTab] as any).delete().in(idField, Array.from(selected));

    setDeleting(false);
    setBulkDeleteDialogOpen(false);

    if (error) {
      toast.error(`Failed to delete items`);
    } else {
      toast.success(`${selected.size} items deleted`);
      setSelectedItems(prev => ({ ...prev, [activeTab]: new Set() }));
      fetchAdminData();
    }
  };

  // Filter helpers
  const applyDateFilter = <T extends { created_at: string }>(items: T[]): T[] => {
    return items.filter(item => {
      const date = new Date(item.created_at);
      if (dateFrom && isBefore(date, startOfDay(dateFrom))) return false;
      if (dateTo && isAfter(date, endOfDay(dateTo))) return false;
      return true;
    });
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  // Filtered data
  const filteredProfiles = useMemo(() => {
    let data = profiles.filter(profile => 
      profile.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (statusFilter !== 'all') {
      data = data.filter(p => statusFilter === 'verified' ? p.documents_verified : !p.documents_verified);
    }
    return sortData(applyDateFilter(data), 'users');
  }, [profiles, searchTerm, statusFilter, dateFrom, dateTo, sortConfig]);

  const filteredBills = useMemo(() => {
    let data = bills.filter(bill =>
      bill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (statusFilter !== 'all') data = data.filter(b => b.status === statusFilter);
    return sortData(applyDateFilter(data), 'bills');
  }, [bills, searchTerm, statusFilter, dateFrom, dateTo, sortConfig]);

  const filteredVehicles = useMemo(() => {
    let data = vehicles.filter(vehicle =>
      vehicle.vin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.license_plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.make?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (statusFilter !== 'all') {
      data = data.filter(v => statusFilter === 'verified' ? v.is_verified : !v.is_verified);
    }
    return sortData(applyDateFilter(data), 'vehicles');
  }, [vehicles, searchTerm, statusFilter, dateFrom, dateTo, sortConfig]);

  const filteredSubscriptions = useMemo(() => {
    let data = subscriptions;
    if (statusFilter !== 'all') {
      data = data.filter(s => statusFilter === 'active' ? s.is_active : !s.is_active);
    }
    return sortData(data, 'subscriptions');
  }, [subscriptions, statusFilter, sortConfig]);

  const filteredPaymentPlans = useMemo(() => {
    let data = paymentPlans;
    if (statusFilter !== 'all') data = data.filter(p => p.status === statusFilter);
    return sortData(applyDateFilter(data), 'paymentPlans');
  }, [paymentPlans, statusFilter, dateFrom, dateTo, sortConfig]);

  const filteredBankAccounts = useMemo(() => {
    let data = bankAccounts;
    if (statusFilter !== 'all') {
      data = data.filter(a => statusFilter === 'connected' ? a.is_connected : !a.is_connected);
    }
    return sortData(applyDateFilter(data), 'bankAccounts');
  }, [bankAccounts, statusFilter, dateFrom, dateTo, sortConfig]);

  const filteredReferrals = useMemo(() => {
    let data = referrals;
    if (statusFilter !== 'all') {
      data = data.filter(r => statusFilter === 'paid' ? r.reward_paid : !r.reward_paid);
    }
    return sortData(applyDateFilter(data), 'referrals');
  }, [referrals, statusFilter, dateFrom, dateTo, sortConfig]);

  const handlePageChange = (tab: string, page: number) => {
    setCurrentPage(prev => ({ ...prev, [tab]: page }));
  };

  const getDeleteDescription = () => {
    const descriptions: Record<DeleteType, string> = {
      user: "This will permanently delete the user profile.",
      bill: "This will permanently delete this bill record.",
      vehicle: "This will permanently delete this vehicle record.",
      subscription: "This will permanently delete this subscription.",
      paymentPlan: "This will permanently delete this payment plan.",
      bankAccount: "This will permanently delete this bank account.",
      referral: "This will permanently delete this referral record."
    };
    return deleteType ? descriptions[deleteType] : "";
  };

  const getCurrentStatusOptions = () => {
    const optionsMap: Record<string, typeof STATUS_OPTIONS.bills> = {
      users: [{ value: 'verified', label: 'Verified' }, { value: 'pending', label: 'Pending' }],
      bills: STATUS_OPTIONS.bills,
      vehicles: STATUS_OPTIONS.vehicles,
      subscriptions: STATUS_OPTIONS.subscriptions,
      paymentPlans: STATUS_OPTIONS.paymentPlans,
      bankAccounts: STATUS_OPTIONS.bankAccounts,
      referrals: STATUS_OPTIONS.referrals
    };
    return optionsMap[activeTab] || [];
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
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-info/5 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        <AdminHeader />

        <div className="container mx-auto px-6 py-8 space-y-8">
          <AdminStats stats={stats} />

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-card/80 via-card/50 to-card/80 backdrop-blur-sm border border-border/20 shadow-lg">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 h-11 bg-background/50 border-border/30 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCharts(!showCharts)}
              className={`gap-2 h-11 px-4 rounded-xl border-border/30 transition-all ${showCharts ? 'bg-primary/10 text-primary border-primary/30' : 'hover:bg-muted/50'}`}
            >
              <BarChart3 className="h-4 w-4" />
              {showCharts ? 'Hide' : 'Show'} Charts
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchAdminData(true)}
              disabled={refreshing}
              className="gap-2 h-11 px-4 rounded-xl border-border/30 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Charts */}
          {showCharts && (
            <AdminCharts
              stats={stats}
              subscriptionTiers={subscriptionTiers}
              billCategories={billCategories}
              monthlyTrend={monthlyTrend}
            />
          )}

          {/* Filters */}
          <AdminFilters
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            statusOptions={getCurrentStatusOptions()}
            dateFrom={dateFrom}
            dateTo={dateTo}
            onDateFromChange={setDateFrom}
            onDateToChange={setDateTo}
            onClearFilters={clearFilters}
          />

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setStatusFilter('all'); }} className="space-y-6">
            <TabsList className="flex flex-wrap h-auto gap-1.5 bg-card/50 backdrop-blur-sm p-2 rounded-2xl border border-border/20 shadow-lg">
              <TabsTrigger value="users" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all">
                <Users className="h-4 w-4 mr-2" />Users
              </TabsTrigger>
              <TabsTrigger value="bills" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all">
                <FileText className="h-4 w-4 mr-2" />Bills
              </TabsTrigger>
              <TabsTrigger value="vehicles" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all">
                <Car className="h-4 w-4 mr-2" />Vehicles
              </TabsTrigger>
              <TabsTrigger value="subscriptions" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all">
                <CreditCard className="h-4 w-4 mr-2" />Subscriptions
              </TabsTrigger>
              <TabsTrigger value="paymentPlans" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all">
                <Calendar className="h-4 w-4 mr-2" />Payment Plans
              </TabsTrigger>
              <TabsTrigger value="bankAccounts" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all">
                <Landmark className="h-4 w-4 mr-2" />Bank Accounts
              </TabsTrigger>
              <TabsTrigger value="referrals" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all">
                <Gift className="h-4 w-4 mr-2" />Referrals
              </TabsTrigger>
            </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <BulkActions
              selectedCount={selectedItems.users.size}
              totalCount={filteredProfiles.length}
              onSelectAll={(checked) => toggleSelectAll('users', filteredProfiles.map(p => ({ id: p.user_id })), checked)}
              allSelected={filteredProfiles.length > 0 && selectedItems.users.size === filteredProfiles.length}
              onBulkDelete={() => setBulkDeleteDialogOpen(true)}
            />
            <AdminTableWrapper
              title="User Management" description="View and manage all registered users"
              icon={<Users className="h-5 w-5" />} data={profiles} exportFilename="users"
              currentPage={currentPage.users} onPageChange={(page) => handlePageChange('users', page)}
            >
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="w-10"><Checkbox /></TableHead>
                    <SortableTableHead column="first_name" label="Name" currentSort={sortConfig.users} onSort={(col) => handleSort('users', col)} />
                    <SortableTableHead column="email" label="Email" currentSort={sortConfig.users} onSort={(col) => handleSort('users', col)} />
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <SortableTableHead column="created_at" label="Joined" currentSort={sortConfig.users} onSort={(col) => handleSort('users', col)} />
                    <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginate(filteredProfiles, currentPage.users, ITEMS_PER_PAGE).map((profile) => (
                    <TableRow key={profile.id} className="border-border/50 hover:bg-muted/30">
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.users.has(profile.user_id)}
                          onCheckedChange={() => toggleSelection('users', profile.user_id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {profile.first_name || profile.last_name 
                          ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
                          : <span className="text-muted-foreground">N/A</span>}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{profile.email || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={profile.documents_verified ? "default" : "secondary"}
                          className={profile.documents_verified ? "bg-primary/20 text-primary" : ""}>
                          {profile.documents_verified ? "Verified" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{format(new Date(profile.created_at), "MMM d, yyyy")}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => { setSelectedUser(profile); setUserDetailOpen(true); }}>
                              <Eye className="h-4 w-4 mr-2" />View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setSelectedUser(profile); setEditUserOpen(true); }}>
                              <Pencil className="h-4 w-4 mr-2" />Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openDeleteDialog('user', profile.user_id)} className="text-destructive focus:text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredProfiles.length === 0 && <EmptyState colSpan={6} message="No users found" />}
                </TableBody>
              </Table>
            </AdminTableWrapper>
          </TabsContent>

          {/* Bills Tab */}
          <TabsContent value="bills">
            <BulkActions
              selectedCount={selectedItems.bills.size}
              totalCount={filteredBills.length}
              onSelectAll={(checked) => toggleSelectAll('bills', filteredBills, checked)}
              allSelected={filteredBills.length > 0 && selectedItems.bills.size === filteredBills.length}
              onBulkDelete={() => setBulkDeleteDialogOpen(true)}
            />
            <AdminTableWrapper
              title="Bill Management" description="View and manage all bills"
              icon={<FileText className="h-5 w-5" />} data={bills} exportFilename="bills"
              currentPage={currentPage.bills} onPageChange={(page) => handlePageChange('bills', page)}
            >
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="w-10"><Checkbox /></TableHead>
                    <SortableTableHead column="name" label="Bill Name" currentSort={sortConfig.bills} onSort={(col) => handleSort('bills', col)} />
                    <SortableTableHead column="category" label="Category" currentSort={sortConfig.bills} onSort={(col) => handleSort('bills', col)} />
                    <SortableTableHead column="amount" label="Amount" currentSort={sortConfig.bills} onSort={(col) => handleSort('bills', col)} />
                    <SortableTableHead column="due_date" label="Due Date" currentSort={sortConfig.bills} onSort={(col) => handleSort('bills', col)} />
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginate(filteredBills, currentPage.bills, ITEMS_PER_PAGE).map((bill) => (
                    <TableRow key={bill.id} className="border-border/50 hover:bg-muted/30">
                      <TableCell>
                        <Checkbox checked={selectedItems.bills.has(bill.id)} onCheckedChange={() => toggleSelection('bills', bill.id)} />
                      </TableCell>
                      <TableCell className="font-medium">{bill.name}</TableCell>
                      <TableCell><Badge variant="outline" className="border-border/50">{bill.category}</Badge></TableCell>
                      <TableCell className="font-mono">${Number(bill.amount).toLocaleString()}</TableCell>
                      <TableCell className="text-muted-foreground">{format(new Date(bill.due_date), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        <Badge variant={bill.status === "paid" ? "default" : bill.status === "pending" ? "secondary" : "destructive"}
                          className={bill.status === "paid" ? "bg-primary/20 text-primary" : ""}>{bill.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => { setSelectedBill(bill); setEditBillOpen(true); }}>
                              <Pencil className="h-4 w-4 mr-2" />Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openDeleteDialog('bill', bill.id)} className="text-destructive focus:text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredBills.length === 0 && <EmptyState colSpan={7} message="No bills found" />}
                </TableBody>
              </Table>
            </AdminTableWrapper>
          </TabsContent>

          {/* Vehicles Tab */}
          <TabsContent value="vehicles">
            <BulkActions
              selectedCount={selectedItems.vehicles.size}
              totalCount={filteredVehicles.length}
              onSelectAll={(checked) => toggleSelectAll('vehicles', filteredVehicles, checked)}
              allSelected={filteredVehicles.length > 0 && selectedItems.vehicles.size === filteredVehicles.length}
              onBulkDelete={() => setBulkDeleteDialogOpen(true)}
              showVerifyActions
              onBulkVerify={async () => {
                const ids = Array.from(selectedItems.vehicles);
                await supabase.from('vehicles').update({ is_verified: true } as any).in('id', ids);
                toast.success(`${ids.length} vehicles verified`);
                setSelectedItems(prev => ({ ...prev, vehicles: new Set() }));
                fetchAdminData();
              }}
            />
            <AdminTableWrapper
              title="Vehicle Management" description="View and manage all vehicles"
              icon={<Car className="h-5 w-5" />} data={vehicles} exportFilename="vehicles"
              currentPage={currentPage.vehicles} onPageChange={(page) => handlePageChange('vehicles', page)}
            >
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="w-10"><Checkbox /></TableHead>
                    <SortableTableHead column="vin" label="VIN" currentSort={sortConfig.vehicles} onSort={(col) => handleSort('vehicles', col)} />
                    <SortableTableHead column="license_plate" label="License Plate" currentSort={sortConfig.vehicles} onSort={(col) => handleSort('vehicles', col)} />
                    <SortableTableHead column="make" label="Vehicle" currentSort={sortConfig.vehicles} onSort={(col) => handleSort('vehicles', col)} />
                    <TableHead className="text-muted-foreground">Insurance</TableHead>
                    <TableHead className="text-muted-foreground">Verified</TableHead>
                    <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginate(filteredVehicles, currentPage.vehicles, ITEMS_PER_PAGE).map((vehicle) => (
                    <TableRow key={vehicle.id} className="border-border/50 hover:bg-muted/30">
                      <TableCell>
                        <Checkbox checked={selectedItems.vehicles.has(vehicle.id)} onCheckedChange={() => toggleSelection('vehicles', vehicle.id)} />
                      </TableCell>
                      <TableCell className="font-mono text-xs">{vehicle.vin || <span className="text-muted-foreground">N/A</span>}</TableCell>
                      <TableCell>{vehicle.license_plate || <span className="text-muted-foreground">N/A</span>}</TableCell>
                      <TableCell>
                        {vehicle.year && vehicle.make && vehicle.model 
                          ? `${vehicle.year} ${vehicle.make} ${vehicle.model}`
                          : <span className="text-muted-foreground">N/A</span>}
                      </TableCell>
                      <TableCell>
                        <Badge variant={vehicle.insurance_verified ? "default" : "secondary"} 
                          className={vehicle.insurance_verified ? "bg-primary/20 text-primary" : ""}>
                          {vehicle.insurance_verified ? "Verified" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={vehicle.is_verified ? "default" : "secondary"}
                          className={vehicle.is_verified ? "bg-primary/20 text-primary" : ""}>
                          {vehicle.is_verified ? "Verified" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => { setSelectedVehicle(vehicle); setEditVehicleOpen(true); }}>
                              <Pencil className="h-4 w-4 mr-2" />Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openDeleteDialog('vehicle', vehicle.id)} className="text-destructive focus:text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredVehicles.length === 0 && <EmptyState colSpan={7} message="No vehicles found" />}
                </TableBody>
              </Table>
            </AdminTableWrapper>
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions">
            <BulkActions
              selectedCount={selectedItems.subscriptions.size}
              totalCount={filteredSubscriptions.length}
              onSelectAll={(checked) => toggleSelectAll('subscriptions', filteredSubscriptions, checked)}
              allSelected={filteredSubscriptions.length > 0 && selectedItems.subscriptions.size === filteredSubscriptions.length}
              onBulkDelete={() => setBulkDeleteDialogOpen(true)}
            />
            <AdminTableWrapper
              title="Subscriptions" description="View all subscription plans"
              icon={<CreditCard className="h-5 w-5" />} data={subscriptions} exportFilename="subscriptions"
              currentPage={currentPage.subscriptions} onPageChange={(page) => handlePageChange('subscriptions', page)}
            >
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="w-10"><Checkbox /></TableHead>
                    <TableHead className="text-muted-foreground">User ID</TableHead>
                    <SortableTableHead column="tier" label="Tier" currentSort={sortConfig.subscriptions} onSort={(col) => handleSort('subscriptions', col)} />
                    <SortableTableHead column="access_used" label="Access Used" currentSort={sortConfig.subscriptions} onSort={(col) => handleSort('subscriptions', col)} />
                    <SortableTableHead column="access_limit" label="Access Limit" currentSort={sortConfig.subscriptions} onSort={(col) => handleSort('subscriptions', col)} />
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginate(filteredSubscriptions, currentPage.subscriptions, ITEMS_PER_PAGE).map((sub) => (
                    <TableRow key={sub.id} className="border-border/50 hover:bg-muted/30">
                      <TableCell>
                        <Checkbox checked={selectedItems.subscriptions.has(sub.id)} onCheckedChange={() => toggleSelection('subscriptions', sub.id)} />
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{sub.user_id.slice(0, 8)}...</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize border-primary/50 text-primary">{sub.tier}</Badge>
                      </TableCell>
                      <TableCell className="font-mono">${sub.access_used}</TableCell>
                      <TableCell className="font-mono">${sub.access_limit}</TableCell>
                      <TableCell>
                        <Badge variant={sub.is_active ? "default" : "secondary"}
                          className={sub.is_active ? "bg-primary/20 text-primary" : ""}>
                          {sub.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => { setSelectedSubscription(sub); setEditSubscriptionOpen(true); }}>
                              <Pencil className="h-4 w-4 mr-2" />Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openDeleteDialog('subscription', sub.id)} className="text-destructive focus:text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredSubscriptions.length === 0 && <EmptyState colSpan={7} message="No subscriptions found" />}
                </TableBody>
              </Table>
            </AdminTableWrapper>
          </TabsContent>

          {/* Payment Plans Tab */}
          <TabsContent value="paymentPlans">
            <BulkActions
              selectedCount={selectedItems.paymentPlans.size}
              totalCount={filteredPaymentPlans.length}
              onSelectAll={(checked) => toggleSelectAll('paymentPlans', filteredPaymentPlans, checked)}
              allSelected={filteredPaymentPlans.length > 0 && selectedItems.paymentPlans.size === filteredPaymentPlans.length}
              onBulkDelete={() => setBulkDeleteDialogOpen(true)}
            />
            <AdminTableWrapper
              title="Payment Plans" description="View all payment plans"
              icon={<Calendar className="h-5 w-5" />} data={paymentPlans} exportFilename="payment-plans"
              currentPage={currentPage.paymentPlans} onPageChange={(page) => handlePageChange('paymentPlans', page)}
            >
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="w-10"><Checkbox /></TableHead>
                    <TableHead className="text-muted-foreground">User ID</TableHead>
                    <SortableTableHead column="total_amount" label="Total Amount" currentSort={sortConfig.paymentPlans} onSort={(col) => handleSort('paymentPlans', col)} />
                    <TableHead className="text-muted-foreground">Progress</TableHead>
                    <SortableTableHead column="next_payment_date" label="Next Payment" currentSort={sortConfig.paymentPlans} onSort={(col) => handleSort('paymentPlans', col)} />
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginate(filteredPaymentPlans, currentPage.paymentPlans, ITEMS_PER_PAGE).map((plan) => (
                    <TableRow key={plan.id} className="border-border/50 hover:bg-muted/30">
                      <TableCell>
                        <Checkbox checked={selectedItems.paymentPlans.has(plan.id)} onCheckedChange={() => toggleSelection('paymentPlans', plan.id)} />
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{plan.user_id.slice(0, 8)}...</TableCell>
                      <TableCell className="font-mono">${plan.total_amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-20 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${(plan.installments_paid / plan.installments_total) * 100}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground">{plan.installments_paid}/{plan.installments_total}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {plan.next_payment_date ? format(new Date(plan.next_payment_date), "MMM d, yyyy") : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={plan.status === 'active' ? "default" : "secondary"}
                          className={plan.status === 'active' ? "bg-primary/20 text-primary" : ""}>{plan.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => { setSelectedPaymentPlan(plan); setEditPaymentPlanOpen(true); }}>
                              <Pencil className="h-4 w-4 mr-2" />Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openDeleteDialog('paymentPlan', plan.id)} className="text-destructive focus:text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredPaymentPlans.length === 0 && <EmptyState colSpan={7} message="No payment plans found" />}
                </TableBody>
              </Table>
            </AdminTableWrapper>
          </TabsContent>

          {/* Bank Accounts Tab */}
          <TabsContent value="bankAccounts">
            <BulkActions
              selectedCount={selectedItems.bankAccounts.size}
              totalCount={filteredBankAccounts.length}
              onSelectAll={(checked) => toggleSelectAll('bankAccounts', filteredBankAccounts, checked)}
              allSelected={filteredBankAccounts.length > 0 && selectedItems.bankAccounts.size === filteredBankAccounts.length}
              onBulkDelete={() => setBulkDeleteDialogOpen(true)}
            />
            <AdminTableWrapper
              title="Bank Accounts" description="View all linked bank accounts"
              icon={<Landmark className="h-5 w-5" />} data={bankAccounts} exportFilename="bank-accounts"
              currentPage={currentPage.bankAccounts} onPageChange={(page) => handlePageChange('bankAccounts', page)}
            >
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="w-10"><Checkbox /></TableHead>
                    <TableHead className="text-muted-foreground">User ID</TableHead>
                    <SortableTableHead column="bank_name" label="Bank Name" currentSort={sortConfig.bankAccounts} onSort={(col) => handleSort('bankAccounts', col)} />
                    <TableHead className="text-muted-foreground">Account</TableHead>
                    <TableHead className="text-muted-foreground">Primary</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <SortableTableHead column="created_at" label="Added" currentSort={sortConfig.bankAccounts} onSort={(col) => handleSort('bankAccounts', col)} />
                    <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginate(filteredBankAccounts, currentPage.bankAccounts, ITEMS_PER_PAGE).map((account) => (
                    <TableRow key={account.id} className="border-border/50 hover:bg-muted/30">
                      <TableCell>
                        <Checkbox checked={selectedItems.bankAccounts.has(account.id)} onCheckedChange={() => toggleSelection('bankAccounts', account.id)} />
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{account.user_id.slice(0, 8)}...</TableCell>
                      <TableCell className="font-medium">{account.bank_name}</TableCell>
                      <TableCell className="font-mono">{account.account_last_four ? `****${account.account_last_four}` : 'N/A'}</TableCell>
                      <TableCell>{account.is_primary && <Badge className="bg-blue-500/20 text-blue-400">Primary</Badge>}</TableCell>
                      <TableCell>
                        <Badge variant={account.is_connected ? "default" : "destructive"}
                          className={account.is_connected ? "bg-primary/20 text-primary" : ""}>
                          {account.is_connected ? "Connected" : "Disconnected"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{format(new Date(account.created_at), "MMM d, yyyy")}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => { setSelectedBankAccount(account); setEditBankAccountOpen(true); }}>
                              <Pencil className="h-4 w-4 mr-2" />Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openDeleteDialog('bankAccount', account.id)} className="text-destructive focus:text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredBankAccounts.length === 0 && <EmptyState colSpan={8} message="No bank accounts found" />}
                </TableBody>
              </Table>
            </AdminTableWrapper>
          </TabsContent>

          {/* Referrals Tab */}
          <TabsContent value="referrals">
            <BulkActions
              selectedCount={selectedItems.referrals.size}
              totalCount={filteredReferrals.length}
              onSelectAll={(checked) => toggleSelectAll('referrals', filteredReferrals, checked)}
              allSelected={filteredReferrals.length > 0 && selectedItems.referrals.size === filteredReferrals.length}
              onBulkDelete={() => setBulkDeleteDialogOpen(true)}
            />
            <AdminTableWrapper
              title="Referrals" description="View all referral activity"
              icon={<Gift className="h-5 w-5" />} data={referrals} exportFilename="referrals"
              currentPage={currentPage.referrals} onPageChange={(page) => handlePageChange('referrals', page)}
            >
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="w-10"><Checkbox /></TableHead>
                    <TableHead className="text-muted-foreground">Referrer ID</TableHead>
                    <TableHead className="text-muted-foreground">Referred ID</TableHead>
                    <TableHead className="text-muted-foreground">Code</TableHead>
                    <SortableTableHead column="reward_amount" label="Reward" currentSort={sortConfig.referrals} onSort={(col) => handleSort('referrals', col)} />
                    <TableHead className="text-muted-foreground">Paid</TableHead>
                    <SortableTableHead column="created_at" label="Date" currentSort={sortConfig.referrals} onSort={(col) => handleSort('referrals', col)} />
                    <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginate(filteredReferrals, currentPage.referrals, ITEMS_PER_PAGE).map((referral) => (
                    <TableRow key={referral.id} className="border-border/50 hover:bg-muted/30">
                      <TableCell>
                        <Checkbox checked={selectedItems.referrals.has(referral.id)} onCheckedChange={() => toggleSelection('referrals', referral.id)} />
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{referral.referrer_id.slice(0, 8)}...</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{referral.referred_id.slice(0, 8)}...</TableCell>
                      <TableCell><Badge variant="outline" className="font-mono border-border/50">{referral.referral_code}</Badge></TableCell>
                      <TableCell className="font-mono text-primary">${referral.reward_amount}</TableCell>
                      <TableCell>
                        <Badge variant={referral.reward_paid ? "default" : "secondary"}
                          className={referral.reward_paid ? "bg-primary/20 text-primary" : ""}>
                          {referral.reward_paid ? "Paid" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{format(new Date(referral.created_at), "MMM d, yyyy")}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => openDeleteDialog('referral', referral.id)} className="text-destructive focus:text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredReferrals.length === 0 && <EmptyState colSpan={8} message="No referrals found" />}
                </TableBody>
              </Table>
            </AdminTableWrapper>
          </TabsContent>
        </Tabs>
        </div>
      </div>

      {/* Dialogs */}
      <UserDetailDialog user={selectedUser} open={userDetailOpen} onOpenChange={setUserDetailOpen} />
      <EditUserDialog user={selectedUser} open={editUserOpen} onOpenChange={setEditUserOpen} onUpdate={handleUserUpdate} />
      <EditBillDialog bill={selectedBill} open={editBillOpen} onOpenChange={setEditBillOpen} onUpdate={handleBillUpdate} />
      <EditVehicleDialog vehicle={selectedVehicle} open={editVehicleOpen} onOpenChange={setEditVehicleOpen} onUpdate={handleVehicleUpdate} />
      <EditSubscriptionDialog subscription={selectedSubscription} open={editSubscriptionOpen} onOpenChange={setEditSubscriptionOpen} onUpdate={handleSubscriptionUpdate} />
      <EditPaymentPlanDialog plan={selectedPaymentPlan} open={editPaymentPlanOpen} onOpenChange={setEditPaymentPlanOpen} onUpdate={handlePaymentPlanUpdate} />
      <EditBankAccountDialog account={selectedBankAccount} open={editBankAccountOpen} onOpenChange={setEditBankAccountOpen} onUpdate={handleBankAccountUpdate} />
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title={`Delete ${deleteType || ''}`}
        description={getDeleteDescription()}
        loading={deleting}
      />
      <DeleteConfirmDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        onConfirm={handleBulkDelete}
        title={`Delete ${selectedItems[activeTab]?.size || 0} items`}
        description={`This will permanently delete ${selectedItems[activeTab]?.size || 0} selected items. This action cannot be undone.`}
        loading={deleting}
      />
    </div>
  );
};

export default Admin;

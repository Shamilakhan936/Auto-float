import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  AlertCircle
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const upcomingBills = [
  { id: 1, name: "Rent Payment", category: "Rent", amount: 1200, dueDate: "Dec 1", icon: Home, status: "scheduled" },
  { id: 2, name: "Electric Bill", category: "Utilities", amount: 145, dueDate: "Dec 5", icon: Zap, status: "pending" },
  { id: 3, name: "Phone Bill", category: "Phone", amount: 85, dueDate: "Dec 10", icon: Phone, status: "pending" },
  { id: 4, name: "Car Insurance", category: "Insurance", amount: 180, dueDate: "Dec 15", icon: Shield, status: "pending" },
  { id: 5, name: "Internet", category: "Utilities", amount: 70, dueDate: "Dec 18", icon: Wifi, status: "pending" },
];

export default function DashboardPage() {
  const [accessUsed] = useState(1680);
  const accessLimit = 3000;
  const accessRemaining = accessLimit - accessUsed;
  const accessPercent = (accessUsed / accessLimit) * 100;
  
  const nextSettlement = "December 31, 2024";
  const isVerified = true;

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
              <Button variant="accent">
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
                    <span>Auto+ Plan</span>
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
                    <p className="text-2xl font-bold text-foreground">Dec 31</p>
                    <p className="text-sm text-muted-foreground">18 days away</p>
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
                <Button variant="outline" size="sm">
                  View All
                  <ArrowUpRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingBills.map((bill) => (
                  <div
                    key={bill.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                        <bill.icon className="h-6 w-6 text-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{bill.name}</p>
                        <p className="text-sm text-muted-foreground">{bill.category} • Due {bill.dueDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-lg font-semibold text-foreground">${bill.amount}</p>
                      {bill.status === "scheduled" ? (
                        <Badge variant="success" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Scheduled
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Pending
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <Card className="hover:border-accent/30 transition-colors cursor-pointer animate-fade-in [animation-delay:300ms] opacity-0">
              <CardContent className="flex flex-col items-center justify-center py-6 text-center">
                <Plus className="h-8 w-8 text-accent mb-3" />
                <p className="font-medium text-foreground">Add Bill</p>
                <p className="text-xs text-muted-foreground">Schedule new payment</p>
              </CardContent>
            </Card>
            <Card className="hover:border-accent/30 transition-colors cursor-pointer animate-fade-in [animation-delay:400ms] opacity-0">
              <CardContent className="flex flex-col items-center justify-center py-6 text-center">
                <CreditCard className="h-8 w-8 text-accent mb-3" />
                <p className="font-medium text-foreground">Bank Account</p>
                <p className="text-xs text-muted-foreground">Manage connections</p>
              </CardContent>
            </Card>
            <Card className="hover:border-accent/30 transition-colors cursor-pointer animate-fade-in [animation-delay:500ms] opacity-0">
              <CardContent className="flex flex-col items-center justify-center py-6 text-center">
                <Car className="h-8 w-8 text-accent mb-3" />
                <p className="font-medium text-foreground">Vehicle Info</p>
                <p className="text-xs text-muted-foreground">Update verification</p>
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
    </div>
  );
}
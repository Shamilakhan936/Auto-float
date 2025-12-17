import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface AdminTableWrapperProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  data: any[];
  exportFilename: string;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  children: React.ReactNode;
}

export const AdminTableWrapper = ({
  title,
  description,
  icon,
  data,
  exportFilename,
  currentPage,
  onPageChange,
  itemsPerPage = 10,
  children
}: AdminTableWrapperProps) => {
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const exportToCSV = () => {
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
    a.download = `${exportFilename}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${data.length} records`);
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="border-b border-border/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportToCSV}
            className="border-border/50 hover:bg-muted/50 w-fit"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          {children}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border/50">
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages} • {data.length} total records
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="border-border/50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="border-border/50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const paginate = <T,>(items: T[], page: number, itemsPerPage: number = 10) => {
  const start = (page - 1) * itemsPerPage;
  return items.slice(start, start + itemsPerPage);
};

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/config/constants';
import { Header } from '@/components/header';
import { Skeleton } from '@/components/ui/skeleton';

const Reports = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const module = searchParams.get('module') || 'composition';
  const level = searchParams.get('level') || 'advanced';

  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/lessons/reports?module=${module}&level=${level}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setReports(data.reports || []);
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to load reports', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [module, level, toast]);

  const handleReportClick = (sequence: number) => {
    navigate(`/report?module=${module}&level=${level}&sequence=${sequence}`);
  };

  return (
    <div className="min-h-screen bg-gradient-soft transition-colors duration-300">
      <Header 
        title="Report Writing" 
        subtitle="Analytical & Formal Documentation"
        icon={ClipboardList}
        iconColor="text-slate-600 dark:text-slate-400"
        iconBgColor="bg-slate-100 dark:bg-slate-800"
        backTo="/composition"
      />

      <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
        {loading ? (
          <div className="grid gap-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>
        ) : reports.length === 0 ? (
          <Card className="text-center p-8 bg-card/50 border-dashed">
            <ClipboardList className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No report tasks available for this level yet.</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {reports.map((report, index) => (
              <Card
                key={report.sequence}
                className="group cursor-pointer hover:shadow-lg hover:border-slate-400/30 transition-all duration-300 hover:-translate-x-[-4px] bg-card/80 backdrop-blur-sm"
                onClick={() => handleReportClick(report.sequence)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader className="p-6">
                  <div className="flex justify-between items-center gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">#{report.sequence}</Badge>
                        {report.type && <Badge variant="secondary">{report.type}</Badge>}
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {report.title}
                      </CardTitle>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
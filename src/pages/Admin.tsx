import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Header } from '@/components/Header';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export const Admin = () => {
  const { t } = useLanguage();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState({});

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/');
      return;
    }
    if (user && isAdmin) {
      fetchApplications();
    }
  }, [user, isAdmin, authLoading]);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          profiles!applications_user_id_fkey(email)
        `)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: 'approved' | 'rejected', adminNotes: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({
          status,
          admin_notes: adminNotes,
          approved_by: user?.id,
        })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: t('success'),
        description: `Application ${status} successfully`,
      });

      fetchApplications();
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-accent">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-pulse-soft text-primary text-lg">{t('loading')}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary mb-2">{t('admin.dashboard')}</h1>
            <p className="text-muted-foreground">{t('all.applications')}</p>
          </div>

          <div className="grid gap-6">
            {applications.map((app) => (
              <Card key={app.id} className="shadow-large">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {app.first_name} {app.last_name}
                        {app.status === 'pending' && <Clock className="h-5 w-5 text-warning" />}
                        {app.status === 'approved' && <CheckCircle className="h-5 w-5 text-success" />}
                        {app.status === 'rejected' && <XCircle className="h-5 w-5 text-destructive" />}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{app.profiles?.email}</p>
                    </div>
                    <Badge variant={app.status === 'approved' ? 'default' : app.status === 'rejected' ? 'destructive' : 'secondary'}>
                      {t(app.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div><span className="font-medium">{t('age')}:</span> {app.age}</div>
                    <div><span className="font-medium">{t('gender')}:</span> {t(app.gender)}</div>
                    <div><span className="font-medium">{t('vehicle.type')}:</span> {t(app.vehicle_type)}</div>
                    <div><span className="font-medium">{t('phone.number')}:</span> {app.phone_number}</div>
                  </div>
                  <div>
                    <span className="font-medium text-sm">{t('working.hours')}:</span>
                    <p className="text-sm text-muted-foreground mt-1">{app.working_hours}</p>
                  </div>
                  
                  {app.status === 'pending' && (
                    <div className="space-y-3">
                      <Textarea
                        placeholder={t('admin.notes')}
                        value={notes[app.id] || ''}
                        onChange={(e) => setNotes(prev => ({ ...prev, [app.id]: e.target.value }))}
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => updateApplicationStatus(app.id, 'approved', notes[app.id] || '')}
                        >
                          {t('approve')}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => updateApplicationStatus(app.id, 'rejected', notes[app.id] || '')}
                        >
                          {t('reject')}
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {app.admin_notes && (
                    <div className="p-3 bg-muted rounded-lg">
                      <h4 className="font-semibold text-sm mb-1">{t('admin.notes')}:</h4>
                      <p className="text-sm">{app.admin_notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
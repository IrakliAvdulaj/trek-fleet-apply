import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ApplicationForm } from '@/components/ApplicationForm';
import { Header } from '@/components/Header';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Clock, CheckCircle, XCircle, Edit, Calendar } from 'lucide-react';

export const Dashboard = () => {
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      fetchApplication();
      
      // Set up real-time subscription
      const subscription = supabase
        .channel('application-changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'applications',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            setApplication(payload.new);
            
            // Show notification for status changes
            if (payload.old.status !== payload.new.status) {
              if (payload.new.status === 'approved') {
                toast({
                  title: t('success'),
                  description: t('application.approved'),
                });
              } else if (payload.new.status === 'rejected') {
                toast({
                  title: t('error'),
                  description: t('application.rejected'),
                  variant: 'destructive',
                });
              }
            }
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user, authLoading]);

  const fetchApplication = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setApplication(data);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Clock className="h-5 w-5 text-warning" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-accent">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-pulse-soft text-primary text-lg">
                {t('loading')}
              </div>
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
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary mb-2">
              {t('dashboard')}
            </h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.email}
            </p>
          </div>

          {!application && !editing ? (
            <div className="text-center space-y-6">
              <Card className="shadow-large">
                <CardHeader>
                  <CardTitle>{t('application.form')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    You haven't submitted an application yet. Start your journey with TRE Delivery today!
                  </p>
                  <Button
                    variant="hero"
                    size="lg"
                    onClick={() => setEditing(true)}
                  >
                    {t('apply.now')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : editing ? (
            <ApplicationForm
              existingApplication={application}
              onSuccess={() => {
                setEditing(false);
                fetchApplication();
              }}
            />
          ) : (
            <div className="space-y-6">
              {/* Application Status Card */}
              <Card className="shadow-large">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(application.status)}
                    <div>
                      <CardTitle>{t('application.status')}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {t('applied.on')} {formatDate(application.applied_at)}
                      </p>
                    </div>
                  </div>
                  <Badge variant={getStatusVariant(application.status)}>
                    {t(application.status)}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {t('last.updated')}: {formatDate(application.updated_at)}
                    </div>
                  </div>
                  
                  {application.admin_notes && (
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold mb-2">{t('admin.notes')}:</h4>
                      <p className="text-sm">{application.admin_notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Application Details Card */}
              <Card className="shadow-large">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{t('applicant.info')}</CardTitle>
                  {application.status === 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditing(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {t('edit')}
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">{t('personal.info')}</h4>
                      <div className="space-y-2 text-sm">
                        <div><span className="font-medium">{t('first.name')}:</span> {application.first_name}</div>
                        <div><span className="font-medium">{t('last.name')}:</span> {application.last_name}</div>
                        <div><span className="font-medium">{t('email')}:</span> {user?.email}</div>
                        <div><span className="font-medium">{t('phone.number')}:</span> {application.phone_number}</div>
                        <div><span className="font-medium">{t('age')}:</span> {application.age}</div>
                        <div><span className="font-medium">{t('gender')}:</span> {t(application.gender)}</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">{t('vehicle.details')}</h4>
                      <div className="space-y-2 text-sm">
                        <div><span className="font-medium">{t('vehicle.type')}:</span> {t(application.vehicle_type)}</div>
                        <div><span className="font-medium">{t('working.hours')}:</span></div>
                        <div className="pl-4 text-muted-foreground">{application.working_hours}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
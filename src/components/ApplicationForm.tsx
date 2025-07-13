import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader } from 'lucide-react';

type GenderType = 'male' | 'female' | 'other' | 'prefer_not_to_say';
type VehicleType = 'bicycle' | 'motorcycle' | 'car' | 'scooter' | 'e-bike';

interface ApplicationData {
  first_name: string;
  last_name: string;
  phone_number: string;
  age: string;
  gender: GenderType | '';
  vehicle_type: VehicleType | '';
  working_hours: string;
}

interface ApplicationFormProps {
  existingApplication?: any;
  onSuccess?: () => void;
}

export const ApplicationForm = ({ existingApplication, onSuccess }: ApplicationFormProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ApplicationData>({
    first_name: '',
    last_name: '',
    phone_number: '',
    age: '',
    gender: '',
    vehicle_type: '',
    working_hours: '',
  });

  useEffect(() => {
    if (existingApplication) {
      setFormData({
        first_name: existingApplication.first_name || '',
        last_name: existingApplication.last_name || '',
        phone_number: existingApplication.phone_number || '',
        age: existingApplication.age?.toString() || '',
        gender: existingApplication.gender || '',
        vehicle_type: existingApplication.vehicle_type || '',
        working_hours: existingApplication.working_hours || '',
      });
    }
  }, [existingApplication]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validate required fields
    if (!formData.gender || !formData.vehicle_type) {
      toast({
        title: t('error'),
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const applicationData = {
        user_id: user.id,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone_number,
        age: parseInt(formData.age),
        gender: formData.gender as GenderType,
        vehicle_type: formData.vehicle_type as VehicleType,
        working_hours: formData.working_hours,
      };

      if (existingApplication) {
        // Update existing application
        const { error } = await supabase
          .from('applications')
          .update(applicationData)
          .eq('user_id', user.id);

        if (error) throw error;

        toast({
          title: t('success'),
          description: t('application.updated'),
        });
      } else {
        // Create new application
        const { error } = await supabase
          .from('applications')
          .insert([applicationData]);

        if (error) throw error;

        toast({
          title: t('success'),
          description: t('application.submitted'),
        });
      }

      onSuccess?.();
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

  const updateField = (field: keyof ApplicationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-large">
      <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-lg">
        <CardTitle className="text-center text-xl">
          {t('application.form')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              {t('personal.info')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">{t('first.name')}</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => updateField('first_name', e.target.value)}
                  required
                  className="transition-all duration-300 focus:shadow-soft"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">{t('last.name')}</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => updateField('last_name', e.target.value)}
                  required
                  className="transition-all duration-300 focus:shadow-soft"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone_number">{t('phone.number')}</Label>
                <Input
                  id="phone_number"
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => updateField('phone_number', e.target.value)}
                  required
                  className="transition-all duration-300 focus:shadow-soft"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">{t('age')}</Label>
                <Input
                  id="age"
                  type="number"
                  min="18"
                  max="70"
                  value={formData.age}
                  onChange={(e) => updateField('age', e.target.value)}
                  required
                  className="transition-all duration-300 focus:shadow-soft"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">{t('gender')}</Label>
              <Select value={formData.gender} onValueChange={(value) => updateField('gender', value)}>
                <SelectTrigger className="transition-all duration-300 focus:shadow-soft">
                  <SelectValue placeholder={t('gender')} />
                </SelectTrigger>
                <SelectContent className="bg-card border shadow-medium">
                  <SelectItem value="male">{t('male')}</SelectItem>
                  <SelectItem value="female">{t('female')}</SelectItem>
                  <SelectItem value="other">{t('other')}</SelectItem>
                  <SelectItem value="prefer_not_to_say">{t('prefer.not.to.say')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              {t('vehicle.details')}
            </h3>
            <div className="space-y-2">
              <Label htmlFor="vehicle_type">{t('vehicle.type')}</Label>
              <Select value={formData.vehicle_type} onValueChange={(value) => updateField('vehicle_type', value)}>
                <SelectTrigger className="transition-all duration-300 focus:shadow-soft">
                  <SelectValue placeholder={t('vehicle.type')} />
                </SelectTrigger>
                <SelectContent className="bg-card border shadow-medium">
                  <SelectItem value="bicycle">{t('bicycle')}</SelectItem>
                  <SelectItem value="motorcycle">{t('motorcycle')}</SelectItem>
                  <SelectItem value="car">{t('car')}</SelectItem>
                  <SelectItem value="scooter">{t('scooter')}</SelectItem>
                  <SelectItem value="e-bike">{t('e-bike')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Working Hours */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="working_hours">{t('working.hours')}</Label>
              <Textarea
                id="working_hours"
                value={formData.working_hours}
                onChange={(e) => updateField('working_hours', e.target.value)}
                placeholder="e.g., Monday-Friday 9AM-5PM, Weekends available"
                required
                className="transition-all duration-300 focus:shadow-soft"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            variant="hero" 
            size="lg" 
            className="w-full"
            disabled={loading}
          >
            {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            {existingApplication ? t('update.application') : t('submit.application')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
import { Button } from '@/components/ui/button';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingBag, User, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Header = () => {
  const { t } = useLanguage();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="relative">
            <ShoppingBag className="h-8 w-8 text-primary" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-primary rounded-full animate-pulse"></div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">{t('tre.delivery')}</h1>
            <p className="text-xs text-muted-foreground font-medium">{t('wolt.fleet.partner')}</p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <LanguageToggle />
          
          {user ? (
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Button variant="outline" asChild>
                  <Link to="/admin">
                    <Settings className="h-4 w-4 mr-2" />
                    {t('admin.dashboard')}
                  </Link>
                </Button>
              )}
              
              <Button variant="outline" asChild>
                <Link to="/dashboard">
                  <User className="h-4 w-4 mr-2" />
                  {t('dashboard')}
                </Link>
              </Button>
              
              <Button variant="ghost" onClick={handleSignOut}>
                {t('logout')}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link to="/auth">{t('login')}</Link>
              </Button>
              <Button asChild>
                <Link to="/auth">{t('signup')}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
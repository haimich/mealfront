
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { resetPassword } from '@/services/authService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft } from 'lucide-react';

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const result = await resetPassword(email);
      setSuccess(result);
    } catch (err: any) {
      setError(err.message || 'Failed to request password reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <Link to="/login" className="inline-flex items-center text-sm mb-6 text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} className="mr-2" />
          Back to login
        </Link>
        
        <h1 className="text-3xl font-medium mb-4">Reset Password</h1>
        
        {success ? (
          <Alert className="mb-6">
            <AlertDescription>
              We've sent recovery instructions to <strong>{email}</strong>. Please check your email inbox and follow the instructions to reset your password.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <p className="text-muted-foreground mb-6">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
            
            {error && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                />
              </div>
              
              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Sending...' : 'Reset Password'}
              </Button>
            </form>
          </>
        )}
      </div>
    </Layout>
  );
};

export default ResetPassword;

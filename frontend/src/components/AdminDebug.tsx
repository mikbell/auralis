import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { RefreshCw, User, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { authenticatedGet } from '@/lib/authenticatedApi';

const AdminDebug: React.FC = () => {
  const { getToken, isSignedIn, userId } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleTestAdminAccess = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Testing admin access...');
      console.log('Is signed in:', isSignedIn);
      console.log('User ID:', userId);
      
      if (!isSignedIn) {
        throw new Error('Not signed in to Clerk');
      }
      
      // First get user info
      const userResponse = await authenticatedGet('/auth/me', getToken);
      const userData = userResponse.data;
      console.log('👤 User data:', userData);
      setUserInfo(userData);
      
      // Then test admin access
      const adminResponse = await authenticatedGet('/admin/check', getToken);
      console.log('✅ Admin access confirmed:', adminResponse.data);
      setIsAdmin(true);
      
    } catch (err: any) {
      console.error('❌ Admin test failed:', err.response?.data || err.message);
      setError(err.response?.data?.message || err.message);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetUserInfo = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Getting user info...');
      console.log('Is signed in:', isSignedIn);
      console.log('User ID:', userId);
      
      if (!isSignedIn) {
        throw new Error('Not signed in to Clerk');
      }
      
      const token = await getToken();
      console.log('Token available:', !!token);
      
      const response = await authenticatedGet('/auth/me', getToken);
      const userData = response.data;
      console.log('👤 User data:', userData);
      setUserInfo(userData);
      setIsAdmin(userData.isAdmin);
      
    } catch (err: any) {
      console.error('❌ Get user info failed:', err.response?.data || err.message);
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Admin Access Debug Panel
          </CardTitle>
          <CardDescription>
            Test and debug admin access permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              onClick={handleTestAdminAccess} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
              Test Admin Access
            </Button>
            
            <Button 
              onClick={handleGetUserInfo} 
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <User className="w-4 h-4" />}
              Get User Info
            </Button>
          </div>

          <Separator />

          {/* Clerk Status */}
          <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
            <h5 className="font-medium text-green-900 dark:text-green-100 mb-2">Clerk Authentication Status:</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-green-700 dark:text-green-300">Signed In: </span>
                <Badge variant={isSignedIn ? "default" : "destructive"}>
                  {isSignedIn ? "YES" : "NO"}
                </Badge>
              </div>
              <div>
                <span className="text-green-700 dark:text-green-300">User ID: </span>
                <code className="bg-green-100 dark:bg-green-900 p-1 rounded">
                  {userId || 'Not available'}
                </code>
              </div>
              <div>
                <span className="text-green-700 dark:text-green-300">Token: </span>
                <Badge variant={"default"}>
                  Available
                </Badge>
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">Admin Status:</span>
              <Badge variant={isAdmin ? "default" : "destructive"}>
                {isAdmin ? (
                  <><CheckCircle className="w-3 h-3 mr-1" /> Admin</>
                ) : (
                  <><AlertTriangle className="w-3 h-3 mr-1" /> Not Admin</>
                )}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-medium">Loading:</span>
              <Badge variant={isLoading ? "secondary" : "outline"}>
                {isLoading ? "Yes" : "No"}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-medium">Has Error:</span>
              <Badge variant={error ? "destructive" : "outline"}>
                {error ? "Yes" : "No"}
              </Badge>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <h4 className="font-medium text-destructive mb-1">Error:</h4>
              <p className="text-sm text-destructive/80">{error}</p>
            </div>
          )}

          {/* User Info Display */}
          {userInfo && (
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                User Information
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <span className="font-medium text-sm text-muted-foreground">User ID:</span>
                  <p className="text-sm font-mono bg-background p-2 rounded mt-1">
                    {userInfo.userId || 'N/A'}
                  </p>
                </div>
                
                <div>
                  <span className="font-medium text-sm text-muted-foreground">User Email:</span>
                  <p className="text-sm font-mono bg-background p-2 rounded mt-1">
                    {userInfo.userEmail || 'N/A'}
                  </p>
                </div>
                
                <div>
                  <span className="font-medium text-sm text-muted-foreground">Admin Email (Expected):</span>
                  <p className="text-sm font-mono bg-background p-2 rounded mt-1">
                    {userInfo.adminEmail || 'N/A'}
                  </p>
                </div>
                
                <div>
                  <span className="font-medium text-sm text-muted-foreground">Is Admin:</span>
                  <p className="text-sm font-mono bg-background p-2 rounded mt-1 flex items-center gap-2">
                    <Badge variant={userInfo.isAdmin ? "default" : "destructive"}>
                      {userInfo.isAdmin ? "TRUE" : "FALSE"}
                    </Badge>
                  </p>
                </div>
              </div>

              {/* Email Comparison */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Email Comparison:</h5>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-blue-700 dark:text-blue-300">Your Email: </span>
                    <code className="bg-blue-100 dark:bg-blue-900 p-1 rounded">{userInfo.userEmail}</code>
                  </div>
                  <div>
                    <span className="text-blue-700 dark:text-blue-300">Admin Email: </span>
                    <code className="bg-blue-100 dark:bg-blue-900 p-1 rounded">{userInfo.adminEmail}</code>
                  </div>
                  <div>
                    <span className="text-blue-700 dark:text-blue-300">Match: </span>
                    <Badge variant={userInfo.userEmail === userInfo.adminEmail ? "default" : "destructive"}>
                      {userInfo.userEmail === userInfo.adminEmail ? "YES" : "NO"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* User Data */}
              {userInfo.userData && (
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h5 className="font-medium mb-2">User Profile Data:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">First Name:</span>
                      <p>{userInfo.userData.firstName || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Last Name:</span>
                      <p>{userInfo.userData.lastName || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Image URL:</span>
                      <p className="truncate">{userInfo.userData.imageUrl || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Debug Instructions */}
          <div className="p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <h5 className="font-medium text-orange-900 dark:text-orange-100 mb-2">Debug Instructions:</h5>
            <ol className="list-decimal list-inside space-y-1 text-sm text-orange-800 dark:text-orange-200">
              <li>Click "Get User Info" to see your current user details</li>
              <li>Check if your email matches the expected admin email</li>
              <li>If emails don't match, update the ADMIN_EMAIL in your .env file</li>
              <li>Restart the backend server after changing .env</li>
              <li>Click "Test Admin Access" to verify access</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDebug;

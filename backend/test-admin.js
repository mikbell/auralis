// Script per testare l'accesso admin
// Devi prima ottenere il token Clerk dal frontend

const testAdminAccess = async () => {
  try {
    // 1. Test del server
    console.log('🔍 Testing server health...');
    const healthResponse = await fetch('http://localhost:5000/api/health');
    const healthData = await healthResponse.json();
    console.log('Health Status:', healthData.success ? '✅' : '❌');
    
    // 2. Test autenticazione admin (dovrai inserire il tuo token Clerk)
    const clerkToken = 'YOUR_CLERK_TOKEN_HERE'; // Sostituisci con il tuo token
    
    if (clerkToken === 'YOUR_CLERK_TOKEN_HERE') {
      console.log('⚠️  DEVI INSERIRE IL TUO TOKEN CLERK!');
      console.log('Come ottenere il token:');
      console.log('1. Vai su http://localhost:5173 e accedi');
      console.log('2. Apri Developer Tools > Network');
      console.log('3. Fai una richiesta qualsiasi');
      console.log('4. Cerca l\'header Authorization');
      return;
    }
    
    console.log('🔍 Testing admin access...');
    const adminResponse = await fetch('http://localhost:5000/api/admin/check', {
      headers: {
        'Authorization': `Bearer ${clerkToken}`
      }
    });
    
    const adminData = await adminResponse.json();
    
    if (adminResponse.ok) {
      console.log('✅ Admin access granted!');
      console.log('Response:', adminData);
    } else {
      console.log('❌ Admin access denied!');
      console.log('Status:', adminResponse.status);
      console.log('Response:', adminData);
      
      if (adminResponse.status === 403) {
        console.log('\n🔧 Debug Info:');
        console.log('- Assicurati di essere loggato come:', process.env.ADMIN_EMAIL || 'mcampanello01@gmail.com');
        console.log('- L\'email deve corrispondere esattamente a quella nel .env');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

// Esegui il test
testAdminAccess();

export const testCookies = async () => {
    console.log('🍪 Testing cookie functionality...');
    
    // Test 1: Set a cookie
    const setResp = await fetch('http://localhost:4000/api/test/set-cookie', {
        credentials: 'include'
    });
    console.log('Set cookie response:', await setResp.json());
    
    // Test 2: Check cookies
    const checkResp = await fetch('http://localhost:4000/api/test/check-cookie', {
        credentials: 'include'
    });
    console.log('Check cookies response:', await checkResp.json());
};
// lib/oauth-client.ts
export async function signInWithGoogle() {
  try {
    const provider = new window.google.accounts.oauth2.TokenClient({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      scope: 'email profile',
      callback: async (response) => {
        const userInfo = await fetch(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${response.access_token}`,
            },
          }
        ).then(res => res.json());

        // Send user info to backend to create/get user & receive JWT
        const loginRes = await fetch('/api/login/oauth2', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: userInfo.name,
            email: userInfo.email,
            picture: userInfo.picture
          })
        });

        const result = await loginRes.json();

        if (loginRes.ok) {
          localStorage.setItem('token', result.token);
          window.location.href = result.redirectUrl;
        } else {
          alert(result.message);
        }
      },
    });

    provider.requestAccessToken();
  } catch (err) {
    console.error('Google OAuth Error', err);
  }
}

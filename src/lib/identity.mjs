import {betterAuth as MutliAuth} from 'better-auth';
import {emailOTP} from 'better-auth/plugins';

export function identityProviders(config) {
 return {google:!!(config.googleId&&config.googleSecret),github:!!(config.githubId&&config.githubSecret),email:!!(config.resendKey&&config.emailFrom)};
}

export function createIdentity(database,config,{fetcher=fetch}={}) {
 const providers=identityProviders(config);
 return MutliAuth({
  database,secret:config.secret,baseURL:config.baseURL,trustedOrigins:[new URL(config.baseURL).origin],
  socialProviders:{
   ...(providers.google?{google:{clientId:config.googleId,clientSecret:config.googleSecret}}:{}),
   ...(providers.github?{github:{clientId:config.githubId,clientSecret:config.githubSecret}}:{})
  },
  session:{expiresIn:7*86400,updateAge:86400},
  rateLimit:{enabled:true,storage:'database'},
  advanced:{cookiePrefix:'2unemployment',useSecureCookies:config.baseURL.startsWith('https:'),disableOriginCheck:false,disableCSRFCheck:false,ipAddress:{ipAddressHeaders:['cf-connecting-ip']}},
  plugins:providers.email?[emailOTP({
   otpLength:6,expiresIn:300,allowedAttempts:3,storeOTP:'hashed',
   async sendVerificationOTP({email,otp,type}) {
    if(type!=='sign-in')throw Error('Use email sign-in to verify your address');
    const response=await fetcher('https://api.resend.com/emails',{
     method:'POST',headers:{Authorization:`Bearer ${config.resendKey}`,'Content-Type':'application/json'},
     body:JSON.stringify({from:config.emailFrom,to:[email],subject:'Your 2unemployment sign-in code',text:`Your sign-in code is ${otp}. It expires in 5 minutes. If you did not request it, ignore this email.`,html:`<p>Your sign-in code is <strong>${otp}</strong>.</p><p>It expires in 5 minutes. If you did not request it, ignore this email.</p>`}),
     signal:AbortSignal.timeout(10000)
    });
    if(!response.ok)throw Error('Sign-in email could not be sent');
   }
  })]:[]
 });
}

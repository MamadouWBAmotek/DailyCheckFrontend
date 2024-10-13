import { useGoogleLogin } from "@react-oauth/google";

const login = useGoogleLogin({
    onSuccess: codeResponse => console.log(codeResponse),
    flow: 'auth-code',
  });
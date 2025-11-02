import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "./FireBase";

export default function setUpRecaptha(number) {
  const recaptchaVerifier = new RecaptchaVerifier(
    auth,
    "recaptcha-container",
    {}
  );
  recaptchaVerifier.render();
  return signInWithPhoneNumber(auth, number, recaptchaVerifier);
}

"use server";

const signIn = async (data: SignInProps): Promise<void> => {
  try {

  } catch (err) {
    console.error("Error logging in signing in", err);
  }
}

const signUp = async (data: SignUpProps): Promise<User> => {
  try {

  } catch (err) {
    console.error("Error logging in signing up", err);
  }

  return {firstName: ""};
}

const signOut = async (): Promise<void> => {
  try {

  } catch (err) {
    console.error("Error logging out signing out", err);
  }
}

export {signIn, signUp, signOut};

export const exchangePublicToken = async ({publicToken, user}: { publicToken: string, user: User }) => {
  try {

  } catch (err) {
    console.error("Error generateLinkToken", err);
  }

  return JSON.parse(JSON.stringify({publicTokenExchangeRes: true}));
}

export const generateLinkToken = async (user: User) => {
  try {

  } catch (err) {
    console.error("Error generateLinkToken", err);
  }
}

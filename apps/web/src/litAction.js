const _litActionCode = async () => {
    const ETCHED_AUTH_METHOD_TYPE = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes("Etched clerk auth method")
    );
    const URL = "http://104.197.211.139:3000/api/action"
    try {
        // Verify the token and user
        const verifyResponse = await fetch(URL, {
            body: JSON.stringify({ token, userId }),
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!verifyResponse.ok) {
            return Lit.Actions.setResponse({
                response: "false",
                reason: "Invalid token",
            });
        }

        const response = await verifyResponse.json();

        // Verify that the user data matches the verified user
        if (response.verifiedUser.sub.toLowerCase() !== userId.toLowerCase()) {
            return Lit.Actions.setResponse({
                response: "false",
                reason: "User ID mismatch",
            });
        }

        // Validate that the user data is recent
        const isRecent = Date.now() / 1000 - response.verifiedUser.exp < 600;
        if (!isRecent) {
            return Lit.Actions.setResponse({
                response: "false",
                reason: "Authenticated user data is older than 10 minutes",
            });
        }

        // Checking if usersAuthMethodId is a permitted Auth Method for pkpTokenId
        const usersAuthMethodId = ethers.utils.keccak256(
            ethers.utils.toUtf8Bytes(`etched:clerk:${userId}`)
        );

        const isPermitted = await Lit.Actions.isPermittedAuthMethod({
            tokenId: pkpTokenId,
            authMethodType: ETCHED_AUTH_METHOD_TYPE,
            userId: ethers.utils.arrayify(usersAuthMethodId),
        });

        if (!isPermitted) {
            return Lit.Actions.setResponse({
                response: "false",
                reason: "User is not authorized to use this PKP",
            });
        }

        return Lit.Actions.setResponse({ response: "true" });
    } catch (error) {
        return Lit.Actions.setResponse({
            response: "false",
            reason: `Error: ${error.message}`,
        });
    }
};

export const litActionCode = `(${_litActionCode.toString()})();`;
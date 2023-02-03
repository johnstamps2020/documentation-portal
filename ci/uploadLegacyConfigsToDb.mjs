import {writeFileSync} from "fs";

const base64ClientCreds = Buffer.from(`${process.env.OKTA_CLIENT_ID}:${process.env.OKTA_CLIENT_SECRET}`, 'utf-8').toString('base64')
const jwt = await fetch(`${process.env.OKTA_ACCESS_TOKEN_ISSUER}/v1/token?grant_type=client_credentials&scope=${process.env.OKTA_ACCESS_TOKEN_SCOPES}`, {
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${base64ClientCreds}`
    }
})

const json = await jwt.json();
if (json.errorCode) {
    throw new Error(`Failed to get access token from Okta: ${JSON.stringify(json)}`)
}
const accessToken = json.access_token;
console.log("Get access token from Okta: OK")

for (const entityType of ["source", "doc", "page", "openRoutes"]) {
    const response = await fetch(`${process.env.APP_BASE_URL}/safeConfig/entity/legacy/putConfigInDatabase/${entityType}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    })
    const json = await response.json();
    if (response.ok) {
        const jsonFileName = `response_${entityType}.json`;
        writeFileSync(jsonFileName, JSON.stringify(json));
        console.log(`Upload entities for ${entityType}: OK. For details, see the ${jsonFileName} file in the build artifacts.`)
    } else {
        console.log(JSON.stringify(json))
    }
}




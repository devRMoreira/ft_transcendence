export async function getUserData()
{
    const res = await fetch(`/api/profile?`, { method: "GET" })

    const data = await res.json();
    return data.userInfo
}
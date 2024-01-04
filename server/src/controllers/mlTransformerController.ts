export async function createVectorsFromText(text: string) {
  try {
    const response = await fetch('http://localhost:5555/encode', {
      method: 'POST',
      body: JSON.stringify({
        text: text,
      }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (response.ok) {
      return await response.json();
    }
    return [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

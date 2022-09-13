export async function setFromApi(url: string, setValue: React.Dispatch<any>) {
  const controller = new AbortController();
  const signal = controller.signal;
  const result = await fetch(url, { signal });
  if (result.ok) {
    const config = await result.json();
    setValue(config);
  }

  return () => {
    controller.abort();
  };
}

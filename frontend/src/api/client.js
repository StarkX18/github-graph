async function request(method, path, body) {
  const res = await fetch(`/api${path}`, {
    method,
    headers: body != null ? { 'Content-Type': 'application/json' } : {},
    body: body != null ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  getDomains: () => request('GET', '/domains'),
  createDomain: (name) => request('POST', '/domains', { name }),
  updateDomain: (id, updates) => request('PUT', `/domains/${id}`, updates),
  deleteDomain: (id) => request('DELETE', `/domains/${id}`),

  getGraphs: (domainId) => request('GET', `/graphs/domain/${domainId}`),
  createGraph: (domainId, data) => request('POST', `/graphs/domain/${domainId}`, data),
  updateGraph: (id, updates) => request('PUT', `/graphs/${id}`, updates),
  deleteGraph: (id) => request('DELETE', `/graphs/${id}`),

  getData: (graphId) => request('GET', `/data/graph/${graphId}`),
  setData: (graphId, date, entries) =>
    request('PUT', `/data/graph/${graphId}/${date}`, { entries }),
  deleteData: (graphId, date) => request('DELETE', `/data/graph/${graphId}/${date}`),
};

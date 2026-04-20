const DEFAULT_FRONTEND_URL = 'https://gameon11.netlify.app';

const normalizeFrontendUrl = (rawUrl) => {
  const candidate = (rawUrl || '').trim();
  const withDefault = candidate || DEFAULT_FRONTEND_URL;
  const withProtocol = /^https?:\/\//i.test(withDefault) ? withDefault : `https://${withDefault}`;
  const normalizedNetlifyDomain = withProtocol.replace(/\.netlify\.com(?=\/|$)/i, '.netlify.app');
  return normalizedNetlifyDomain.replace(/\/+$/, '');
};

const getFrontendUrl = () => normalizeFrontendUrl(process.env.FRONTEND_URL);

module.exports = {
  DEFAULT_FRONTEND_URL,
  normalizeFrontendUrl,
  getFrontendUrl,
};

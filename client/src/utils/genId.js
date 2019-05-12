export default () => `X${Math.random()
    .toString(16)
    .substr(2, 9)
    .toUpperCase()
    .replace(/(\n)/g, '')}`;
